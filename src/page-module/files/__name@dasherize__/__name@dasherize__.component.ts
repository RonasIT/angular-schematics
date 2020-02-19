import { Component<% if (isNgrxInstalled) { %>, ChangeDetectionStrategy<% } %> } from '@angular/core';

@Component({
  selector: '<%= dasherize(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>-page',
  templateUrl: '<%= dasherize(name) %>.html',
  styleUrls: ['<%= dasherize(name) %>.scss']<% if (isNgrxInstalled) { %>,
  changeDetection: ChangeDetectionStrategy.OnPush<% } %>
})
export class <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageComponent {

}
