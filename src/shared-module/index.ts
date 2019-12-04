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
import { Schema as SharedModuleOptions } from './schema';
import { strings, join, Path } from '@angular-devkit/core';

export default function (options: SharedModuleOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.type) {
      if (options.component) {
        options.type = 'component';
      } else if (options.directive) {
        options.type = 'directive';
      } else if (options.service) {
        options.type = 'service';
      } else {
        options.type = 'component';
      }
    }

    if (!options.path) {
      options.path = getProjectPath(host, options);
      if (options.type) {
        options.path = join(options.path as Path, 'shared', options.name);
      }
    }

    const location = parseLocation(options.path, options.name);

    options.name = location.name;
    options.path = location.path;

    let templatesPath = './files';
    if (options.type === 'component') {
      templatesPath = `${templatesPath}/component`;
    } else if (options.type === 'directive') {
      templatesPath = `${templatesPath}/directive`;
    } else if (options.type === 'service') {
      templatesPath = `${templatesPath}/service`;
    }

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