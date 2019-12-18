import { createAction } from '@ngrx/store';

export class <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParentPage) ? (parentPage + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>Actions {
  /* tslint:disable:typedef */
  public static resetState = createAction(
    '[<%= classify(((hasSection) ? (section + ' ') : '') + ((hasParentPage) ? (parentPage + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>] Reset State'
  );
  /* tslint:enable:typedef */
}
