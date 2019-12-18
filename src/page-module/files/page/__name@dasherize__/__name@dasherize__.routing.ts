import { <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageComponent } from './<%= dasherize(name) %>.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageRoutingModule { }
