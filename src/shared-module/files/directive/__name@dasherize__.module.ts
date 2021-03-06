import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Directive } from './<%= dasherize(name) %>.directive';

@NgModule({
  declarations: [
    <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Directive
  ],
  imports: [
    CommonModule
  ],
  providers: [],
  exports: [
    <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Directive
  ]
})
export class <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Module { }
