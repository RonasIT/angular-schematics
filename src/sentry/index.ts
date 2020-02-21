import {
  addDepsToPackageJson,
  addProviderToNgModuleMetadata,
  addTextToObject,
  getAppRootPath,
  getProjectPath,
  addImportToFile
} from '../../core';
import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { join, normalize } from '@angular-devkit/core';
import { Schema as SentryOptions } from './schema';

function createSentryFiles(host: Tree, options: SentryOptions): Rule {
  const appRootPath = getAppRootPath(host, options);

  const templateSource = apply(url('./files'), [
    template(options),
    move(appRootPath)
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
}

const SENTRY_BROWSER_VERSION = '^5.10.2';

function addSentryToPackageJson(host: Tree, options: SentryOptions): Rule {
  return addDepsToPackageJson({
    '@sentry/browser': SENTRY_BROWSER_VERSION
  });
}

function addSentryToConfigurationFiles(host: Tree, options: SentryOptions): Rule {
  return (host: Tree) => {
    const appRootPath = getAppRootPath(host, options);
    const configurationFiles = ['configuration.ts', 'configuration.prod.ts'];

    return chain(configurationFiles.map((configurationFile) => {
      const path = join(appRootPath, 'configurations', configurationFile);

      return addTextToObject({
        path,
        identifier: 'configuration',
        text: `,\n  sentry: {\n    dsn: '${options.dsn}'\n  }`
      });
    }));
  };
}

function addErrorHandlerProviderToAppModule(host: Tree, options: SentryOptions): Rule {
  const projectPath = getProjectPath(host, options);
  const appModulePath = normalize(`${projectPath}/app.module.ts`);

  const moduleImports = [
    {
      name: 'ErrorHandler',
      from: '@angular/core'
    },
    {
      name: 'errorHandlerFactory',
      from: '@shared/sentry'
    }
  ];

  const metadataProviders = [
    `{
      provide: ErrorHandler,
      useFactory: errorHandlerFactory
    }`
  ];

  const addImportToModuleRules = moduleImports.map((item) => addImportToFile({
    filePath: appModulePath,
    importName: item.name,
    importFrom: item.from
  }));

  const addProviderToNgModuleMetadataRules = metadataProviders.map((metadataProvider) => {
    return addProviderToNgModuleMetadata({
      modulePath: appModulePath,
      importName: metadataProvider
    });
  });

  return chain([
    ...addImportToModuleRules,
    ...addProviderToNgModuleMetadataRules
  ]);
}

export default function (options: SentryOptions): Rule {
  return (host: Tree) => {
    const rules = [
      createSentryFiles(host, options),
      addSentryToPackageJson(host, options),
      addSentryToConfigurationFiles(host, options),
      addErrorHandlerProviderToAppModule(host, options)
    ];

    return chain(rules);
  };
}
