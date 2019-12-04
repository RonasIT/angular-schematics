import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[<%= camelize(name) %>]'
})
export class <%= classify(name) %>Directive {
  constructor(
    private elementRef: ElementRef
  ) { }
}