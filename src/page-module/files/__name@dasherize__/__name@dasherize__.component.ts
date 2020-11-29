import { Component<% if (isNgrxInstalled) { %>, ChangeDetectionStrategy<% } %> } from '@angular/core';<% if (facade) { %>
import { <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageFacade } from './<%= dasherize(name) %>.facade';
import { Observable } from 'rxjs';<% } %>

@Component({
  selector: '<%= dasherize(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>-page',
  templateUrl: '<%= dasherize(name) %>.html',
  styleUrls: ['<%= dasherize(name) %>.scss']<% if (isNgrxInstalled) { %>,
  changeDetection: ChangeDetectionStrategy.OnPush<% } %>
})
export class <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageComponent {
<% if (facade) { %>  public isLoading$: Observable<boolean>;

  constructor(
    private facade: <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageFacade
  ) {
    this.isLoading$ = this.facade.isLoading$;
  }<% } %>
}
