import { getWorkspace } from './config';
import { join, normalize, Path } from '@angular-devkit/core';
import { MODULE_EXT } from '@schematics/angular/utility/find-module';
import { ROUTING_MODULE_EXT } from './interfaces';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { WorkspaceProject } from '@angular-devkit/core/src/experimental/workspace';

export function getProject(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
): WorkspaceProject {
  const workspace = getWorkspace(host);

  if (!options.project) {
    options.project =
      workspace.defaultProject === undefined
        ? Object.keys(workspace.projects)[0]
        : workspace.defaultProject
  }

  const project = workspace.projects[options.project];

  if (project && project.root.substr(-1) === '/') {
    project.root = project.root.substr(0, project.root.length - 1);
  }

  return project;
}

export function getProjectPath(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
): Path {
  const project = getProject(host, options);
  const projectDirName = project.projectType === 'application' ? 'app' : 'lib';

  return normalize(`${(project.root) ? `/${project.root}` : ''}/src/${projectDirName}`);
}

export function getAppRootPath(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
) {
  const project = getProject(host, options);

  return normalize(`${project.root}/src`);
}

export function getRootPath(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
): Path {
  const project = getProject(host, options);

  return project.root as Path;
}

export function getRoutingModulePath(host: Tree, modulePath: string): Path {
  const routingModulePath = modulePath.endsWith(ROUTING_MODULE_EXT)
    ? modulePath
    : modulePath.replace(MODULE_EXT, ROUTING_MODULE_EXT);

  const normalizedRoutingModulePath = join(getProjectPath(host, {}), normalize(routingModulePath));

  if (host.exists(normalizedRoutingModulePath)) {
    return normalizedRoutingModulePath;
  } else {
    throw new SchematicsException('Module does not exist');
  }
}

export function getAppStatePath(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
): Path {
  return join(getProjectPath(host, options), 'shared', 'store', 'state.ts');
}

export function isLib(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
) {
  const project = getProject(host, options);

  return project.projectType === 'library';
}