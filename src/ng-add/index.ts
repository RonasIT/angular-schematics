import {
  chain,
  noop,
  Rule,
  SchematicContext,
  Tree
} from '@angular-devkit/schematics';
import { getWorkspace, getWorkspacePath, WorkspaceSchema } from '../../core';
import { Schema as SchematicOptions } from './schema';

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

export default function (options: SchematicOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      options && options.defaultCollection ? setAsDefaultSchematics() : noop(),
    ])(host, context);
  };
}