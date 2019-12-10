import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Pipe } from './<%= dasherize(name) %>.pipe';

@NgModule({
  declarations: [
    <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Pipe
  ],
  imports: [
    CommonModule
  ],
  providers: []
})
export class <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Module { }