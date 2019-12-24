import { Rule, schematic, Tree } from '@angular-devkit/schematics';
import { Schema as StoreSharedModuleOptions } from './schema';

export default function (options: StoreSharedModuleOptions): Rule {
  return (host: Tree) => {
    return schematic('store', options);
  };
}
