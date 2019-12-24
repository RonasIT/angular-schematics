import { Rule, schematic, Tree } from '@angular-devkit/schematics';
import { Schema as StoreSectionOptions } from './schema';

export default function (options: StoreSectionOptions): Rule {
  return (host: Tree) => {
    if (options.intoPage) {
      return schematic('store-page', options);
    }

    return schematic('store-shared-module', options);
  };
}
