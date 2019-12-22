import { createAction } from '@ngrx/store';

export class <%= classify(section, parent, page, (page) ? 'Page' : name) %>Actions {
  /* tslint:disable:typedef */
  public static resetState = createAction(
    '[<%= classify(section, parent, page, (page) ? 'Page' : name) %>] Reset State'
  );
  /* tslint:enable:typedef */
}
