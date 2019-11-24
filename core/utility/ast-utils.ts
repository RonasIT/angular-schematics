import * as sortKeys from 'sort-keys';
import * as stripJsonComments from 'strip-json-comments';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { addRouteDeclarationToModule } from '@schematics/angular/utility/ast-utils';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { InsertChange } from '@schematics/angular/utility/change';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { normalize, Path, strings } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { serializeJson } from './file-utils';

export function buildRelativeModulePath(options: any): string {
  const importModulePath = normalize(
    `/${options.path}/`
    + (options.flat ? '' : strings.dasherize(options.name) + '/')
    + strings.dasherize(options.name)
    + '.module',
  );

  return buildRelativePath(options.module, importModulePath);
}

export function buildRoute(options: any) {
  const relativeModulePath = buildRelativeModulePath(options);
  const moduleName = `${strings.classify(options.name)}Module`;
  const loadChildren = `() => import('${relativeModulePath}').then((module) => module.${moduleName})`;

  let route =`{
    path: '${options.route}',
    loadChildren: ${loadChildren}
  }`;

  if (options.isFirstRoute) {
    route = `\n  ${route}\n`;
  }

  return route;
}

export function isRouteDeclarationExist(sourceText: string): boolean {
  return sourceText.includes('loadChildren');
}

export function addRouteDeclarationToNgModule(
  options: any,
  routingModulePath?: Path | undefined,
): Rule {
  return (host: Tree) => {
    if (!options.route) {
      return host;
    }
    if (!options.module) {
      throw new Error('Module option required when creating a lazy loaded routing module.');
    }

    let path: string;
    if (routingModulePath) {
      path = routingModulePath;
    } else {
      path = options.module;
    }

    const text = host.read(path);
    if (!text) {
      throw new Error(`Couldn't find the module nor its routing module.`);
    }

    const sourceText = text.toString();
    options.isFirstRoute = !isRouteDeclarationExist(sourceText);

    const addDeclaration = addRouteDeclarationToModule(
      ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true),
      path,
      buildRoute(options),
    ) as InsertChange;

    const recorder = host.beginUpdate(path);
    recorder.insertLeft(addDeclaration.pos, addDeclaration.toAdd);
    host.commitUpdate(recorder);

    return host;
  };
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
    throw new Error(`Cannot find ${path}`);
  }
  const contents = stripJsonComments(host.read(path)!.toString('utf-8'));
  try {
    return JSON.parse(contents);
  } catch (e) {
    throw new Error(`Cannot parse ${path}: ${e.message}`);
  }
}
