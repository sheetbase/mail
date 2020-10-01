import {OptionService} from './option.service';

export class HelperService {
  constructor(private optionService: OptionService) {}

  prefixSubject(subject: string) {
    const {appName} = this.optionService.getOptions();
    return `(${appName}) ${subject}`;
  }

  unprefixedSubject(subject: string) {
    const {appName} = this.optionService.getOptions();
    return subject.replace(`(${appName}) `, '');
  }
}
