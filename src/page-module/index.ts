import { Rule, Tree } from '@angular-devkit/schematics';
import { Schema as PageModuleOptions } from './schema';

export default function (options: PageModuleOptions): Rule {
  return (host: Tree) => {
    console.log(1111);

    return host;
  };
}