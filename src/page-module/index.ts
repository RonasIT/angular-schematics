import {
  addRouteDeclarationToNgModule,
  getProjectPath,
  getRoutingModulePath,
  parseLocation,
  isThereDependencyInPackageJson,
  camelize,
  classify,
  dasherize
} from '../../core';
import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  schematic,
  Source,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { join, Path } from '@angular-devkit/core';
import { Schema as PageModuleOptions } from './schema';

function prepareOptions(host: Tree, options: PageModuleOptions): void {
  prepareOptionsPath(host, options);
  prepareOptionsName(host, options);
}

function prepareOptionsPath(host: Tree, options: PageModuleOptions): void {
  if (!options.path) {
    options.path = getProjectPath(host, options);
    options.path = join(options.path as Path, options.section);

    if (options.parent) {
      options.path = join(options.path as Path, options.parent);
    }
  }
}

function prepareOptionsName(host: Tree, options: PageModuleOptions): void {
  const location = parseLocation(options.path, options.name);

  options.name = location.name;
  options.path = location.path;
}

function prepareRules(host: Tree, options: PageModuleOptions): Array<Rule> {
  return [
    ...preparePageRules(host, options),
    ...prepareStoreRules(host, options),
    ...prepareFacadeRules(host, options)
  ];
}

function preparePageRules(host: Tree, options: PageModuleOptions): Array<Rule> {
  return [
    mergeWith(
      getPageTemplateSource(host, options),
      MergeStrategy.Overwrite
    ),
    addRouteDeclarationToNgModule({
      routeModule: getRouteModule(host, options),
      routingModulePath: getPageRoutingModulePath(host, options),
      routePath: options.name,
      path: options.path,
      isChildren: !options.parent
    })
  ];
}

function prepareStoreRules(host: Tree, options: PageModuleOptions): Array<Rule> {
  if (options.store) {
    return [
      schematic('store', {
        path: `${options.path}/${options.name}/shared/store`,
        section: options.section,
        parent: options.parent,
        page: options.name,
        name: ''
      })
    ];
  }

  return [];
}

function prepareFacadeRules(host: Tree, options: PageModuleOptions): Array<Rule> {
  if (options.facade) {
    return [
      schematic('facade', options)
    ];
  }

  return [];
}

function getPageTemplateSource(host: Tree, options: PageModuleOptions): Source {
  const isJestInstalled = isThereDependencyInPackageJson(host, 'jest');
  const isNgxTranslateInstalled = isThereDependencyInPackageJson(host, '@ngx-translate/core');
  const isNgrxInstalled = isThereDependencyInPackageJson(host, '@ngrx/store');

  return apply(url('./files'), [
    template({
      ...options,
      camelize,
      classify,
      dasherize,
      hasParent: !!options.parent,
      isJestInstalled,
      isNgxTranslateInstalled,
      isNgrxInstalled
    }),
    move(options.path)
  ]);
}

function getRouteModule(host: Tree, options: PageModuleOptions): string {
  return options.section + ' ' + ((!!options.parent) ? (options.parent + ' ') : '') + options.name + 'Page';
}

function getPageRoutingModulePath(host: Tree, options: PageModuleOptions): Path {
  return getRoutingModulePath(
    host,
    (options.parent)
      ? `${options.section}/${options.parent}/${options.parent}.routing.ts`
      : `${options.section}/${options.section}.routing.ts`
  );
}

export default function (options: PageModuleOptions): Rule {
  return (host: Tree) => {
    if (options.intoParent && !options.parent) {
      return schematic('page-module-parent', options);
    }

    prepareOptions(host, options);

    return chain(prepareRules(host, options));
  };
}
