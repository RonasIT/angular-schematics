import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';<% if (store) { %>
import { <%= classify(section, parent, name) %>PageSelectors } from './shared/store';<% } %><% if (isNgrxInstalled) { %>
import { AppState } from '@shared/store';<% } %>

@Injectable()
export class <%= classify(section, parent, name) %>PageFacade {
  <% if (store) { %>public get isLoading$(): Observable<boolean> {
    return this.store.select(<%= classify(section, parent, name) %>PageSelectors.isLoading);
  }<% } %>
<% if (isNgrxInstalled) { %>
  constructor(
    private store: Store<AppState>
  ) { }<% } else { %>
  constructor() { }<% } %>
}
