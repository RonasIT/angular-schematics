import { Path } from '@angular-devkit/core';

export interface BuildRouteOptions {
  routeModule: string;
  routePath: string;
  routingModulePath: Path;
  isFirstRoute: boolean;
  path: string | Path;
}

export interface AddRouteDeclarationToNgModuleOptions {
  routeModule: string;
  routePath: string;
  routingModulePath: Path;
  path: string | Path;
}

export interface AddSymbolToNgModuleMetadataOptions {
  modulePath: Path;
  importPath: Path;
  importName: string;
  metadataField: 'bootstrap' | 'declarations' | 'entryComponents' | 'exports' | 'imports' | 'providers';
}

export interface AddSymbolToNgModuleOptions {
  modulePath: Path;
  importPath: Path;
  importName: string;
}

export interface Location {
  name: string;
  path: Path;
}

export declare const ROUTING_MODULE_EXT = '.routing.ts';
