import { Component } from '@angular/core';

@Component({
  selector: 'app-<%= dasherize(name) %>-root',
  templateUrl: '<%= dasherize(name) %>.html',
  styleUrls: ['<%= dasherize(name) %>.scss']
})
export class <%= classify(name) %>Component {

}
