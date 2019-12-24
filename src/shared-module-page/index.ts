import { Rule, schematic, Tree } from '@angular-devkit/schematics';
import { Schema as SharedModulePageOptions } from './schema';

export default function (options: SharedModulePageOptions): Rule {
  return (host: Tree) => {
    if (options.intoParentPage) {
      return schematic('shared-module-parent-page', options);  
    }

    return schematic('shared-module', options);  
  };
} 