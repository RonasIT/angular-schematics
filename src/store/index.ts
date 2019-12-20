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
import { getProjectPath, parseLocation } from '../../core';
import { join, Path, strings } from '@angular-devkit/core';
import { Schema as StoreOptions } from './schema';

function prepareOptions(host: Tree, options: StoreOptions): void {
  prepareOptionsPath(host, options);
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
      options.path = join(options.path as Path, 'shared', 'store', (options.name) ? strings.dasherize(options.name) : '');
    } else {
      options.path = join(options.path as Path, 'shared', (options.name) ? strings.dasherize(options.name) : '', 'store');
    }
  }

  // const location = parseLocation(options.path, options.name);

  // options.name = location.name;
  // options.path = location.path;
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

export default function (options: StoreOptions): Rule {
  return (host: Tree) => {
    prepareOptions(host, options);

    return chain([
      createStoreFiles(host, options)
    ]);
  };
}
