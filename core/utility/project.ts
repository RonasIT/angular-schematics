import { getWorkspace } from './config';
import { Tree } from '@angular-devkit/schematics';

export interface WorkspaceProject {
  root: string;
  projectType: string;
}

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
) {
  if (options.path !== undefined) {
    return options.path;
  }

  const project = getProject(host, options);
  const projectDirName = project.projectType === 'application' ? 'app' : 'lib';

  return `${(project.root) ? `/${project.root}` : ''}/src/${projectDirName}`;
}

export function getAppRootPath(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
) {
  const project = getProject(host, options);

  return `${project.root}/src`;
}

export function getRootPath(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
) {
  const project = getProject(host, options);

  return project.root;
}

export function isLib(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
) {
  const project = getProject(host, options);

  return project.projectType === 'library';
}