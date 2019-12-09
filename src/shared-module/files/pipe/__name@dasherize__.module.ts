import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { <%= classify(name) %>Pipe } from './<%= dasherize(name) %>.pipe';

@NgModule({
  declarations: [
    <%= classify(name) %>Pipe
  ],
  imports: [
    CommonModule
  ],
  providers: []
})
export class <%= classify(name) %>Module { }
