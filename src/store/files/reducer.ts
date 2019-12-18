import { Action, createReducer, on } from '@ngrx/store';
import { <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParentPage) ? (parentPage + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>Actions } from './actions';
import { <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParentPage) ? (parentPage + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>State } from './state';

const initialState = new <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParentPage) ? (parentPage + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>State();

const reducer = createReducer(
  initialState,
  on(<%= classify(((hasSection) ? (section + ' ') : '') + ((hasParentPage) ? (parentPage + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>Actions.resetState, () => initialState)
);

export function <%= camelize(((hasSection) ? (section + ' ') : '') + ((hasParentPage) ? (parentPage + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>Reducer(state: <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParentPage) ? (parentPage + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>State | undefined, action: Action): <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParentPage) ? (parentPage + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>State {
  return reducer(state, action);
}
