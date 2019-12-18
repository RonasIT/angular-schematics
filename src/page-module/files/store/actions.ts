import { createAction } from '@ngrx/store';

export class <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageActions {
  /* tslint:disable:typedef */
  public static refreshState = createAction(
    '[Public Login Page] Refresh State',
  );
  /* tslint:enable:typedef */
}
