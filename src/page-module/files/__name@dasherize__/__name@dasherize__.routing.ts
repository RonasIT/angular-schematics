import { <%= classify(section) %><% if (parent) { %><%= classify(parent) %><% } %><%= classify(name) %>PageComponent } from './<%= dasherize(name) %>.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: <%= classify(section) %><% if (parent) { %><%= classify(parent) %><% } %><%= classify(name) %>PageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class <%= classify(section) %><% if (parent) { %><%= classify(parent) %><% } %><%= classify(name) %>PageRoutingModule { }
