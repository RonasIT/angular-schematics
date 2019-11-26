import { addDepsToPackageJson, getAppRootPath } from '../../core';
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
import { Schema as InitNgRxOptions } from './schema';
import { strings } from '@angular-devkit/core';

const NGRX_VERSION = '^8.5.2';

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
  return addDepsToPackageJson(
    {
      '@ngrx/effects': NGRX_VERSION,
      '@ngrx/router-store': NGRX_VERSION,
      '@ngrx/store': NGRX_VERSION
    },
    {
      '@ngrx/store-devtools': NGRX_VERSION
    }
  );
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

