import { Rule, schematic, Tree } from '@angular-devkit/schematics';
import { Schema as PageModuleParentOptions } from './schema';

export default function (options: PageModuleParentOptions): Rule {
  return (host: Tree) => {
    return schematic('page-module', {
      name: options.pageName,
      section: options.section,
      parent: options.name,
      intoParent: options.intoParent,
      store: options.store,
      path: options.path
    });
  };
}