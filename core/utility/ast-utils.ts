import * as sortKeys from 'sort-keys';
import * as stripJsonComments from 'strip-json-comments';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { addRouteDeclarationToModule, addSymbolToNgModuleMetadata } from '@schematics/angular/utility/ast-utils';
import {
  AddRouteDeclarationToNgModuleOptions,
  AddSymbolToNgModuleMetadataOptions,
  AddSymbolToNgModuleOptions,
  BuildRouteOptions
} from './interfaces';
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

function _buildRoute(options: BuildRouteOptions): string {
  const routePath = strings.dasherize(options.routePath);
  const routeModule = strings.classify(options.routeModule);

  const routeModulePath = join(options.path as Path, routePath, routePath + MODULE_EXT.replace('.ts', ''));
  const relativeRouteModulePath = buildRelativePath(options.routingModulePath, routeModulePath);

  const loadChildren = `() => import('${relativeRouteModulePath}').then((module) => module.${routeModule}Module)`;

  let route = `{
    path: '${routePath}',
    loadChildren: ${loadChildren}
  }`;

  if (options.isFirstRoute) {
    route = `\n  ${route}\n`;
  }

  return route;
}

function _addSymbolToNgModuleMetadata(options: AddSymbolToNgModuleMetadataOptions): Rule {
  return (host: Tree) => {
    if (!options.modulePath || !options.importPath) {
      return host;
    }

    const text = host.read(options.modulePath);
    if (text === null) {
      throw new SchematicsException(`File ${options.modulePath} does not exist.`);
    }

    const sourceText = text.toString('utf-8');
    const source = ts.createSourceFile(options.modulePath, sourceText, ts.ScriptTarget.Latest, true);

    const relativePath = buildRelativePath(options.modulePath, options.importPath);
    const classifiedName = strings.classify(options.importName);

    const changes = addSymbolToNgModuleMetadata(source, options.modulePath, options.metadataField, classifiedName, relativePath);
    const recorder = host.beginUpdate(options.modulePath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(recorder);
  };
}

export function isRouteDeclarationExist(sourceText: string): boolean {
  return sourceText.includes('loadChildren');
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
    const addDeclaration = addRouteDeclarationToModule(
      ts.createSourceFile(options.routingModulePath, sourceText, ts.ScriptTarget.Latest, true),
      options.routingModulePath,
      _buildRoute({
        ...options,
        isFirstRoute: isRouteDeclarationExist(sourceText)
      }),
    ) as InsertChange;

    const recorder = host.beginUpdate(options.routingModulePath);
    recorder.insertLeft(addDeclaration.pos, addDeclaration.toAdd);
    host.commitUpdate(recorder);

    return host;
  };
}

export function addDeclarationToNgModule(options: AddSymbolToNgModuleOptions): Rule {
  return _addSymbolToNgModuleMetadata({
    ...options,
    metadataField: 'declarations'
  });
}

export function addProviderToNgModule(options: AddSymbolToNgModuleOptions): Rule {
  return _addSymbolToNgModuleMetadata({
    ...options,
    metadataField: 'providers'
  });
}

let installTaskAdded = false;

export function addDepsToPackageJson(
  deps: any,
  devDeps: any,
  addInstallTask = true
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
