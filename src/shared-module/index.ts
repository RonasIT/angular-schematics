import {
  apply,
  chain,
  filter,
  MergeStrategy,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  template,
  Tree,
  url
  } from '@angular-devkit/schematics';
import { getProjectPath, parseLocation } from '../../core';
import { join, Path, strings } from '@angular-devkit/core';
import { Schema as SharedModuleOptions } from './schema';

function prepareOptions(host: Tree, options: SharedModuleOptions): void {
  prepareOptionsType(options);
  prepareOptionsFlat(options);
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

function prepareOptionsFlat(options: SharedModuleOptions): void {
  options.flat = options.type !== 'component'
}

function getFolderNameByType(options: SharedModuleOptions): string {
  switch (options.type) {
    case 'component':
      return 'components';
    case 'directive':
      return 'directives';
    case 'pipe':
      return 'pipes';
    case 'service':
      return 'services';
    default:
      return 'unknown';
  }
}

function prepareOptionsPath(host: Tree, options: SharedModuleOptions): void {
  if (!options.path) {
    options.path = getProjectPath(host, options);

    if (options.section) {
      options.path = join(options.path as Path, strings.dasherize(options.section));
    }

    if (options.page) {
      options.path = join(options.path as Path, strings.dasherize(options.page));
    }

    if (options.page) {
      options.path = join(options.path as Path, 'shared', getFolderNameByType(options));

      if (!options.flat) {
        options.path = join(options.path as Path, strings.dasherize(options.name));
      }
    } else {
      options.path = join(options.path as Path, 'shared', strings.dasherize(options.name));
    }
  }

  const location = parseLocation(options.path, options.name);

  options.name = location.name;
  options.path = location.path;
}

function getTemplatesPath(options: SharedModuleOptions): string {
  let templatesPath = './files';
  switch (options.type) {
    case 'component':
      templatesPath = `${templatesPath}/component`;
      break;
    case 'directive':
      templatesPath = `${templatesPath}/directive`;
      break;
    case 'pipe':
      templatesPath = `${templatesPath}/pipe`;
      break;
    case 'service':
      templatesPath = `${templatesPath}/service`;
      break;
    default:
      break;
  }

  return templatesPath;
}

export default function (options: SharedModuleOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    prepareOptions(host, options);

    const templatesPath = getTemplatesPath(options);
    const templateSource = apply(url(templatesPath), [
      (options.page) ? filter((path) => !path.endsWith('.module.ts')) : noop(),
      template({
        ...options,
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        hasSection: !!options.section,
        hasPage: !!options.page
      }),
      move(options.path)
    ]);

    const rule = chain([
      mergeWith(templateSource, MergeStrategy.Overwrite)
    ]);

    return rule(host, context);
  };
}
