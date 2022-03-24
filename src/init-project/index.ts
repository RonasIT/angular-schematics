import { Schema as InitProjectOptions } from './schema';
import {
  addChangeDetectionToComponent,
  addDepsToPackageJson,
  addImportToFile,
  addImportToNgModuleMetadata,
  addTextToObject,
  getAppRootPath,
  getProjectPath,
  getRootPath,
  isThereDependencyInPackageJson,
  updateJsonInTree
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
import { fragment, join, normalize, strings } from '@angular-devkit/core';

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
    replaceEnvironmentsInAngularJson(host, options)
  ]);
}

function replaceStandardFiles(host: Tree, options: InitProjectOptions): Rule {
  const appRootPath = getAppRootPath(host, options);
  const isNgrxInstalled = isThereDependencyInPackageJson(host, '@ngrx/store');

  host.delete(join(appRootPath, 'main.ts'));
  host.delete(join(appRootPath, 'app', 'app.component.html'));
  host.delete(join(appRootPath, 'app', 'app.component.spec.ts'));
  host.delete(join(appRootPath, 'app', 'app.component.ts'));

  const templateSource = apply(url('./files/init'), [
    template({
      ...options,
      ...strings,
      isNgrxInstalled
    }),
    move(appRootPath)
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
}

function renameAppFiles(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    const projectPath = getProjectPath(host, options);

    host.rename(
      normalize(`${projectPath}/app-routing.module.ts`),
      normalize(`${projectPath}/app.routing.ts`)
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
        '@shared/*': [
          'src/app/shared/*'
        ],
        '@app/*': [
          'src/app/*'
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

function updateTsConfig(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    return updateJsonInTree('tsconfig.json', (json, context: SchematicContext) => {
      json.compilerOptions.strictPropertyInitialization = false;

      return json;
    });
  };
}

function installLint(host: Tree, options: InitProjectOptions): Rule {
  return chain([
    installLintDependencies(host, options),
    createLintFiles(host, options),
    updateAngularJsonForLint(host, options),
    addLintCommandInPackageJson(host, options)
  ]);
}

const ANGULAR_ESLINT_VERSION = '^13.1.0';
const TYPESCRIPT_ESLINT_VERSION = '^5.16.0';
const ESLINT_VERSION = '^8.11.0';
const ESLINT_PLUGIN_IMPORT_VERSION = '^2.23.4';

function installLintDependencies(host: Tree, options: InitProjectOptions): Rule {
  return addDepsToPackageJson(
    {},
    {
      '@angular-eslint/builder': ANGULAR_ESLINT_VERSION,
      '@angular-eslint/eslint-plugin': ANGULAR_ESLINT_VERSION,
      '@angular-eslint/eslint-plugin-template': ANGULAR_ESLINT_VERSION,
      '@angular-eslint/schematics': ANGULAR_ESLINT_VERSION,
      '@angular-eslint/template-parser': ANGULAR_ESLINT_VERSION,
      '@typescript-eslint/eslint-plugin': TYPESCRIPT_ESLINT_VERSION,
      '@typescript-eslint/parser': TYPESCRIPT_ESLINT_VERSION,
      'eslint': ESLINT_VERSION,
      'eslint-plugin-import': ESLINT_PLUGIN_IMPORT_VERSION
    }
  );
}

function updateAngularJsonForLint(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    return updateJsonInTree('angular.json', (json, context: SchematicContext) => {
      json.projects[Object.keys(json.projects)[0]].architect.lint = {
        "builder": "@angular-eslint/builder:lint",
        "options": {
          "lintFilePatterns": [
            "src/**/*.ts",
            "src/**/*.html"
          ]
        }
      };

      return json;
    });
  };
}

function addLintCommandInPackageJson(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    return updateJsonInTree('package.json', (json, context: SchematicContext) => {
      json.scripts.lint = 'ng lint';

      return json;
    });
  };
}

function createLintFiles(host: Tree, options: InitProjectOptions): Rule {
  const appRootPath = getRootPath(host, options);

  const templateSource = apply(url('./files/lint'), [
    template({
      ...options,
      ...strings
    }),
    move(appRootPath)
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
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
      delete json.devDependencies['karma-coverage'];
      delete json.devDependencies['karma-jasmine'];
      delete json.devDependencies['karma-jasmine-html-reporter'];
      delete json.devDependencies['@types/jasmine'];
      delete json.devDependencies['jasmine-core'];

      return json;
    });
  };
}

function removeStandardTestingFiles(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    const rootPath = getRootPath(host, options);
    const appRootPath = getAppRootPath(host, options);

    host.delete(join(rootPath, 'karma.conf.js'));
    host.delete(join(appRootPath, 'test.ts'));
  };
}

const JEST_VERSION = '^27.5.1';
const JEST_PRESET_ANGULAR_VERSION = '^11.1.1';
const BABEL_JEST_VERSION = '^27.5.1';
const TYPES_JEST_VERSION = '^27.4.1';
const CYPRESS_VERSION = '^9.5.2';
const CYPRESS_IMAGE_SNAPSHOT_VERSION = '^4.0.1';
const START_SERVER_AND_TEST_VERSION = '^1.14.0';
const TESTING_LIBRARY_ANGULAR_VERSION = '^11.0.4';
const TESTING_LIBRARY_JEST_DOM_VERSION = '^5.16.2';
const NGX_TRANSLATE_TESTING_VERSION = '^6.0.1';
const NRWL_BUILDERS_VERSION = '^7.8.7';
const NRWL_CYPRESS_VERSION = '^13.9.4';
const NRWL_WORKSPACE = '^13.9.4';

function addJestAndCypressDependenciesToPackageJson(host: Tree, options: InitProjectOptions): Rule {
  return addDepsToPackageJson(
    {},
    {
      'jest': JEST_VERSION,
      'jest-preset-angular': JEST_PRESET_ANGULAR_VERSION,
      'babel-jest': BABEL_JEST_VERSION,
      '@types/jest': TYPES_JEST_VERSION,
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

      json.scripts['e2e'] = 'start-server-and-test cypress:frontend:serve http-get://127.0.0.1:5555 cypress:tests:run';
      json.scripts['cypress:open'] = 'cypress open';
      json.scripts['cypress:frontend:serve'] = 'ng serve --configuration=development --port=5555';
      json.scripts['cypress:tests:run'] = 'cypress run';

      return json;
    });
  };
}

function updateTsConfigSpec(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    return updateJsonInTree('tsconfig.spec.json', (json, context: SchematicContext) => {
      json.compilerOptions.esModuleInterop = true;
      json.compilerOptions.allowSyntheticDefaultImports = true;
      json.compilerOptions.emitDecoratorMetadata = true;
      json.compilerOptions.types = ['node', 'jest'];
      json.compilerOptions.allowJs = true;

      json.include.push('global.d.ts');

      return json;
    });
  };
}

function updateAngularJsonForTestingUtilities(host: Tree, options: InitProjectOptions): Rule {
  return (host: Tree) => {
    return updateJsonInTree('angular.json', (json, context: SchematicContext) => {
      delete json.projects[Object.keys(json.projects)[0]].architect.test;

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

const NGX_TRANSLATE_VERSION = '^14.0.0';

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

  const addImportToModuleRules = moduleImports.map((item) => addImportToFile({
    filePath: appModulePath,
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
        text: `,\n  language: {\n    available: ['en'],\n    default: 'en'\n  }`
      });
    }));
  };
}

const NGRX_VERSION = '^13.0.2';
const NGRX_FORMS_VERSION = '^7.0.0';

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
    },
    {
      name: 'AppState',
      from: '@shared/store'
    }
  ];

  const metadataImports = [
    'EffectsModule.forRoot([])',
    'StoreRouterConnectingModule.forRoot()',
    `StoreModule.forRoot<AppState>({
      router: routerReducer
    })`,
    `StoreDevtoolsModule.instrument({
      maxAge: 30,
      logOnly: false
    })`
  ];

  const addImportToModuleRules = moduleImports.map((item) => addImportToFile({
    filePath: appModulePath,
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
  const addImportToComponentRule = addImportToFile({
    filePath: appComponentPath,
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
      replaceStandardFiles(host, options),
      renameAppFiles(host, options),
      replaceImportsInAppFiles(host, options),
      addAliasesToTsConfig(host, options),
      updateTsConfig(host, options),
      installLint(host, options),
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
