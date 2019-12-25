import { Rule, schematic, Tree } from '@angular-devkit/schematics';
import { Schema as StoreIntoSectionOptions } from './schema';

export default function (options: StoreIntoSectionOptions): Rule {
  return (host: Tree) => {
    if (options.intoSection) {
      return schematic('store-section', options);
    }

    return schematic('store-shared-module', options);
  };
}
