import { Rule, schematic, Tree } from '@angular-devkit/schematics';
import { Schema as SharedModuleSectionOptions } from './schema';

export default function (options: SharedModuleSectionOptions): Rule {
  return (host: Tree) => {
    if (options.intoPage) {
      return schematic('shared-module-page', options);  
    }

    return schematic('shared-module', options);  
  };
} 