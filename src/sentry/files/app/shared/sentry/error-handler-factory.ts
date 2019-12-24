import { configuration } from '@configurations';
import { ErrorHandler } from '@angular/core';
import { SentryErrorHandler } from './error-handler';

export function errorHandlerFactory(): ErrorHandler {
  if (configuration.production) {
    return new SentryErrorHandler();
  }

  return new ErrorHandler();
}
