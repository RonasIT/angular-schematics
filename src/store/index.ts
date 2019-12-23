import {
  addImportToModule,
  addImportToNgModuleMetadata,
  addPropertyToClass,
  camelize,
  classify,
  dasherize,
  getAppStatePath,
  getProjectPath
} from '../../core';
import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { join, Path, split } from '@angular-devkit/core';
import { MODULE_EXT } from '@schematics/angular/utility/find-module';
import { Schema as StoreOptions } from './schema';

interface StoreParts { appStateName: string, reducer: string, effects: string, state: string };

function prepareOptions(host: Tree, options: StoreOptions): void {
  prepareOptionsPath(host, options);
}

function prepareOptionsPath(host: Tree, options: StoreOptions): void {
  if (!options.path) {
    options.path = getProjectPath(host, options);

    if (options.section) {
      options.path = join(options.path as Path, dasherize(options.section));
    }

    if (options.parent) {
      options.path = join(options.path as Path, dasherize(options.parent));
    }

    if (options.page) {
      options.path = join(options.path as Path, dasherize(options.page));
    }

    if (options.page) {
      options.path = join(options.path as Path, 'shared', 'store');
    } else {
      options.path = join(options.path as Path, 'shared', dasherize(options.name), 'store');
    }
  }
}

function createStoreFiles(host: Tree, options: StoreOptions): Rule {
  const templateSource = apply(url('./files'), [
    template({
      ...options,
      camelize,
      classify,
      dasherize
    }),
    move(options.path)
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
}

function getStoreModuleImports(host: Tree, options: StoreOptions): Array<{ name: string, from: string }> {
  const storeParts = getStoreParts(host, options);

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
      name: storeParts.reducer,
      from: (options.page) ? './shared/store' : './store'
    },
    {
      name: storeParts.effects,
      from: (options.page) ? './shared/store' : './store'
    }
  ];
}

function getStoreMetadataImports(host: Tree, options: StoreOptions): Array<string> {
  const storeParts = getStoreParts(host, options);

  return [
    `StoreModule.forFeature('${storeParts.appStateName}', ${storeParts.reducer})`,
    `EffectsModule.forFeature([${storeParts.effects}])`
  ];
}

function getModulePath(options: StoreOptions): Path {
  const fragments = split(options.path as Path);
  const fragmentsToDelete = (!options.page && options.name) ? 1 : 2;
  const moduleFileName = (!options.page && options.name) ? options.name : options.page;

  fragments.splice(-fragmentsToDelete, fragmentsToDelete);

  return join(fragments[0], ...fragments, moduleFileName + MODULE_EXT);
}

function addStoreImports(host: Tree, options: StoreOptions): Rule {
  const moduleImports = getStoreModuleImports(host, options);
  const metadataImports = getStoreMetadataImports(host, options);
  const modulePath = getModulePath(options);

  return chain([
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
  ])
}

function getFullModuleName(host: Tree, options: StoreOptions, separator: string = ' '): string {
  const parts = [
    options.section,
    options.parent,
    options.page,
    (options.page) ? 'Page' : options.name
  ];

  return parts
    .filter((part) => !!part)
    .join(separator);
}

function getPathToModuleStore(host: Tree, options: StoreOptions): string {
  let parts;

  if (options.section) {
    parts = [
      '@app',
      dasherize(options.section),
      dasherize(options.parent),
      dasherize(options.page),
      'shared',
      (!options.page) ? dasherize(options.name) : '',
      'store'
    ];
  } else {
    parts = [
      '@shared',
      dasherize(options.name),
      'store'
    ];
  }

  return parts
    .filter((part) => !!part)
    .join('/');
}

function getStoreParts(host: Tree, options: StoreOptions): StoreParts {
  const fullModuleName = getFullModuleName(host, options);

  return {
    appStateName: camelize(fullModuleName),
    reducer: `${camelize(fullModuleName)}Reducer`,
    effects: `${classify(fullModuleName)}Effects`,
    state: `${classify(fullModuleName)}State`
  };
}

function addStateToAppState(host: Tree, options: StoreOptions): Rule {
  const storeParts = getStoreParts(host, options);
  const pathToStore = getPathToModuleStore(host, options);

  return addPropertyToClass({
    path: getAppStatePath(host, options),
    propertyName: storeParts.appStateName,
    propertyType: storeParts.state,
    propertyTypePath: pathToStore
  });
}

export default function (options: StoreOptions): Rule {
  return (host: Tree) => {
    prepareOptions(host, options);

    return chain([
      createStoreFiles(host, options),
      addStoreImports(host, options),
      addStateToAppState(host, options)
    ]);
  };
}
