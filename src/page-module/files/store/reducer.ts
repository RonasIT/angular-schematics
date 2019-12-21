import { Action, createReducer, on } from '@ngrx/store';
import { <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageActions } from './actions';
import { <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageState } from './state';

const initialState = new <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageState();

const reducer = createReducer(
  initialState,
  on(<%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageActions.resetState, () => initialState)
);

export function <%= camelize(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageReducer(state: <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageState | undefined, action: Action): <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageState {
  return reducer(state, action);
}
