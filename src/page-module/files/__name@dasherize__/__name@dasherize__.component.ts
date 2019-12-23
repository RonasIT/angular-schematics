import { Component } from '@angular/core';

@Component({
  selector: '<%= dasherize(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>-page',
  templateUrl: '<%= dasherize(name) %>.html',
  styleUrls: ['<%= dasherize(name) %>.scss']
})
export class <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageComponent {

}
