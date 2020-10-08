import {AuthData} from '../types/mail.type';
import {MailService} from '../services/mail.service';

export class MailThreadsRoute {
  endpoint = '/mail/threads';

  disabled = ['get'];

  constructor(private mailService: MailService) {}

  /**
   * Get threads (list by category/single - parent + children/single - children only)
   */
  get(req: {
    query: {
      threadId?: string;
      categoryName?: string;
      childrenOnly?: boolean;
      full?: boolean;
      grouping?: boolean;
    };
    data: {
      auth: AuthData;
    };
  }) {
    const {threadId, categoryName, childrenOnly, full, grouping} = req.query;
    const authEmail = req.data.auth.sub;
    if (categoryName) {
      return this.mailService.getThreadsByCategory(
        authEmail,
        categoryName,
        full,
        grouping
      );
    } else if (threadId) {
      if (childrenOnly) {
        return this.mailService.getThreadChildren(authEmail, threadId);
      } else {
        return this.mailService.getThreadFull(authEmail, threadId, grouping);
      }
    } else {
      throw new Error('mail/invalid-input');
    }
  }
}
