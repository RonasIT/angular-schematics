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
import { getProjectPath, parseLocation } from '../../core';
import { Schema as SectionModuleOptions } from './schema';
import { strings } from '@angular-devkit/core';

export default function (options: SectionModuleOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    const parsedPath = parseLocation(options.path, options.name);

    options.name = parsedPath.name;
    options.path = parsedPath.path;

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
    ]);

    return rule(host, context);
  };
}