import {
  addImportToModule,
  addImportToNgModuleMetadata,
  addPropertyToClass,
  addRouteDeclarationToNgModule,
  getAppStatePath,
  getProjectPath,
  getRoutingModulePath,
  parseLocation
} from '../../core';
import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  noop,
  Rule,
  Source,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { join, Path, strings } from '@angular-devkit/core';
import { MODULE_EXT } from '@schematics/angular/utility/find-module';
import { Schema as PageModuleOptions } from './schema';

interface StoreParts { appStateName: string, reducer: string, effects: string, state: string };

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
    ...prepareStoreRules(host, options)
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
      path: options.path
    })
  ];
}

function prepareStoreRules(host: Tree, options: PageModuleOptions): Array<Rule> {
  if (options.store) {
    return [
      mergeWith(
        getStoreTemplateSource(host, options),
        MergeStrategy.Overwrite
      ),
      ...addStoreImports(host, options)
    ];
  }

  return [noop()];
}

function getPageModulePath(options: PageModuleOptions): Path {
  return join(options.path as Path, strings.dasherize(options.name), strings.dasherize(options.name) + MODULE_EXT);
}

function getPageTemplateSource(host: Tree, options: PageModuleOptions): Source {
  return apply(url('./files/page'), [
    template({
      ...options,
      ...strings,
      hasParent: !!options.parent
    }),
    move(options.path)
  ]);
}

function getStoreTemplateSource(host: Tree, options: PageModuleOptions): Source {
  const storePath = getStorePath(host, options);

  return apply(url('./files/store'), [
    template({
      ...options,
      ...strings,
      hasParent: !!options.parent
    }),
    move(storePath)
  ])
}

function getRouteModule(host: Tree, options: PageModuleOptions): string {
  return options.section + ' ' + ((!!options.parent) ? (options.parent + ' ') : '') + options.name + 'Page'
}

function getPagePath(host: Tree, options: PageModuleOptions): Path {
  return join(options.path as Path, strings.dasherize(options.name));
}

function getStorePath(host: Tree, options: PageModuleOptions): string {
  return join(getPagePath(host, options), 'shared', 'store');
}

function getFullPageName(host: Tree, options: PageModuleOptions, separator: string = ' '): string {
  return options.section + separator + ((!!options.parent) ? (options.parent + separator) : '') + options.name;
}

function getStoreParts(host: Tree, options: PageModuleOptions, ): StoreParts {
  const fullPageName = getFullPageName(host, options);

  return {
    appStateName: `${strings.camelize(fullPageName)}Page`,
    reducer: `${strings.camelize(fullPageName)}Reducer`,
    effects: `${strings.classify(fullPageName)}PageEffects`,
    state: `${strings.classify(fullPageName)}PageState`
  };
}

function addStoreImports(host: Tree, options: PageModuleOptions): Array<Rule> {
  const storeParts = getStoreParts(host, options);

  const moduleImports = getStoreModuleImports(storeParts);
  const metadataImports = getStoreMetadataImports(storeParts);
  const modulePath = getPageModulePath(options);

  return [
    addPageStateToAppState(host, options, storeParts),
    ...moduleImports.map((item) =>
      addImportToModule({
        modulePath,
        importName: item.name,
        importFrom: item.from
      })
    ),
    ...metadataImports.map((metadataImport) =>
      addImportToNgModuleMetadata({
        modulePath,
        importName: metadataImport
      })
    )
  ];
}

function addPageStateToAppState(host: Tree, options: PageModuleOptions, storeParts: StoreParts): Rule {
  const propertyTypePath = '@app/' + ((options.parent)
    ? `${strings.dasherize(options.section)}/${strings.dasherize(options.parent)}/${strings.dasherize(options.name)}/shared/store`
    : `${strings.dasherize(options.section)}/${strings.dasherize(options.name)}/shared/store`);

  return addPropertyToClass({
    path: getAppStatePath(host, options),
    propertyName: storeParts.appStateName,
    propertyType: storeParts.state,
    propertyTypePath
  });
}

function getPageRoutingModulePath(host: Tree, options: PageModuleOptions): Path {
  return getRoutingModulePath(
    host,
    (options.parent)
      ? `${options.section}/${options.parent}/${options.parent}.routing.ts`
      : `${options.section}/${options.section}.routing.ts`
  )
}

function getStoreModuleImports(storeParts: StoreParts): Array<{ name: string, from: string }> {
  return [
    {
      name: 'StoreModule',
      from: '@ngrx/store'
    },
    {
      name: 'EffectsModule',
      from: '@ngrx/effects'
    },
    {
      name: `reducer as ${storeParts.reducer}`,
      from: './shared/store'
    },
    {
      name: storeParts.effects,
      from: './shared/store'
    }
  ];
}

function getStoreMetadataImports(storeParts: StoreParts): Array<string> {
  return [
    `StoreModule.forFeature('${storeParts.appStateName}', ${storeParts.reducer})`,
    `EffectsModule.forFeature([${storeParts.effects}])`
  ];
}

export default function (options: PageModuleOptions): Rule {
  return (host: Tree) => {
    prepareOptions(host, options);

    return chain(prepareRules(host, options));
  };
}