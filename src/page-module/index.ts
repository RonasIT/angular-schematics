import {
  addRouteDeclarationToNgModule,
  getProjectPath,
  getRoutingModulePath,
  parseLocation,
  addImportToModule,
  addImportToNgModuleMetadata
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
import { Schema as PageModuleOptions } from './schema';
import { MODULE_EXT } from '@schematics/angular/utility/find-module';

function getPageModulePath(options: PageModuleOptions): Path {
  return join(options.path as Path, strings.dasherize(options.name), strings.dasherize(options.name) + MODULE_EXT);
}

export default function (options: PageModuleOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.path) {
      options.path = getProjectPath(host, options);
      options.path = join(options.path as Path, options.section);

      if (options.parent) {
        options.path = join(options.path as Path, options.parent);
      }
    }

    const location = parseLocation(options.path, options.name);

    options.name = location.name;
    options.path = location.path;

    const rules = [
      mergeWith(
        apply(url('./files/page'), [
          template({
            ...options,
            ...strings,
            hasParent: !!options.parent
          }),
          move(options.path)
        ]),
        MergeStrategy.Overwrite
      ),
      addRouteDeclarationToNgModule({
        routeModule: options.section + ' ' + ((!!options.parent) ? (options.parent + ' ') : '') + options.name + 'Page',
        routePath: options.name,
        routingModulePath: getRoutingModulePath(
          host,
          (options.parent)
            ? `${options.section}/${options.parent}/${options.parent}.routing.ts`
            : `${options.section}/${options.section}.routing.ts`
        ),
        path: options.path
      })
    ];

    if (options.store) {
      const movePath = join(options.path as Path, (!!options.parent) ? strings.dasherize(options.parent) : '', strings.dasherize(options.name), 'shared', 'store');

      const page = `${strings.camelize(options.section + ' ' + ((!!options.parent) ? (options.parent + ' ') : '') + options.name)}Page`;
      const reducer = `${page}Reducer`;
      const effects = `${strings.classify(options.section + ' ' + ((!!options.parent) ? (options.parent + ' ') : '') + options.name)}PageEffects`;

      const moduleImports = [
        {
          name: 'StoreModule',
          from: '@ngrx/store'
        },
        {
          name: 'EffectsModule',
          from: '@ngrx/effects'
        },
        {
          name: `reducer as ${reducer}`,
          from: './shared/store'
        },
        {
          name: effects,
          from: './shared/store'
        }
      ];

      const metadataImports = [
        `StoreModule.forFeature('${page}', ${reducer})`,
        `EffectsModule.forFeature([${effects}])`
      ];

      const modulePath = getPageModulePath(options);

      const addImportToModuleRules = moduleImports.map((item) => addImportToModule({
        modulePath,
        importName: item.name,
        importFrom: item.from
      }));
    
      const addImportToNgModuleMetadataRules = metadataImports.map((metadataImport) => {
        return addImportToNgModuleMetadata({
          modulePath,
          importName: metadataImport
        });
      });

      rules.push(
        mergeWith(
          apply(url('./files/store'), [
            template({
              ...options,
              ...strings,
              hasParent: !!options.parent
            }),
            move(movePath)
          ]),
          MergeStrategy.Overwrite
        ),
        ...addImportToModuleRules,
        ...addImportToNgModuleMetadataRules
      );
    }

    return chain(rules);
  };
}