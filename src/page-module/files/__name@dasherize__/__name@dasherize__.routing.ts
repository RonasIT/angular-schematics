import { <%= classify(section, parent, name) %>PageComponent } from './<%= dasherize(name) %>.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: <%= classify(section, parent, name) %>PageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class <%= classify(section, parent, name) %>PageRoutingModule { }
