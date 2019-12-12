import { fragment, normalize } from '@angular-devkit/core';
import { getAppRootPath, getProjectPath, getRootPath } from '../../core';
import { Rule, Tree } from '@angular-devkit/schematics';
import { Schema as InitProjectOptions } from './schema';

export function replaceEnvironmentsDirectory(host: Tree, options: InitProjectOptions): void {
  const appRootPath = getAppRootPath(host, options);
  const environmentsDirectory = host.getDir(normalize(`${appRootPath}/environments`));

  host.delete(normalize(`${appRootPath}/environments`));

  const environmentProdFileEntry = environmentsDirectory.file(fragment('environment.prod.ts'));
  const environmentFileEntry = environmentsDirectory.file(fragment('environment.ts'));
  if (environmentProdFileEntry !== null) {
    host.create(
      normalize(`${appRootPath}/configurations/configuration.prod.ts`),
      environmentProdFileEntry.content.toString().replace(/environment/g, 'configuration')
    );
  }

  if (environmentFileEntry !== null) {
    host.create(
      normalize(`${appRootPath}/configurations/configuration.ts`),
      environmentFileEntry.content.toString().replace(/environment/g, 'configuration')
    );
  }
}

export function replaceEnvironmentsInMainTs(host: Tree, options: InitProjectOptions): void {
  const appRootPath = getAppRootPath(host, options);
  const mainTsPath = normalize(`${appRootPath}/main.ts`);

  if (host.exists(mainTsPath)) {
    const mainTsContent = host.read(mainTsPath)!.toString('utf-8');
    host.overwrite(mainTsPath, mainTsContent.replace(/environment/g, 'configuration'));
  }
}

export function replaceEnvironmentsInAngularJson(host: Tree, options: InitProjectOptions): void {
  const rootPath = getRootPath(host, options);
  const configPath = normalize(`${rootPath}/angular.json`);

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

export function renameAppFiles(host: Tree, options: InitProjectOptions): void {
  const projectPath = getProjectPath(host, options);

  host.rename(
    normalize(`${projectPath}/app-routing.module.ts`),
    normalize(`${projectPath}/app.routing.ts`)
  );

  host.rename(
    normalize(`${projectPath}/app.component.html`),
    normalize(`${projectPath}/app.html`)
  );

  host.rename(
    normalize(`${projectPath}/app.component.scss`),
    normalize(`${projectPath}/app.scss`)
  );
}

export function replaceImportsInAppFiles(host: Tree, options: InitProjectOptions): void {
  const projectPath = getProjectPath(host, options);

  const appComponentPath = normalize(`${projectPath}/app.component.ts`);
  if (host.exists(appComponentPath)) {
    const appComponentContent = host.read(appComponentPath)!.toString('utf-8');
    host.overwrite(appComponentPath, appComponentContent.replace(/app\.component/g, 'app'));
  }

  const appModulePath = normalize(`${projectPath}/app.module.ts`);
  if (host.exists(appModulePath)) {
    const appModuleContent = host.read(appModulePath)!.toString('utf-8');
    host.overwrite(appModulePath, appModuleContent.replace(/app\-routing\.module/g, 'app.routing'));
  }
}

export default function (options: InitProjectOptions): Rule {
  return (host: Tree) => {
    replaceEnvironments(host, options);
    renameAppFiles(host, options);
    replaceImportsInAppFiles(host, options);

    return host;
  };
}

