import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(name) %>Service } from './<%= dasherize(name) %>.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    <%= classify(name) %>Service
  ]
})
export class <%= classify(name) %>Module { }

