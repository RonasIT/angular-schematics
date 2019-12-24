import { Rule, schematic, Tree } from '@angular-devkit/schematics';
import { Schema as StoreParentPageOptions } from './schema';

export default function (options: StoreParentPageOptions): Rule {
  return (host: Tree) => {
    return schematic('store', options);
  };
}
