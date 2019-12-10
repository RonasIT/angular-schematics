import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <% if (section) { %><%= classify(section) %><% } %><% if (page) { %><%= classify(page) %><% } %><%= classify(name) %>Component } from './<%= dasherize(name) %>.component';

@NgModule({
  declarations: [
    <% if (section) { %><%= classify(section) %><% } %><% if (page) { %><%= classify(page) %><% } %><%= classify(name) %>Component
  ],
  imports: [
    CommonModule
  ],
  providers: []
})
export class <% if (section) { %><%= classify(section) %><% } %><% if (page) { %><%= classify(page) %><% } %><%= classify(name) %>Module { }
