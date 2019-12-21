import { Actions } from '@ngrx/effects';
import { AppState } from '@shared/store';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>Effects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>
  ) { }
}
