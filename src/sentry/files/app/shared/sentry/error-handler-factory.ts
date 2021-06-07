import { configuration } from '@configurations';
import { ErrorHandler } from '@angular/core';
import { SentryErrorHandler } from './error-handler';

/* eslint-disable  prefer-arrow/prefer-arrow-functions */
export function errorHandlerFactory(): ErrorHandler {
  if (configuration.production) {
    return new SentryErrorHandler();
  }

  return new ErrorHandler();
}
/* eslint-enable  prefer-arrow/prefer-arrow-functions */
