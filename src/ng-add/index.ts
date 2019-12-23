import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  noop,
} from '@angular-devkit/schematics';
import { Schema as SchematicOptions } from './schema';
import { WorkspaceSchema, getWorkspace, getWorkspacePath } from '../../core';

function updateWorkspace(host: Tree, key: keyof WorkspaceSchema, value: any) {
  const workspace: any = getWorkspace(host);
  const path = getWorkspacePath(host);
  workspace[key] = value;
  host.overwrite(path, JSON.stringify(workspace, null, 2));
}

function setAsDefaultSchematics() {
  const cli = {
    defaultCollection: '@ngrx/schematics',
  };
  return (host: Tree) => {
    updateWorkspace(host, 'cli', cli);
    return host;
  };
}

export default function(options: SchematicOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      options && options.defaultCollection ? setAsDefaultSchematics() : noop(),
    ])(host, context);
  };
}