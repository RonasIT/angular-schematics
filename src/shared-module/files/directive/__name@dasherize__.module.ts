import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(name) %>Directive } from './<%= dasherize(name) %>.directive';

@NgModule({
  declarations: [
    <%= classify(name) %>Directive
  ],
  imports: [
    CommonModule
  ],
  providers: []
})
export class <%= classify(name) %>Module { }
