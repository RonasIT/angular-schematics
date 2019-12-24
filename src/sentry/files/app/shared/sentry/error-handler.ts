import { captureException, init } from '@sentry/browser';
import { configuration } from '@configurations';
import { ErrorHandler, Injectable } from '@angular/core';

init({
  dsn: configuration.sentry.dsn
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  public handleError(error: any): void {
    captureException(error.originalError || error);
  }
}
