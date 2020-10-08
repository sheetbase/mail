import {AuthData, MailingInput} from '../types/mail.type';
import {MailService} from '../services/mail.service';

export class MailRoute {
  endpoint = '/mail';

  disabled = ['put', 'patch'];

  errors = {
    'mail/missing-recipient': 'Missing required recipient for the action',
    'mail/no-access':
      'Current auth user has no access permission for the resource.',
    'mail/invalid-input': 'Invalid input.',
  };

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
    const authEmail = req.data.auth.sub;
    if (threadId) {
      return this.mailService.replyThread(authEmail, threadId, input, replyAll);
    } else if (messageId) {
      return this.mailService.replyMessage(
        authEmail,
        messageId,
        input,
        replyAll
      );
    } else {
      throw new Error('mail/no-thread-or-message-id');
    }
  }
}
