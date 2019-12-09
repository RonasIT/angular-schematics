import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: '<%= camelize(name) %>'
})
export class <% if (section) { %><%= classify(section) %><% } %><%= classify(name) %>Pipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}