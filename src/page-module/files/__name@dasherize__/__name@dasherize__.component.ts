import { Component<% if (isNgrxInstalled) { %>, ChangeDetectionStrategy<% } %> } from '@angular/core';<% if (facade) { %>
import { <%= classify(section, parent, name) %>PageFacade } from './<%= dasherize(name) %>.facade';
import { Observable } from 'rxjs';<% } %>

@Component({
  selector: '<%= dasherize(section, parent, name) %>-page',
  templateUrl: '<%= dasherize(name) %>.html',
  styleUrls: ['<%= dasherize(name) %>.scss']<% if (isNgrxInstalled) { %>,
  changeDetection: ChangeDetectionStrategy.OnPush<% } %>
})
export class <%= classify(section, parent, name) %>PageComponent {
<% if (facade) { %>  public isLoading$: Observable<boolean>;

  constructor(
    private facade: <%= classify(section, parent, name) %>PageFacade
  ) {
    this.isLoading$ = this.facade.isLoading$;
  }<% } %>
}
