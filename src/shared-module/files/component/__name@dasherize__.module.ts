import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Component } from './<%= dasherize(name) %>.component';<% if (isNgxTranslateInstalled) { %>
import { TranslateModule } from '@ngx-translate/core';<% } %>

@NgModule({
  declarations: [
    <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Component
  ],
  imports: [
    CommonModule<% if (isNgxTranslateInstalled) { %>,
    TranslateModule<% } %>
  ],
  providers: [],
  exports: [
    <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Component
  ]
})
export class <%= classify(((hasSection) ? (section + ' '): '') + ((hasSection && hasParentPage) ? (parentPage + ' ') : '') + ((hasSection && hasPage) ? (page + ' ') : '') + name) %>Module { }
