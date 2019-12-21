import {
  addPropertyToClass,
  getAppStatePath,
  getProjectPath,
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
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { join, Path, strings } from '@angular-devkit/core';
import { Schema as StoreOptions } from './schema';

interface StoreParts { appStateName: string, reducer: string, effects: string, state: string };

function prepareOptions(host: Tree, options: StoreOptions): void {
  prepareOptionsPath(host, options);
  // prepareOptionsName(host, options);
}

function prepareOptionsPath(host: Tree, options: StoreOptions): void {
  if (!options.path) {
    options.path = getProjectPath(host, options);

    if (options.section) {
      options.path = join(options.path as Path, strings.dasherize(options.section));
    }

    if (options.parent) {
      options.path = join(options.path as Path, strings.dasherize(options.parent));
    }

    if (options.page) {
      options.path = join(options.path as Path, strings.dasherize(options.page));
    }

    if (options.page) {
      options.path = join(options.path as Path, 'shared', 'store');
    } else {
      options.path = join(options.path as Path, 'shared', (options.name) ? strings.dasherize(options.name) : '', 'store');
    }
  }
}

function prepareOptionsName(host: Tree, options: StoreOptions): void {
  const location = parseLocation(options.path, options.name);

  options.name = location.name;
  options.path = location.path;
}

function createStoreFiles(host: Tree, options: StoreOptions): Rule {
  const hasSection = !!options.section;
  const hasParent = !!options.parent;
  const hasPage = !!options.page;
  const hasName = !!options.name;

  const templateSource = apply(url('./files'), [
    template({
      ...options,
      ...strings,
      hasSection,
      hasParent,
      hasPage,
      hasName
    }),
    move(options.path)
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
}

function addEffectsToNgModule(host: Tree, options: StoreOptions): Rule {
  return noop();
}

function addReducerToNgModule(host: Tree, options: StoreOptions): Rule {
  return noop();
}

function getFullModuleName(host: Tree, options: StoreOptions, separator: string = ' '): string {
  const parts = [
    options.section,
    options.parent,
    options.page,
    (options.page) ? 'Page' : '',
    (options.page) ? '' : options.name
  ];

  return parts
    .filter((part) => !!part)
    .join(separator);
}

function getPathToModuleStore(host: Tree, options: StoreOptions): string {
  const parts = [
    (options.section) ? '@app' : '@shared',
    (options.section) ? strings.dasherize(options.section) : '',
    (options.parent) ? strings.dasherize(options.parent) : '',
    (options.page) ? strings.dasherize(options.page) : '',
    (options.section) ? 'shared' : '',
    (options.page) ? 'store' : strings.dasherize(options.name),
    (options.page) ? '' : 'store'
  ];

  return parts
    .filter((part) => !!part)
    .join('/');
}

function getStoreParts(host: Tree, options: StoreOptions): StoreParts {
  const fullModuleName = getFullModuleName(host, options);

  return {
    appStateName: strings.camelize(fullModuleName),
    reducer: `${strings.camelize(fullModuleName)}Reducer`,
    effects: `${strings.classify(fullModuleName)}Effects`,
    state: `${strings.classify(fullModuleName)}State`
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
      addEffectsToNgModule(host, options),
      addReducerToNgModule(host, options),
      addStateToAppState(host, options)
    ]);
  };
}
