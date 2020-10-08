export class LabelService {
  constructor() {}

  getLabel(name: string) {
    // eslint-disable-next-line no-undef
    return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
  }

  getChildLabel(rootName: string, childName: string) {
    this.getLabel(rootName);
    return this.getLabel(rootName + '/' + childName);
  }
}
