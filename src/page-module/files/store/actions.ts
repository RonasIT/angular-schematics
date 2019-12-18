import { createAction } from '@ngrx/store';

export class <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageActions {
  /* tslint:disable:typedef */
  public static resetState = createAction(
    '[<%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>Page] Reset State'
  );
  /* tslint:enable:typedef */
}
