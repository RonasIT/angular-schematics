import { Action, createReducer, on } from '@ngrx/store';
import { <%= classify(section, parent, page, (page) ? 'Page' : name) %>Actions } from './actions';
import { <%= classify(section, parent, page, (page) ? 'Page' : name) %>State } from './state';

const initialState = new <%= classify(section, parent, page, (page) ? 'Page' : name) %>State();

const reducer = createReducer(
  initialState,
  on(<%= classify(section, parent, page, (page) ? 'Page' : name) %>Actions.resetState, () => initialState)
);

export function <%= camelize(section, parent, page, (page) ? 'Page' : name) %>Reducer(state: <%= classify(section, parent, page, (page) ? 'Page' : name) %>State | undefined, action: Action): <%= classify(section, parent, page, (page) ? 'Page' : name) %>State {
  return reducer(state, action);
}
