export class <%= classify(section + ' ' + ((hasParent) ? (parent + ' ') : '') + name) %>PageState {
  public isLoading: boolean;

  constructor() {
    this.isLoading = false;
  }
}
