export class <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParentPage) ? (parentPage + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>State {
  public isLoading: boolean;

  constructor() {
    this.isLoading = false;
  }
}
