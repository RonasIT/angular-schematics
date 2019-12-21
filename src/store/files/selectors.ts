import { AppState } from '@shared/store';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>State } from './state';

const selectFeature = (state: AppState) => state.<%= camelize(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>;

export class <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>Selectors {
  public static isLoading: MemoizedSelector<AppState, boolean> = createSelector(
    selectFeature,
    (state: <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>State) => state.isLoading
  );
}
