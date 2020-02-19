import {
  addDepsToPackageJson,
  addImportToModule,
  addImportToNgModuleMetadata,
  addTextToObject,
  getAppRootPath,
  getProjectPath,
  getRootPath,
  updateJsonInTree,
  addImportToComponent,
  addChangeDetectionToComponent
} from '../../core';
import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  schematic,
  SchematicContext,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import {
  fragment,
  join,
  normalize,
  strings
} from '@angular-devkit/core';
import { Schema as InitProjectOptions } from './schema';

function replaceEnvironmentsDirectory(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    const appRootPath = getAppRootPath(host, options);
    const environmentsDirectory = host.getDir(normalize(`${appRootPath}/environments`));

    host.delete(normalize(`${appRootPath}/environments`));

    const environmentProdFileEntry = environmentsDirectory.file(fragment('environment.prod.ts'));
    const environmentFileEntry = environmentsDirectory.file(fragment('environment.ts'));
    if (environmentProdFileEntry !== null) {
      host.create(
        normalize(`${appRootPath}/configurations/configuration.prod.ts`),
        environmentProdFileEntry.content.toString().replace(/environment/g, 'configuration')
      );
    }

    if (environmentFileEntry !== null) {
      host.create(
        normalize(`${appRootPath}/configurations/configuration.ts`),
        environmentFileEntry.content.toString().replace(/environment/g, 'configuration')
      );
    }

    return host;
  };
}

function replaceEnvironmentsInMainTs(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    const appRootPath = getAppRootPath(host, options);
    const mainTsPath = normalize(`${appRootPath}/main.ts`);

    if (host.exists(mainTsPath)) {
      const mainTsContent = host.read(mainTsPath)!.toString('utf-8');
      host.overwrite(mainTsPath, mainTsContent.replace(/environment/g, 'configuration'));
    }

    return host;
  };
}

function replaceEnvironmentsInAngularJson(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    const rootPath = getRootPath(host, options);
    const configPath = normalize(`${rootPath}/angular.json`);

    if (host.exists(configPath)) {
      const angularJsonContent = host.read(configPath)!.toString('utf-8');
      host.overwrite(configPath, angularJsonContent.replace(/environment/g, 'configuration'));
    }

    return host;
  };
}

function replaceEnvironments(host: Tree, options: InitProjectOptions): Rule {
  return chain([
    replaceEnvironmentsDirectory(host, options),
    replaceEnvironmentsInMainTs(host, options),
    replaceEnvironmentsInAngularJson(host, options),
  ]);
}

function renameAppFiles(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    const projectPath = getProjectPath(host, options);

    host.rename(
      normalize(`${projectPath}/app-routing.module.ts`),
      normalize(`${projectPath}/app.routing.ts`)
    );

    host.rename(
      normalize(`${projectPath}/app.component.html`),
      normalize(`${projectPath}/app.html`)
    );

    host.rename(
      normalize(`${projectPath}/app.component.scss`),
      normalize(`${projectPath}/app.scss`)
    );
  };
}

function replaceImportsInAppFiles(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    const projectPath = getProjectPath(host, options);

    const appComponentPath = normalize(`${projectPath}/app.component.ts`);
    if (host.exists(appComponentPath)) {
      const appComponentContent = host.read(appComponentPath)!.toString('utf-8');
      host.overwrite(appComponentPath, appComponentContent.replace(/app\.component/g, 'app'));
    }

    const appModulePath = normalize(`${projectPath}/app.module.ts`);
    if (host.exists(appModulePath)) {
      const appModuleContent = host.read(appModulePath)!.toString('utf-8');
      host.overwrite(appModulePath, appModuleContent.replace(/app\-routing\.module/g, 'app.routing'));
    }
  };
}

function addAliasesToTsConfig(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    return updateJsonInTree('tsconfig.json', (json, context: SchematicContext) => {
      json.compilerOptions.paths = {
        '@app/*': [
          'src/app/*'
        ],
        '@shared/*': [
          'src/app/shared/*'
        ],
        '@configurations': [
          'src/configurations/configuration'
        ],
        '@tests/*': [
          'src/tests/*'
        ]
      };

      return json;
    });
  };
}

function updateTsLint(host: Tree, options: InitProjectOptions): Rule {
  return chain([
    updateTsLintRules(host, options),
    updateTsLintConfig(host, options)
  ]);
}

const CODELYZER_VERSION = '^5.2.1';
const TSLINT_VERSION = '^5.20.1';
const RONAS_IT_TSLINT_RULES_VERSION = '^1.0.3';
const TS_NODE_VERSION = '^8.5.4';

function updateTsLintRules(host: Tree, options: InitProjectOptions): Rule {
  return addDepsToPackageJson(
    {},
    {
      'codelyzer': CODELYZER_VERSION,
      'tslint': TSLINT_VERSION,
      '@ronas-it/tslint-rules': RONAS_IT_TSLINT_RULES_VERSION,
      'ts-node': TS_NODE_VERSION
    }
  );
}

function updateTsLintConfig(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    return updateJsonInTree('tslint.json', (json, context: SchematicContext) => {
      return {
        'rulesDirectory': [
          'node_modules/codelyzer',
          'node_modules/@ronas-it/tslint-rules'
        ],
        'rules': {
          'member-access-except-decorators': true,
          'encoding': true,
          'no-boolean-literal-compare': true,
          'newline-before-return': true,
          'deprecation': true,
          'new-parens': true,
          'binary-expression-operand-order': true,
          'array-type': [
            true,
            'generic'
          ],
          'arrow-parens': true,
          'no-duplicate-imports': true,
          'max-classes-per-file': [
            true,
            1,
            'exclude-class-expressions'
          ],
          'linebreak-style': [
            true,
            'LF'
          ],
          'prefer-object-spread': true,
          'arrow-return-shorthand': true,
          'callable-types': true,
          'class-name': true,
          'comment-format': [
            true,
            'check-space'
          ],
          'curly': true,
          'eofline': true,
          'import-blacklist': [
            true,
            'rxjs/Rx'
          ],
          'import-spacing': true,
          'indent': [
            true,
            'spaces',
            2
          ],
          'interface-over-type-literal': true,
          'label-position': true,
          'max-line-length': [
            true,
            {
              'limit': 120,
              'ignore-pattern': '[^import|^export]'
            }
          ],
          'typedef': [
            true,
            'call-signature',
            'parameter',
            'member-variable-declaration'
          ],
          'member-ordering': [
            true,
            {
              'order': [
                'public-static-field',
                'protected-static-field',
                'private-static-field',
                'public-instance-field',
                'protected-instance-field',
                'private-instance-field',
                'public-constructor',
                'protected-constructor',
                'private-constructor',
                'public-static-method',
                'public-instance-method',
                'protected-static-method',
                'protected-instance-method',
                'private-static-method',
                'private-instance-method'
              ]
            }
          ],
          'no-arg': true,
          'no-console': [
            true,
            'debug',
            'log',
            'info',
            'time',
            'timeEnd',
            'trace'
          ],
          'only-arrow-functions': [
            true,
            'allow-named-functions'
          ],
          'no-duplicate-variable': [
            true,
            'check-parameters'
          ],
          'no-return-await': true,
          'prefer-for-of': true,
          'no-reference': true,
          'no-namespace': true,
          'no-construct': true,
          'no-debugger': true,
          'no-duplicate-super': true,
          'no-empty-interface': true,
          'no-eval': true,
          'no-misused-new': true,
          'no-non-null-assertion': true,
          'no-string-literal': false,
          'no-string-throw': true,
          'no-switch-case-fall-through': true,
          'no-trailing-whitespace': true,
          'no-unnecessary-initializer': true,
          'no-unused-expression': true,
          'no-var-keyword': true,
          'object-literal-sort-keys': false,
          'one-line': [
            true,
            'check-open-brace',
            'check-catch',
            'check-else',
            'check-whitespace'
          ],
          'prefer-const': true,
          'quotemark': [
            true,
            'single'
          ],
          'semicolon': [
            true,
            'always'
          ],
          'triple-equals': true,
          'typedef-whitespace': [
            true,
            {
              'call-signature': 'nospace',
              'index-signature': 'nospace',
              'parameter': 'nospace',
              'property-declaration': 'nospace',
              'variable-declaration': 'nospace'
            }
          ],
          'unified-signatures': true,
          'variable-name': false,
          'whitespace': [
            true,
            'check-branch',
            'check-decl',
            'check-operator',
            'check-separator',
            'check-type'
          ],
          'no-inputs-metadata-property': true,
          'no-outputs-metadata-property': true,
          'no-host-metadata-property': true,
          'use-lifecycle-interface': true,
          'use-pipe-transform-interface': true,
          'component-class-suffix': true,
          'directive-class-suffix': true,
          'no-attribute-decorator': true
        }
      };
    });
  };
}

function replaceStandardTestingUtilitiesWithJestAndCypress(host: Tree, options: InitProjectOptions): Rule {
  return chain([
    removeStandardTestingUtilitiesFromPackageJson(host, options),
    removeStandardTestingFiles(host, options),
    addJestAndCypressDependenciesToPackageJson(host, options),
    updateTestCommandsInPackageJson(host, options),
    updateTsConfigSpec(host, options),
    updateAngularJsonForTestingUtilities(host, options),
    createTestingFiles(host, options)
  ]);
}

function removeStandardTestingUtilitiesFromPackageJson(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    return updateJsonInTree('package.json', (json, context: SchematicContext) => {
      delete json.devDependencies['karma'];
      delete json.devDependencies['karma-chrome-launcher'];
      delete json.devDependencies['karma-coverage-istanbul-reporter'];
      delete json.devDependencies['karma-jasmine'];
      delete json.devDependencies['karma-jasmine-html-reporter'];
      delete json.devDependencies['@types/jasmine'];
      delete json.devDependencies['@types/jasminewd2'];
      delete json.devDependencies['jasmine-core'];
      delete json.devDependencies['jasmine-spec-reporter'];
      delete json.devDependencies['protractor'];

      return json;
    });
  };
}

function removeStandardTestingFiles(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    const rootPath = getRootPath(host, options);
    const appRootPath = getAppRootPath(host, options);

    host.delete(join(rootPath, 'karma.conf.js'));
    host.delete(join(rootPath, 'e2e'));
    host.delete(join(appRootPath, 'test.ts'));
  };
}

const JEST_VERSION = '^24.9.0';
const JEST_PRESET_ANGULAR_VERSION = '^8.0.0';
const TYPES_JEST_VERSION = '^24.0.24';
const ANGULAR_BUILDERS_JEST_VERSION = '^8.3.2';
const CYPRESS_VERSION = '^3.8.0';
const CYPRESS_IMAGE_SNAPSHOT_VERSION = '^3.1.1';
const START_SERVER_AND_TEST_VERSION = '^1.10.6';
const TESTING_LIBRARY_ANGULAR_VERSION = '^8.2.0';
const TESTING_LIBRARY_JEST_DOM_VERSION = '^4.2.4';
const NGX_TRANSLATE_TESTING_VERSION = '^3.0.0';
const NRWL_BUILDERS_VERSION = '^7.8.7';
const NRWL_CYPRESS_VERSION = '^8.9.0';
const NRWL_WORKSPACE = '^8.9.0';

function addJestAndCypressDependenciesToPackageJson(host: Tree, options: InitProjectOptions): Rule {
  return addDepsToPackageJson(
    {},
    {
      'jest': JEST_VERSION,
      'jest-preset-angular': JEST_PRESET_ANGULAR_VERSION,
      '@types/jest': TYPES_JEST_VERSION,
      '@angular-builders/jest': ANGULAR_BUILDERS_JEST_VERSION,
      'cypress': CYPRESS_VERSION,
      'cypress-image-snapshot': CYPRESS_IMAGE_SNAPSHOT_VERSION,
      'start-server-and-test': START_SERVER_AND_TEST_VERSION,
      '@testing-library/angular': TESTING_LIBRARY_ANGULAR_VERSION,
      '@testing-library/jest-dom': TESTING_LIBRARY_JEST_DOM_VERSION,
      'ngx-translate-testing': NGX_TRANSLATE_TESTING_VERSION,
      '@nrwl/builders': NRWL_BUILDERS_VERSION,
      '@nrwl/cypress': NRWL_CYPRESS_VERSION,
      '@nrwl/workspace': NRWL_WORKSPACE
    }
  );
}

function updateTestCommandsInPackageJson(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    return updateJsonInTree('package.json', (json, context: SchematicContext) => {
      json.scripts.test = 'jest --config jest.config.js --collect-coverage';

      json.scripts['cypress'] = 'start-server-and-test cypress:frontend:serve http-get://127.0.0.1:5555 cypress:tests:run';
      json.scripts['cypress:open'] = 'cypress open';
      json.scripts['cypress:frontend:serve'] = 'ng serve --configuration=testing --port=5555';
      json.scripts['cypress:tests:run'] = 'cypress run';

      return json;
    });
  };
}

function updateTsConfigSpec(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    return updateJsonInTree('tsconfig.spec.json', (json, context: SchematicContext) => {
      json.compilerOptions.types = ['jest', 'node'];
      json.compilerOptions.files = [
        'src/polyfills.ts'
      ];

      return json;
    });
  };
}

function updateAngularJsonForTestingUtilities(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    return updateJsonInTree('angular.json', (json, context: SchematicContext) => {
      json.projects[Object.keys(json.projects)[0]].architect.test.builder = '@angular-builders/jest:run';

      json.projects[Object.keys(json.projects)[0]].architect.e2e.builder = '@nrwl/cypress:cypress';
      json.projects[Object.keys(json.projects)[0]].architect.e2e.options.cypressConfig = 'cypress.json';
      json.projects[Object.keys(json.projects)[0]].architect.e2e.options.tsConfig = 'tsconfig.json';
      delete json.projects[Object.keys(json.projects)[0]].architect.e2e.options.protractorConfig;

      return json;
    });
  };
}

function createTestingFiles(host: Tree, options: InitProjectOptions): Rule {
  const appRootPath = getRootPath(host, options);

  const templateSource = apply(url('./files/testing'), [
    template({
      ...options,
      ...strings
    }),
    move(appRootPath)
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
}

const NGX_TRANSLATE_VERSION = '^11.0.1';

function createTranslateFiles(host: Tree, options: InitProjectOptions): Rule {
  const appRootPath = getAppRootPath(host, options);

  const templateSource = apply(url('./files/ngx-translate'), [
    template({
      ...options,
      ...strings
    }),
    move(appRootPath)
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
}

function addNgxTranslateToPackageJson(host: Tree, options: InitProjectOptions): Rule {
  return addDepsToPackageJson({
    '@ngx-translate/core': NGX_TRANSLATE_VERSION
  });
}

function addNgxTranslateToAppModule(host: Tree, options: InitProjectOptions): Rule {
  const projectPath = getProjectPath(host, options);
  const appModulePath = normalize(`${projectPath}/app.module.ts`);

  const moduleImports = [
    {
      name: 'TranslateLoader',
      from: '@ngx-translate/core'
    },
    {
      name: 'TranslateModule',
      from: '@ngx-translate/core'
    },
    {
      name: 'WebpackTranslateLoader',
      from: './app.translate.loader'
    }
  ];

  const metadataImports = [
    `TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      }
    })`
  ];

  const addImportToModuleRules = moduleImports.map((item) => addImportToModule({
    modulePath: appModulePath,
    importName: item.name,
    importFrom: item.from
  }));

  const addImportToNgModuleMetadataRules = metadataImports.map((metadataImport) => {
    return addImportToNgModuleMetadata({
      modulePath: appModulePath,
      importName: metadataImport
    });
  });

  return chain([
    ...addImportToModuleRules,
    ...addImportToNgModuleMetadataRules
  ]);
}

function addLanguagesToConfigurationFiles(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    const appRootPath = getAppRootPath(host, options);
    const configurationFiles = ['configuration.ts', 'configuration.prod.ts'];

    return chain(configurationFiles.map((configurationFile) => {
      const path = join(appRootPath, 'configurations', configurationFile);

      return addTextToObject({
        path,
        identifier: 'configuration',
        text: `,\n  language: {\n    available: ['ru'],\n    default: 'ru'\n  }`
      });
    }));
  };
}

const NGRX_VERSION = '^8.5.2';
const NGRX_FORMS_VERSION = '^6.1.0';

function createAppStoreFiles(host: Tree, options: InitProjectOptions): Rule {
  const appRootPath = getAppRootPath(host, options);

  const templateSource = apply(url('./files/ngrx'), [
    template({
      ...options,
      ...strings
    }),
    move(appRootPath)
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
}

function addNgRxToPackageJson(host: Tree, options: InitProjectOptions): Rule {
  return addDepsToPackageJson(
    {
      '@ngrx/effects': NGRX_VERSION,
      '@ngrx/router-store': NGRX_VERSION,
      '@ngrx/store': NGRX_VERSION,
      'ngrx-forms': NGRX_FORMS_VERSION
    },
    {
      '@ngrx/store-devtools': NGRX_VERSION
    }
  );
}

function addNgRxImportsToAppModule(host: Tree, options: InitProjectOptions): Rule {
  const projectPath = getProjectPath(host, options);
  const appModulePath = normalize(`${projectPath}/app.module.ts`);

  const moduleImports = [
    {
      name: 'EffectsModule',
      from: '@ngrx/effects'
    },
    {
      name: 'routerReducer',
      from: '@ngrx/router-store'
    },
    {
      name: 'StoreRouterConnectingModule',
      from: '@ngrx/router-store'
    },
    {
      name: 'StoreModule',
      from: '@ngrx/store'
    },
    {
      name: 'StoreDevtoolsModule',
      from: '@ngrx/store-devtools'
    }
  ];

  const metadataImports = [
    'EffectsModule.forRoot([])',
    'StoreRouterConnectingModule.forRoot()',
    `StoreModule.forRoot({
      router: routerReducer
    })`,
    `StoreDevtoolsModule.instrument({
      maxAge: 30,
      logOnly: false
    })`
  ];

  const addImportToModuleRules = moduleImports.map((item) => addImportToModule({
    modulePath: appModulePath,
    importName: item.name,
    importFrom: item.from
  }));

  const addImportToNgModuleMetadataRules = metadataImports.map((metadataImport) => {
    return addImportToNgModuleMetadata({
      modulePath: appModulePath,
      importName: metadataImport
    });
  });

  return chain([
    ...addImportToModuleRules,
    ...addImportToNgModuleMetadataRules
  ]);
}

function addOnPushStrategyToAppComponent(host: Tree, options: InitProjectOptions): Rule {
  const projectPath = getProjectPath(host, options);
  const appComponentPath = normalize(`${projectPath}/app.component.ts`);
  const addImportToComponentRule = addImportToComponent({
    componentPath: appComponentPath,
    importName: 'ChangeDetectionStrategy',
    importFrom: '@angular/core'
  });
  const addChangeDetectionToComponentRule = addChangeDetectionToComponent({ componentPath: appComponentPath });

  return chain([
    addImportToComponentRule,
    addChangeDetectionToComponentRule
  ]);
}

export default function (options: InitProjectOptions): Rule {
  return (host: Tree) => {
    const rules = [
      replaceEnvironments(host, options),
      renameAppFiles(host, options),
      replaceImportsInAppFiles(host, options),
      addAliasesToTsConfig(host, options),
      updateTsLint(host, options)
    ];

    if (options.testing) {
      rules.push(
        replaceStandardTestingUtilitiesWithJestAndCypress(host, options)
      );
    }

    if (options.translate) {
      rules.push(
        createTranslateFiles(host, options),
        addNgxTranslateToPackageJson(host, options),
        addNgxTranslateToAppModule(host, options),
        addLanguagesToConfigurationFiles(host, options)
      );
    }

    if (options.ngrx) {
      rules.push(
        createAppStoreFiles(host, options),
        addNgRxToPackageJson(host, options),
        addNgRxImportsToAppModule(host, options),
        addOnPushStrategyToAppComponent(host, options)
      );
    }

    if (options.sentry) {
      rules.push(
        schematic('sentry', {})
      );
    }

    return chain(rules);
  };
}
