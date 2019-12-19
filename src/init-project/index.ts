import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
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
import {
  addDepsToPackageJson,
  addImportToModule,
  addImportToNgModuleMetadata,
  getAppRootPath,
  getProjectPath,
  getRootPath,
  updateJsonInTree,
  addTextToObject,
} from '../../core';

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
          'src/configurations/index'
        ],
        '@tests/*': [
          'src/tests/*'
        ]
      };

      return json;
    });
  };
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
      '@ngrx/store': NGRX_VERSION
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

export default function (options: InitProjectOptions): Rule {
  return (host: Tree) => {
    const rules = [
      replaceEnvironments(host, options),
      renameAppFiles(host, options),
      replaceImportsInAppFiles(host, options),
      addAliasesToTsConfig(host, options)
    ];

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
        addNgRxImportsToAppModule(host, options)
      );
    }

    return chain(rules);
  };
}
