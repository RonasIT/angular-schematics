export class <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage && !hasName) ? 'Page' : name)) %>State {
  public isLoading: boolean;

  constructor() {
    this.isLoading = false;
  }
}
