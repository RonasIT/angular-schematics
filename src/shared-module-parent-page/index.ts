import { Rule, schematic, Tree } from '@angular-devkit/schematics';
import { Schema as SharedModuleParentPageOptions } from './schema';

export default function (options: SharedModuleParentPageOptions): Rule {
  return (host: Tree) => {
    return schematic('shared-module', options); 
  };
} 