import {AuthData} from '@sheetbase/auth';

import {MailingInput} from '../types';
import {MailService} from '../services/mail.service';

export class MailRoute {
  endpoint = '/mail';

  disabled = ['put', 'post', 'patch'];

  errors = {};

  constructor(private mailService: MailService) {}

  /**
   * Get mail information
   */
  get() {
    const remainingDailyQuota = this.mailService.quota();
    return {remainingDailyQuota};
  }

  /**
   * Send an email
   */
  put(req: {
    body: {
      recipient: string;
      subject: string;
      input: MailingInput<unknown>;
      categoryName?: string;
    };
  }) {
    const {recipient, subject, input, categoryName} = req.body;
    return this.mailService.send(recipient, subject, input, categoryName);
  }

  /**
   * Reply to a thread/message
   */
  patch(req: {
    body: {
      threadId?: string;
      messageId?: string;
      input: MailingInput<unknown>;
      replyAll?: boolean;
    };
    data: {
      auth: AuthData;
    };
  }) {
    const {threadId, messageId, input, replyAll} = req.body;
    const {sub: email} = req.data.auth;
    if (threadId) {
      return this.mailService.replyThread(email, threadId, input, replyAll);
    } else if (messageId) {
      return this.mailService.replyMessage(email, messageId, input, replyAll);
    } else {
      throw new Error('mail/no-thread-or-message-id');
    }
  }
}
