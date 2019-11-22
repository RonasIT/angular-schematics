import {
  basename,
  dirname,
  join,
  normalize,
  Path
} from '@angular-devkit/core';

export interface Location {
  name: string;
  path: Path;
}

export function parseLocation(path: string, name: string): Location {
  const nameWithoutPath = basename(normalize(name));
  const namePath = dirname(join(normalize(path), name) as Path);

  return {
    name: nameWithoutPath,
    path: normalize('/' + namePath),
  };
}