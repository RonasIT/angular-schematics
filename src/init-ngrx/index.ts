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
import { getAppRootPath } from '../../core';
import { Schema as InitNgRxOptions } from './schema';
import { strings } from '@angular-devkit/core';

export function createAppStoreFiles(host: Tree, options: InitNgRxOptions): Rule {
  const appRootPath = getAppRootPath(host, options);

  const templateSource = apply(url('./files'), [
    template({
      ...options,
      classify: strings.classify,
      dasherize: strings.dasherize
    }),
    move(appRootPath)
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
}

export function addNgRxToPackageJson(host: Tree, options: InitNgRxOptions): Rule {
  return noop();
}

export function addNgRxImportsToAppModule(host: Tree, options: InitNgRxOptions): Rule {
  return noop();
}

export default function (options: InitNgRxOptions): Rule {
  return (host: Tree) => {
    return chain([
      createAppStoreFiles(host, options),
      addNgRxToPackageJson(host, options),
      addNgRxImportsToAppModule(host, options)
    ])
  };
}

