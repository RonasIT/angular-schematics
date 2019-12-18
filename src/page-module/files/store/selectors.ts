import { AppState } from '@shared/store';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageState } from './state';

const selectFeature = (state: AppState) => state.<%= camelize(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>Page;

export class <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageSelectors {
  public static isLoading: MemoizedSelector<AppState, boolean> = createSelector(
    selectFeature,
    (state: <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageState) => state.isLoading
  );
}
