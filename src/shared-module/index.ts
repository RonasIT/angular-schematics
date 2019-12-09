import {
  addRouteDeclarationToNgModule,
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
  Rule,
  SchematicContext,
  template,
  Tree,
  url
  } from '@angular-devkit/schematics';
import { join, Path, strings } from '@angular-devkit/core';
import { Schema as SharedModuleOptions } from './schema';

function prepareOptions(host: Tree, options: SharedModuleOptions): void {
  prepareOptionsType(options);
  prepareOptionsPath(host, options);
}

function prepareOptionsType(options: SharedModuleOptions): void {
  if (!options.type) {
    if (options.component) {
      options.type = 'component';
    } else if (options.directive) {
      options.type = 'directive';
    } else if (options.pipe) {
      options.type = 'pipe';
    } else if (options.service) {
      options.type = 'service';
    } else {
      options.type = 'component';
    }
  }
}

function prepareOptionsPath(host: Tree, options: SharedModuleOptions): void {
  if (!options.path) {
    options.path = getProjectPath(host, options);

    if (options.section) {
      options.path = join(options.path as Path, options.section);
    }

    options.path = join(options.path as Path, 'shared', options.name);
  }

  const location = parseLocation(options.path, options.name);

  options.name = location.name;
  options.path = location.path;
}

function getTemplatesPath(options: SharedModuleOptions): string {
  let templatesPath = './files';
  if (options.type === 'component') {
    templatesPath = `${templatesPath}/component`;
  } else if (options.type === 'directive') {
    templatesPath = `${templatesPath}/directive`;
  } else if (options.type === 'pipe') {
    templatesPath = `${templatesPath}/pipe`;
  } else if (options.type === 'service') {
    templatesPath = `${templatesPath}/service`;
  }

  return templatesPath;
}

export default function (options: SharedModuleOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    prepareOptions(host, options);

    const templatesPath = getTemplatesPath(options);
    const templateSource = apply(url(templatesPath), [
      template({
        ...options,
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize
      }),
      move(options.path)
    ]);

    const rule = chain([
      mergeWith(templateSource, MergeStrategy.Overwrite)
    ]);

    return rule(host, context);
  };
}
