import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <% if (section) { %><%= classify(section) %><% } %><%= classify(name) %>Pipe } from './<%= dasherize(name) %>.pipe';

@NgModule({
  declarations: [
    <% if (section) { %><%= classify(section) %><% } %><%= classify(name) %>Pipe
  ],
  imports: [
    CommonModule
  ],
  providers: []
})
export class <% if (section) { %><%= classify(section) %><% } %><%= classify(name) %>Module { }
