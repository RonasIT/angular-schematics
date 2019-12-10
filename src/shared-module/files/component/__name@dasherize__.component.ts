import { Component } from '@angular/core';

@Component({
  selector: '<% if (section) { %><%= dasherize(section) %>-<%= dasherize(name) %><% } else { %><% if (page) { %><%= dasherize(page) %>-<% } %><%= dasherize(name) %><% } %>',
  templateUrl: '<%= dasherize(name) %>.html',
  styleUrls: ['<%= dasherize(name) %>.scss']
})
export class <% if (section) { %><%= classify(section) %><% } %><% if (page) { %><%= classify(page) %><% } %><%= classify(name) %>Component { }