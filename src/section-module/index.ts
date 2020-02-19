import {
  addRouteDeclarationToNgModule,
  getProjectPath,
  getRoutingModulePath,
  parseLocation,
  isThereDependencyInPackageJson
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
import { Schema as SectionModuleOptions } from './schema';
import { strings } from '@angular-devkit/core';

export default function (options: SectionModuleOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    const location = parseLocation(options.path, options.name);
    const isNgrxInstalled = isThereDependencyInPackageJson(host, '@ngrx/store');

    options.name = location.name;
    options.path = location.path;

    const templateSource = apply(url('./files'), [
      template({
        ...options,
        classify: strings.classify,
        dasherize: strings.dasherize,
        isNgrxInstalled
      }),
      move(options.path)
    ]);

    const rule = chain([
      mergeWith(templateSource, MergeStrategy.Overwrite),
      addRouteDeclarationToNgModule({
        routeModule: options.name,
        routePath: options.name,
        routingModulePath: getRoutingModulePath(host, 'app.routing.ts'),
        path: options.path
      })
    ]);

    return rule(host, context);
  };
}