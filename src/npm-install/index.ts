import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs';
import { spawn } from 'child_process';

export default function(): Rule {
  return (host: Tree, context: SchematicContext) => {
    return new Observable<Tree>(subscriber => {
      const child = spawn('npm', ['install', '--legacy-peer-deps'], { stdio: 'inherit' });
      child.on('error', error => {
        subscriber.error(error);
      });
      child.on('close', () => {
        subscriber.next(host);
        subscriber.complete();
      });
      return () => {
        child.kill();
      };
    });
  };
}
