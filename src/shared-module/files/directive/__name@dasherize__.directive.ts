import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[<% if (section) { %><%= camelize(section) %><%= classify(name) %><% } else { %><%= camelize(name) %><% } %>]'
})
export class <% if (section) { %><%= classify(section) %><% } %><%= classify(name) %>Directive {
  constructor(
    private elementRef: ElementRef
  ) { }
}