import { Component } from '@angular/core';

@Component({
  selector: '<%= dasherize(section) %>-<%= dasherize(name) %>-page',
  templateUrl: '<%= dasherize(name) %>.html',
  styleUrls: ['<%= dasherize(name) %>.scss']
})
export class <%= classify(section) %><%= classify(name) %>PageComponent {

}
