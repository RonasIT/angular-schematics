import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(name) %><%= (hasPage) ? 'Page' : '' %>Service } from './<%= dasherize(name) %>.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    <%= classify(name) %><%= (hasPage) ? 'Page' : '' %>Service
  ]
})
export class <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Module { }

