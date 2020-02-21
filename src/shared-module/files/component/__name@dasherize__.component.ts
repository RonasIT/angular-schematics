import { Component<% if (isNgrxInstalled && hasNotRoot) { %>, ChangeDetectionStrategy<% } %> } from '@angular/core';

@Component({
  selector: '<%= dasherize(((hasSection && !hasPage) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>',
  templateUrl: '<%= dasherize(name) %>.html',
  styleUrls: ['<%= dasherize(name) %>.scss']<% if (isNgrxInstalled && hasNotRoot) { %>,
  changeDetection: ChangeDetectionStrategy.OnPush<% } %>
})
export class <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Component { }
