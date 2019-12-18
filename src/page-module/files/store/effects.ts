import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { AppState } from '@shared/store';
import { Injectable } from '@angular/core';

@Injectable()
export class <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>
  ) { }
}
