import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(section, parent, name) %>PageComponent } from './<%= dasherize(name) %>.component';
import { <%= classify(section, parent, name) %>PageRoutingModule } from './<%= dasherize(name) %>.routing';
import { RouterModule } from '@angular/router';<% if (isNgxTranslateInstalled) { %>
import { TranslateModule } from '@ngx-translate/core';<% } %>

@NgModule({
  declarations: [
    <%= classify(section, parent, name) %>PageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,<% if (isNgxTranslateInstalled) { %>
    TranslateModule,<% } %>
    <%= classify(section, parent, name) %>PageRoutingModule
  ],
  providers: []
})
export class <%= classify(section, parent, name) %>PageModule { }
