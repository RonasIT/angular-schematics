import { AppState } from '@shared/store';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { <%= classify(section, parent, page, (page) ? 'Page' : name) %>State } from './state';

const selectFeature = (state: AppState) => state.<%= camelize(section, parent, page, (page) ? 'Page' : name) %> as <%= classify(section, parent, page, (page) ? 'Page' : name) %>State;

export class <%= classify(section, parent, page, (page) ? 'Page' : name) %>Selectors {
  public static isLoading: MemoizedSelector<AppState, boolean> = createSelector(
    selectFeature,
    (state: <%= classify(section, parent, page, (page) ? 'Page' : name) %>State) => state.isLoading
  );
}
