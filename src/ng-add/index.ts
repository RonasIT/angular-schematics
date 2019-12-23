import { getWorkspace, getWorkspacePath, WorkspaceSchema } from '../../core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

function updateWorkspace(host: Tree, key: keyof WorkspaceSchema, value: any) {
  const workspace: any = getWorkspace(host);
  const path = getWorkspacePath(host);
  workspace[key] = value;
  host.overwrite(path, JSON.stringify(workspace, null, 2));
}

function setAsDefaultSchematics() {
  const cli = {
    defaultCollection: '@ronas-it/angular-schematics',
  };
  return (host: Tree) => {
    updateWorkspace(host, 'cli', cli);
    return host;
  };
}

export default function (options: {}): Rule {
  return (host: Tree, context: SchematicContext) => {
    return setAsDefaultSchematics();
  };
}