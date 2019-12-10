import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[<%= dasherize(((hasSection && !hasPage) ? (section + ' '): '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>]'
})
export class <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Directive {
  constructor(
    private elementRef: ElementRef
  ) { }
}