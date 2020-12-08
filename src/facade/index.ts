import {
  addImportToFile,
  addProviderToNgModuleMetadata,
  camelize,
  classify,
  dasherize,
  getProjectPath,
  isThereDependencyInPackageJson
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
import { Schema as FacadeOptions } from './schema';
import { MODULE_EXT } from '@schematics/angular/utility/find-module';

function prepareOptions(host: Tree, options: FacadeOptions): void {
  prepareOptionsPath(host, options);
}

function prepareOptionsPath(host: Tree, options: FacadeOptions): void {
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

    if (options.name) {
      options.path = join(options.path as Path, 'shared', 'components', dasherize(options.name));
    }
  }
}

function createFacadeFile(host: Tree, options: FacadeOptions): Rule {
  const isNgrxInstalled = isThereDependencyInPackageJson(host, '@ngrx/store');

  const templateSource =  apply(url('./files'), [
    template({
      ...options,
      camelize,
      classify,
      dasherize,
      hasParent: !!options.parent,
      isNgrxInstalled
    }),
    move(options.path)
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
}

function getFacadeModuleImports(host: Tree, options: FacadeOptions): Array<{ name: string, from: string }> {
  const fileName = dasherize(options.name || options.page);

  return [
    {
      name: getFullModuleName(host, options),
      from: ((options.page && options.name) ? './shared/components' : './') + `${fileName}.facade`
    }
  ];
}

function getFacadeMetadataImports(host: Tree, options: FacadeOptions): Array<string> {
  return [
    getFullModuleName(host, options)
  ];
}

function getModulePath(options: FacadeOptions): Path {
  const fragments = split(options.path as Path);
  const fragmentsToDelete = (!options.page && options.name) ? 0 : 2;

  const moduleFileName = (!options.page && options.name)
    ? dasherize(options.name)
    : dasherize(options.page);

  fragments.splice(-fragmentsToDelete, fragmentsToDelete);

  return join(fragments[0], ...fragments, moduleFileName, moduleFileName + MODULE_EXT);
}

function addFacadeImports(host: Tree, options: FacadeOptions): Rule {
  const moduleImports = getFacadeModuleImports(host, options);
  const metadataImports = getFacadeMetadataImports(host, options);
  const modulePath = getModulePath(options);

  return chain([
    ...moduleImports.map((item) =>
      addImportToFile({
        filePath: modulePath,
        importName: item.name,
        importFrom: item.from
      })
    ),
    ...metadataImports.map((metadataImport) =>
    addProviderToNgModuleMetadata({
        modulePath,
        importName: metadataImport
      })
    )
  ])
}

function getFullModuleName(host: Tree, options: FacadeOptions, separator: string = ' '): string {
  const parts = [
    options.section,
    options.parent,
    options.page,
    options.name,
    'PageFacade'
  ];

  return classify(
    parts
      .filter((part) => !!part)
      .join(separator)
    );
}

export default function (options: FacadeOptions): Rule {
  return (host: Tree) => {
    prepareOptions(host, options);

    return chain([
      createFacadeFile(host, options),
      addFacadeImports(host, options)
    ]);
  };
}
