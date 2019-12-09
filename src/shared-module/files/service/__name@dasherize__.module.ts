import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <% if (section) { %><%= classify(section) %><% } %><%= classify(name) %>Service } from './<%= dasherize(name) %>.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    <% if (section) { %><%= classify(section) %><% } %><%= classify(name) %>Service
  ]
})
export class <% if (section) { %><%= classify(section) %><% } %><%= classify(name) %>Module { }

