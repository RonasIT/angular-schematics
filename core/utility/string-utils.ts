import { strings } from '@angular-devkit/core';

function join(parts: Array<string>, separator: string = ' '): string {
  return parts
    .filter((part) => !!part)
    .join(separator);
}

export function dasherize(...parts: Array<string>): string {
  return strings.dasherize(join(parts));
}

export function camelize(...parts: Array<string>): string {
  return strings.camelize(join(parts));
}

export function classify(...parts: Array<string>): string {
  return strings.classify(join(parts));
}
