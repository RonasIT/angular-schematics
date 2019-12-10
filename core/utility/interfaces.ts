import { Path } from '@angular-devkit/core';

export interface BuildRelativePathOptions {
  path: string | Path;
  name: string;
  module: Path;
  postfix: string;
}

export interface BuildRouteOptions {
  name: string;
  module: Path;
  route: string;
  path: string | Path;
  isFirstRoute: boolean;
}

export interface AddRouteDeclarationToNgModuleOptions {
  name: string;
  module: Path;
  route: string;
  path: string | Path;
}

export interface Location {
  name: string;
  path: Path;
}

export declare const ROUTING_MODULE_EXT = '.routing.ts';