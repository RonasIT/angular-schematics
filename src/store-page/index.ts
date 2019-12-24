import { Rule, schematic, Tree } from '@angular-devkit/schematics';
import { Schema as StorePageOptions } from './schema';

export default function (options: StorePageOptions): Rule {
  return (host: Tree) => {
    if (options.intoParentPage) {
      return schematic('store-parent-page', options);
    }

    return schematic('store', options);
  };
}
