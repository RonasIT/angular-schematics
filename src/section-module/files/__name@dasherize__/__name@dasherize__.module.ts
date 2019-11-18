import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(name) %>Component } from './<%= dasherize(name) %>.component';
import { <%= classify(name) %>RoutingModule } from './<%= dasherize(name) %>.routing';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    <%= classify(name) %>Component
  ],
  imports: [
    CommonModule,
    RouterModule,
    <%= classify(name) %>RoutingModule
  ]
})
export class <%= classify(name) %>Module { }
