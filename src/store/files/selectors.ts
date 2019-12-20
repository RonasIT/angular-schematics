import { AppState } from '@shared/store';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>State } from './state';

const selectFeature = (state: AppState) => state.<%= camelize(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>;

export class <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>Selectors {
  public static isLoading: MemoizedSelector<AppState, boolean> = createSelector(
    selectFeature,
    (state: <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>State) => state.isLoading
  );
}
