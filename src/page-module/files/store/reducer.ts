import { Action, createReducer, on } from '@ngrx/store';
import { <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageActions } from './actions';
import { <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageState } from './state';

const initialState = new <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageState();

const reducers = createReducer(
  initialState,
  on(<%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageActions.refreshState, (state) => ({
    ...state,
    ...initialState
  }))
);

export function reducer(state: <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageState | undefined, action: Action): <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageState {
  return reducers(state, action);
}
