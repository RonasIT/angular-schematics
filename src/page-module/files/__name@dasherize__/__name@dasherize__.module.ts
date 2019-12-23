import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageComponent } from './<%= dasherize(name) %>.component';
import { <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageRoutingModule } from './<%= dasherize(name) %>.routing';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageRoutingModule
  ],
  providers: []
})
export class <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageModule { }
