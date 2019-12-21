import { createAction } from '@ngrx/store';

export class <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>Actions {
  /* tslint:disable:typedef */
  public static resetState = createAction(
    '[<%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>] Reset State'
  );
  /* tslint:enable:typedef */
}
