import { Component<% if (isNgrxInstalled) { %>, ChangeDetectionStrategy<% } %> } from '@angular/core';

@Component({
  selector: 'app-<%= dasherize(name) %>-root',
  templateUrl: '<%= dasherize(name) %>.html',
  styleUrls: ['<%= dasherize(name) %>.scss']<% if (isNgrxInstalled) { %>,
  changeDetection: ChangeDetectionStrategy.OnPush<% } %>
})
export class <%= classify(name) %>Component {

}
