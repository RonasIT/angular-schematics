import { Component } from '@angular/core';

@Component({
  selector: '<%= dasherize(section) %><% if (parent) { %>-<%= dasherize(parent) %><% } %>-<%= dasherize(name) %>-page',
  templateUrl: '<%= dasherize(name) %>.html',
  styleUrls: ['<%= dasherize(name) %>.scss']
})
export class <%= classify(section) %><% if (parent) { %><%= classify(parent) %><% } %><%= classify(name) %>PageComponent {

}
