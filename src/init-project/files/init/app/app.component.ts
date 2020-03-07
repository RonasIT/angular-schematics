import { Component<% if (isNgrxInstalled) { %>, ChangeDetectionStrategy<% } %> } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']<% if (isNgrxInstalled) { %>,
  changeDetection: ChangeDetectionStrategy.OnPush<% } %>
})
export class AppComponent {}
