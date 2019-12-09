import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <% if (section) { %><%= classify(section) %><% } %><%= classify(name) %>Directive } from './<%= dasherize(name) %>.directive';

@NgModule({
  declarations: [
    <% if (section) { %><%= classify(section) %><% } %><%= classify(name) %>Directive
  ],
  imports: [
    CommonModule
  ],
  providers: []
})
export class <% if (section) { %><%= classify(section) %><% } %><%= classify(name) %>Module { }
