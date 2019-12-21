export class <%= classify(((hasSection) ? (section + ' ') : '') + ((hasParent) ? (parent + ' ') : '') + ((hasPage) ? (page + ' ') : '') + ((hasPage) ? 'Page' : '') + ((!hasPage && hasName) ? name : '')) %>State {
  public isLoading: boolean;

  constructor() {
    this.isLoading = false;
  }
}
