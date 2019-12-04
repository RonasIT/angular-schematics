import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(name) %>Component } from './<%= dasherize(name) %>.component';

@NgModule({
  declarations: [
    <%= classify(name) %>Component
  ],
  imports: [
    CommonModule
  ],
  providers: []
})
export class <%= classify(name) %>Module { }
