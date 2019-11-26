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
import { normalize } from 'path';
import { Schema as PageModuleOptions } from './schema';

export default function (options: PageModuleOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.path) {
      options.path = getProjectPath(host, options);
      options.path = normalize(`${options.path}/${options.section}`);

      if (options.parent) {
        options.path = join(options.path as Path, `/${options.parent}`);
      }
    }

    const location = parseLocation(options.path, options.name);

    options.name = location.name;
    options.path = location.path;

    const templateSource = apply(url('./files'), [
      template({
        ...options,
        classify: strings.classify,
        dasherize: strings.dasherize,
      }),
      move(options.path)
    ]);

    const rule = chain([
      mergeWith(templateSource, MergeStrategy.Overwrite),
      addRouteDeclarationToNgModule({
        name: options.name,
        route: strings.dasherize(options.name),
        path: options.path,
        module: getRoutingModulePath(
          host,
          (options.parent)
            ? `${options.section}/${options.parent}/${options.parent}.routing.ts`
            : `${options.section}/${options.section}.routing.ts`
        )
      })
    ]);

    return rule(host, context);
  };
}