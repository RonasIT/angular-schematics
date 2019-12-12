import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Pipe } from './<%= dasherize(name) %>.pipe';

@NgModule({
  declarations: [
    <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Pipe
  ],
  imports: [
    CommonModule
  ],
  providers: [],
  exports: [
    <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Pipe
  ]
})
export class <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Module { }
