import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Component } from './<%= dasherize(name) %>.component';

@NgModule({
  declarations: [
    <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Component
  ],
  imports: [
    CommonModule
  ],
  providers: []
})
export class <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Module { }
