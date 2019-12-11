import {
  addDeclarationToNgModule,
  getProjectPath,
  getSymbolImportPath,
  parseLocation,
  addProviderToNgModule
} from '../../core';
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
import {
  join,
  Path,
  split,
  strings
} from '@angular-devkit/core';
import { MODULE_EXT } from '@schematics/angular/utility/find-module';
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

function getPageModulePath(options: SharedModuleOptions): Path {
  const fragments = split(options.path as Path);
  const itemsToDelete = (options.type === 'component') ? 3 : 2;

  fragments.splice(-itemsToDelete, itemsToDelete);

  return join(fragments[0], ...fragments, strings.dasherize(options.page) + MODULE_EXT);
}

export default function (options: SharedModuleOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    prepareOptions(host, options);

    const hasSection = !!options.section;
    const hasPage = !!options.page;

    const templatesPath = getTemplatesPath(options);
    const templateSource = apply(url(templatesPath), [
      (options.page)
        ? filter((path) => !path.endsWith(MODULE_EXT))
        : noop(),
      template({
        ...options,
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        hasSection,
        hasPage
      }),
      move(options.path)
    ]);

    const rule = chain([
      mergeWith(templateSource, MergeStrategy.Overwrite),
      (hasPage && ['component', 'directive', 'pipe'].includes(options.type))
        ? addDeclarationToNgModule({
          modulePath: getPageModulePath(options),
          importPath: getSymbolImportPath(options),
          importName: [options.section, options.page, options.name, options.type].join(' ')
        })
        : noop(),
      (hasPage && options.type === 'service')
        ? addProviderToNgModule({
          modulePath: getPageModulePath(options),
          importPath: getSymbolImportPath(options),
          importName: [options.name, 'Page', options.type].join(' ')
        })
        : noop()
    ]);

    return rule(host, context);
  };
}
