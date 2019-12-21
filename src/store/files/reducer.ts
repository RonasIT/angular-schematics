import { Action, createReducer, on } from '@ngrx/store';
import { <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>Actions } from './actions';
import { <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>State } from './state';

const initialState = new <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>State();

const reducer = createReducer(
  initialState,
  on(<%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>Actions.resetState, () => initialState)
);

export function <%= camelize(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>Reducer(state: <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>State | undefined, action: Action): <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>State {
  return reducer(state, action);
}
