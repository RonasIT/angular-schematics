import * as sortKeys from 'sort-keys';
import * as stripJsonComments from 'strip-json-comments';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import {
  AddImportToModuleOptions,
  AddPropertyToClassOptions,
  AddRouteDeclarationToNgModuleOptions,
  AddSymbolToNgModuleMetadataOptions,
  AddSymbolToNgModuleOptions,
  AddTextToObjectOptions,
  BuildRouteOptions,
  UpsertBarrelFileOptions
} from './interfaces';
import {
  addRouteDeclarationToModule,
  addSymbolToNgModuleMetadata,
  findNode,
  findNodes,
  insertImport
} from '@schematics/angular/utility/ast-utils';
import { buildRelativePath, MODULE_EXT } from '@schematics/angular/utility/find-module';
import { InsertChange } from '@schematics/angular/utility/change';
import { join, Path, strings } from '@angular-devkit/core';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';
import { serializeJson } from './file-utils';
import { getRootPath } from './project';

function _buildRoute(options: BuildRouteOptions): string {
  const routePath = strings.dasherize(options.routePath);
  const routeModule = strings.classify(options.routeModule);

  const routeModulePath = join(options.path as Path, routePath, routePath + MODULE_EXT.replace('.ts', ''));
  const relativeRouteModulePath = buildRelativePath(options.routingModulePath, routeModulePath);

  const loadChildren = `() => import('${relativeRouteModulePath}').then((module) => module.${routeModule}Module)`;

  if (options.isChildren && options.isFirstRoute) {
    return `    {\n        path: '${routePath}',\n        loadChildren: ${loadChildren}\n      }\n    `;
  }

  if (options.isChildren) {
    return `    {\n        path: '${routePath}',\n        loadChildren: ${loadChildren}\n      }`;
  }

  if (options.isFirstRoute) {
    return `\n  {\n    path: '${routePath}',\n    loadChildren: ${loadChildren}\n  }\n`;
  }

  return `{\n    path: '${routePath}',\n    loadChildren: ${loadChildren}\n  }`;
}

function _removeStartComma(str: string): string {
  return (str[0] === ',') ? str.slice(1) : str;
}

function _addSymbolToNgModuleMetadata(options: AddSymbolToNgModuleMetadataOptions): Rule {
  return (host: Tree) => {
    if (!options.modulePath) {
      return host;
    }

    const text = host.read(options.modulePath);
    if (text === null) {
      throw new SchematicsException(`File ${options.modulePath} does not exist.`);
    }

    const sourceText = text.toString('utf-8');
    const source = ts.createSourceFile(options.modulePath, sourceText, ts.ScriptTarget.Latest, true);
    const isFirstSymbol = isMetadataFieldEmpty(sourceText, options.metadataField);

    let relativeImportPath;
    if (options.importPath) {
      relativeImportPath = buildRelativePath(options.modulePath, options.importPath);
    }

    let importName = options.importName;
    if (isFirstSymbol) {
      importName = `\n    ${importName}\n  `;
    }

    const changes = addSymbolToNgModuleMetadata(source, options.modulePath, options.metadataField, importName, relativeImportPath);
    const recorder = host.beginUpdate(options.modulePath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(recorder);
  };
}

function _getChildrenRoutesPosition(source: ts.SourceFile): number | null {
  const routes = findNodes(source, ts.SyntaxKind.VariableDeclarationList).find((item) => item.getText().includes('const routes: Routes'));
  if (routes === undefined) {
    return null;
  }
  const childrenRoutes = findNodes(routes, ts.SyntaxKind.PropertyAssignment).find((item) => item.getText().includes('children:'));
  if (childrenRoutes === undefined) {
    return null;
  }

  if (childrenRoutes.getText().includes('loadChildren: () =>')) {
    const lastChildrenRoute = findNodes(childrenRoutes, ts.SyntaxKind.ObjectLiteralExpression)
      .filter((item) => item.getText().includes('loadChildren: () =>'))
      .pop();
    return lastChildrenRoute?.end || null;
  }

  return childrenRoutes.end - 1;
}

export function isRouteDeclarationExist(sourceText: string): boolean {
  return sourceText.includes('loadChildren');
}

export function isMetadataFieldEmpty(sourceText: string, metadataField: string): boolean {
  const regexp = new RegExp(`${metadataField}: \\[\\s*\\]`);

  return regexp.test(sourceText);
}

export function addRouteDeclarationToNgModule(options: AddRouteDeclarationToNgModuleOptions): Rule {
  return (host: Tree) => {
    if (!options.routePath) {
      return host;
    }
    if (!options.routingModulePath) {
      throw new SchematicsException('Routing module path option required when creating a lazy loaded routing module.');
    }

    const text = host.read(options.routingModulePath);
    if (text === null) {
      throw new SchematicsException(`File ${options.routingModulePath} does not exist.`);
    }

    const sourceText = text.toString();
    const source = ts.createSourceFile(options.routingModulePath, sourceText, ts.ScriptTarget.Latest, true);
    const isFirstRoute = !isRouteDeclarationExist(sourceText);
    const addDeclaration = addRouteDeclarationToModule(
      source,
      options.routingModulePath,
      _buildRoute({
        ...options,
        isFirstRoute
      }),
    ) as InsertChange;
    const position = (options.isChildren) ? _getChildrenRoutesPosition(source) : addDeclaration.pos
    if (position === null) {
      throw new SchematicsException(`File ${options.routingModulePath} does not have routes.`);
    }
    const recorder = host.beginUpdate(options.routingModulePath);
    recorder.insertLeft(
      position,
      (options.isChildren && isFirstRoute) ? _removeStartComma(addDeclaration.toAdd) : addDeclaration.toAdd
    );
    host.commitUpdate(recorder);

    return host;
  };
}

export function addDeclarationToNgModuleMetadata(options: AddSymbolToNgModuleOptions): Rule {
  return _addSymbolToNgModuleMetadata({
    ...options,
    metadataField: 'declarations'
  });
}

export function addProviderToNgModuleMetadata(options: AddSymbolToNgModuleOptions): Rule {
  return _addSymbolToNgModuleMetadata({
    ...options,
    metadataField: 'providers'
  });
}

export function addImportToNgModuleMetadata(options: AddSymbolToNgModuleOptions): Rule {
  return _addSymbolToNgModuleMetadata({
    ...options,
    metadataField: 'imports'
  });
}

export function addImportToModule(options: AddImportToModuleOptions): Rule {
  return (host: Tree) => {
    if (!options.modulePath) {
      return host;
    }

    const text = host.read(options.modulePath);
    if (text === null) {
      throw new SchematicsException(`File ${options.modulePath} does not exist.`);
    }

    const sourceText = text.toString('utf-8');
    const source = ts.createSourceFile(options.modulePath, sourceText, ts.ScriptTarget.Latest, true);

    const change = insertImport(source, options.modulePath, options.importName, options.importFrom);

    if (change instanceof InsertChange) {
      const recorder = host.beginUpdate(options.modulePath);
      recorder.insertLeft(change.pos, change.toAdd);
      host.commitUpdate(recorder);
    }

    return host;
  };
}

export function addPropertyToClass(options: AddPropertyToClassOptions): Rule {
  return (host: Tree) => {
    const text = host.read(options.path);
    if (text === null) {
      throw new SchematicsException(`File ${options.path} does not exist.`);
    }

    const sourceText = text!.toString('utf-8');
    const source = ts.createSourceFile(options.path, sourceText, ts.ScriptTarget.Latest, true);

    const lastPropertyDeclaration = findNodes(source, ts.SyntaxKind.PropertyDeclaration).pop();

    const recorder = host.beginUpdate(options.path);
    recorder.insertRight(lastPropertyDeclaration!.end, `\n  public ${options.propertyName}?: ${options.propertyType};`);

    if (options.propertyTypePath) {
      const lastImportDeclaration = findNodes(source, ts.SyntaxKind.ImportDeclaration).pop();
      recorder.insertRight(lastImportDeclaration!.end, `\nimport { ${options.propertyType} } from '${options.propertyTypePath}';`);
    }
    host.commitUpdate(recorder);

    return host;
  };
}

export function addTextToObject(options: AddTextToObjectOptions): Rule {
  return (host: Tree) => {
    const text = host.read(options.path);
    if (text === null) {
      throw new SchematicsException(`File ${options.path} does not exist.`);
    }

    const sourceText = text!.toString('utf-8');
    const source = ts.createSourceFile(options.path, sourceText, ts.ScriptTarget.Latest, true);

    const node = findNode(source, ts.SyntaxKind.Identifier, options.identifier) as ts.Identifier;
    const objectLiteralExpression = node.parent.getChildren().find((child) => child.kind === ts.SyntaxKind.ObjectLiteralExpression) as ts.ObjectLiteralExpression;
    const closeBrace = objectLiteralExpression.getChildren().find((child) => child.kind === ts.SyntaxKind.CloseBraceToken);

    const recorder = host.beginUpdate(options.path);
    recorder.insertRight(closeBrace!.pos, options.text);
    host.commitUpdate(recorder);

    return host;
  };
}

export function upsertBarrelFile(options: UpsertBarrelFileOptions): Rule {
  return (host: Tree): Tree => {
    const barrelFile = join(options.path, 'index.ts');
    const exportContent = `export * from './${strings.dasherize(options.exportFileName)}';\n`;

    if (!host.exists(barrelFile)) {
      host.create(barrelFile, exportContent);
    } else {
      const existingExportContent = host.read(barrelFile);

      if (existingExportContent) {
        host.overwrite(barrelFile, existingExportContent.toString() + exportContent);
      }
    }

    return host;
  };
}

let installTaskAdded = false;

export function addDepsToPackageJson(
  deps: any = {},
  devDeps: any = {},
  addInstallTask: boolean = true
): Rule {
  return updateJsonInTree('package.json', (json, context: SchematicContext) => {
    json.dependencies = sortKeys({
      ...(json.dependencies || {}),
      ...deps
    });

    json.devDependencies = sortKeys({
      ...(json.devDependencies || {}),
      ...devDeps
    });

    if (addInstallTask && !installTaskAdded) {
      context.addTask(new NodePackageInstallTask());
      installTaskAdded = true;
    }

    return json;
  });
}

export function updateJsonInTree<T = any, O = T>(
  path: string,
  callback: (json: T, context: SchematicContext) => O
): Rule {
  return (host: Tree, context: SchematicContext): Tree => {
    if (!host.exists(path)) {
      host.create(path, serializeJson(callback({} as T, context)));
      return host;
    }
    host.overwrite(
      path,
      serializeJson(callback(readJsonInTree(host, path), context))
    );
    return host;
  };
}

export function isThereDependencyInPackageJson(host: Tree, dependency: string): boolean {
  const path = join(getRootPath(host, {}), 'package.json');
  const json = readJsonInTree(host, path);

  return json.dependencies.hasOwnProperty(dependency) || json.devDependencies.hasOwnProperty(dependency);
}

export function readJsonInTree<T = any>(host: Tree, path: string): T {
  if (!host.exists(path)) {
    throw new SchematicsException(`Cannot find ${path}`);
  }
  const contents = stripJsonComments(host.read(path)!.toString('utf-8'));
  try {
    return JSON.parse(contents);
  } catch (e) {
    throw new SchematicsException(`Cannot parse ${path}: ${e.message}`);
  }
}
