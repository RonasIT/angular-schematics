import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: '<%= camelize(name) %>'
})
export class <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Pipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}