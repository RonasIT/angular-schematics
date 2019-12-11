import { MODULE_EXT } from '@schematics/angular/utility/find-module';
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

export interface AddDeclarationToNgModule {
  modulePath: Path;
  name: string;
  classifiedName: string;
  type: 'component' | 'directive' | 'pipe';
  export: boolean;
  path: string | Path;
}

export interface Location {
  name: string;
  path: Path;
}

export declare const ROUTING_MODULE_EXT = '.routing.ts';
