import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(section) %><%= classify(name) %>PageComponent } from './<%= dasherize(name) %>.component';
import { <%= classify(section) %><%= classify(name) %>PageRoutingModule } from './<%= dasherize(name) %>.routing';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    <%= classify(section) %><%= classify(name) %>PageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    <%= classify(section) %><%= classify(name) %>PageRoutingModule
  ],
  providers: []
})
export class <%= classify(section) %><%= classify(name) %>PageModule { }
