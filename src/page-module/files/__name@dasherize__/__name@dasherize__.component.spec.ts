<% if (isJestInstalled) { %>import { <%= classify(section, parent, name) %>PageComponent } from './<%= dasherize(name) %>.component';<% if (store) { %>
import { <%= classify(section, parent, name) %>PageEffects, <%= camelize(section, parent, name) %>PageReducer } from './shared/store';
import { AppState } from '@shared/store/state';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';<% } %>
import { render, RenderResult } from '@testing-library/angular';<% if (isNgxTranslateInstalled) {%>
import { configuration } from '@configurations';
import { TranslateTestingModule } from 'ngx-translate-testing';<% } %><% if (facade) {%>
import { <%= classify(section, parent, name) %>PageFacade } from './<%= dasherize(name) %>.facade';<% } %>

describe('<%= classify(section, parent, name) %>PageComponent', () => {
  let component: RenderResult<<%= classify(section, parent, name) %>PageComponent>;
  let componentInstance: <%= classify(section, parent, name) %>PageComponent;<% if (store) { %>
  let store: Store<AppState>;<% } %>
<% if (isNgxTranslateInstalled) {%>
  const translation = require(`../../../<%= (hasParent) ? '../' : '' %>assets/i18n/${configuration.language.default}.json`);
<% } %>
  beforeEach(async () => {
    component = await render(<%= classify(section, parent, name) %>PageComponent, {
      imports: [
        <% if (isNgxTranslateInstalled) {%>TranslateTestingModule.withTranslations(configuration.language.default, translation),<% } %><% if (store) { %>
        StoreModule.forRoot({}, {
          runtimeChecks: {
            strictStateImmutability: true,
            strictActionImmutability: true
          }
        }),
        StoreModule.forFeature('<%= camelize(section, parent, name) %>Page', <%= camelize(section, parent, name) %>PageReducer),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([<%= classify(section, parent, name) %>PageEffects])<% } %>
      ],
      declarations: [
        <%= classify(section, parent, name) %>PageComponent
      ],
      routes: [],
      providers: [<% if (facade) {%><%= classify(section, parent, name) %>PageFacade<% } %>]
    });

    componentInstance = component.fixture.componentInstance;<% if (store) { %>
    store = TestBed.inject(Store);<% } %>
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });
});
<% } else { %>import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { <%= classify(section, parent, name) %>PageComponent } from './<%= dasherize(name) %>.component';

describe('<%= classify(section, parent, name) %>PageComponent', () => {
  let component: <%= classify(section, parent, name) %>PageComponent;
  let fixture: ComponentFixture<<%= classify(section, parent, name) %>PageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        <%= classify(section, parent, name) %>PageComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(<%= classify(section, parent, name) %>PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});<% } %>
