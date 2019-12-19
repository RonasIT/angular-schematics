import { from, Observable } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';

export class WebpackTranslateLoader implements TranslateLoader {
  public getTranslation(language: string): Observable<any> {
    return from(import(`../assets/i18n/${language}.json`));
  }
}
