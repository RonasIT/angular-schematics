import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(section) %><% if (parent) { %><%= classify(parent) %><% } %><%= classify(name) %>PageComponent } from './<%= dasherize(name) %>.component';
import { <%= classify(section) %><% if (parent) { %><%= classify(parent) %><% } %><%= classify(name) %>PageRoutingModule } from './<%= dasherize(name) %>.routing';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    <%= classify(section) %><% if (parent) { %><%= classify(parent) %><% } %><%= classify(name) %>PageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    <%= classify(section) %><% if (parent) { %><%= classify(parent) %><% } %><%= classify(name) %>PageRoutingModule
  ],
  providers: []
})
export class <%= classify(section) %><% if (parent) { %><%= classify(parent) %><% } %><%= classify(name) %>PageModule { }
