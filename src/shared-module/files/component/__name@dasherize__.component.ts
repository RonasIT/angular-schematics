import { Component } from '@angular/core';

@Component({
  selector: '<% if (section) { %><%= dasherize(section) %>-<%= dasherize(name) %><% } else { %><%= dasherize(name) %><% } %>',
  templateUrl: '<%= dasherize(name) %>.html',
  styleUrls: ['<%= dasherize(name) %>.scss']
})
export class <% if (section) { %><%= classify(section) %><% } %><%= classify(name) %>Component { }