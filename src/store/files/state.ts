export class <%= classify(section, parent, page, (page) ? 'Page' : name) %>State {
  public isLoading: boolean;

  constructor() {
    this.isLoading = false;
  }
}
