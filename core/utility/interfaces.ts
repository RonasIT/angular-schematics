import { Path } from '@angular-devkit/core';

export interface BuildRouteOptions {
  routeModule: string;
  routePath: string;
  routingModulePath: Path;
  isFirstRoute: boolean;
  isFirstChildrenRoute: boolean;
  path: string | Path;
  isChildren?: boolean;
}

export interface AddRouteDeclarationToNgModuleOptions {
  routeModule: string;
  routePath: string;
  routingModulePath: Path;
  path: string | Path;
  isChildren?: boolean;
}

export interface AddSymbolToNgModuleMetadataOptions {
  modulePath: Path;
  importPath?: Path;
  importName: string;
  metadataField: 'bootstrap' | 'declarations' | 'entryComponents' | 'exports' | 'imports' | 'providers';
}

export interface AddSymbolToNgModuleOptions {
  modulePath: Path;
  importPath?: Path;
  importName: string;
}

export interface AddImportToFileOptions {
  filePath: Path;
  importName: string;
  importFrom: string;
}

export interface AddChangeDetectionToComponentOptions {
  componentPath: Path;
}

export interface UpsertBarrelFileOptions {
  path: Path;
  exportFileName: string;
}

export interface AddPropertyToClassOptions {
  path: Path;
  propertyName: string;
  propertyType: string;
  propertyTypePath?: Path | string;
}

export interface AddTextToObjectOptions {
  path: Path;
  identifier: string;
  text: string;
}

export interface Location {
  name: string;
  path: Path;
}

export const BARREL_FILE = 'index.ts';
export const ROUTING_MODULE_EXT = '.routing.ts';
