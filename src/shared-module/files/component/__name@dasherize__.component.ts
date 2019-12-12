import { Component } from '@angular/core';

@Component({
  selector: '<%= dasherize(((hasSection && !hasPage) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>',
  templateUrl: '<%= dasherize(name) %>.html',
  styleUrls: ['<%= dasherize(name) %>.scss']
})
export class <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Component { }
