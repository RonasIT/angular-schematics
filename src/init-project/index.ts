import { fragment } from '@angular-devkit/core';
import { getAppRootPath, getProjectPath, getRootPath } from '../../core';
import { Rule, Tree } from '@angular-devkit/schematics';
import { Schema as InitProjectOptions } from './schema';

export function replaceEnvironmentsDirectory(host: Tree, options: InitProjectOptions): void {
  const appRootPath = getAppRootPath(host, options);
  const environmentsDirectory = host.getDir(`${appRootPath}/environments`);

  host.delete(`${appRootPath}/environments`);

  const environmentProdFileEntry = environmentsDirectory.file(fragment('environment.prod.ts'));
  const environmentFileEntry = environmentsDirectory.file(fragment('environment.ts'));
  if (environmentProdFileEntry !== null) {
    host.create(
      `${appRootPath}/configurations/configuration.prod.ts`,
      environmentProdFileEntry.content.toString().replace(/environment/g, 'configuration')
    );
  }

  if (environmentFileEntry !== null) {
    host.create(
      `${appRootPath}/configurations/configuration.ts`,
      environmentFileEntry.content.toString().replace(/environment/g, 'configuration')
    );
  }
}

export function replaceEnvironmentsInMainTs(host: Tree, options: InitProjectOptions): void {
  const appRootPath = getAppRootPath(host, options);
  const mainTsPath = `${appRootPath}/main.ts`;

  if (host.exists(mainTsPath)) {
    const mainTsContent = host.read(mainTsPath)!.toString('utf-8');
    host.overwrite(mainTsPath, mainTsContent.replace(/environment/g, 'configuration'));
  }
}

export function replaceEnvironmentsInAngularJson(host: Tree, options: InitProjectOptions): void {
  const rootPath = getRootPath(host, options);
  const configPath = `${rootPath}/angular.json`;

  if (host.exists(configPath)) {
    const angularJsonContent = host.read(configPath)!.toString('utf-8');
    host.overwrite(configPath, angularJsonContent.replace(/environment/g, 'configuration'));
  }
}

export function replaceEnvironments(host: Tree, options: InitProjectOptions): void {
  replaceEnvironmentsDirectory(host, options);
  replaceEnvironmentsInMainTs(host, options);
  replaceEnvironmentsInAngularJson(host, options);
}

export function replaceRouting(host: Tree, options: InitProjectOptions): void {
  const projectPath = getProjectPath(host, options);

  host.rename(`${projectPath}/app-routing.module.ts`, `${projectPath}/app.routing.ts`);
}

export default function (options: InitProjectOptions): Rule {
  return (host: Tree) => {
    replaceEnvironments(host, options);
    replaceRouting(host, options);

    return host;
  };
}

