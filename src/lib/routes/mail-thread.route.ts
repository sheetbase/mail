import {AuthData} from '../types/mail.type';
import {MailService} from '../services/mail.service';

export class MailThreadRoute {
  endpoint = '/mail/thread';

  disabled = ['get'];

  constructor(private mailService: MailService) {}

  /**
   * Get a single message/thread
   */
  get(req: {
    query: {
      threadId?: string;
      messageId?: string;
    };
    data: {
      auth: AuthData;
    };
  }) {
    const {threadId, messageId} = req.query;
    const authEmail = req.data.auth.sub;
    if (threadId) {
      return this.mailService.getThread(authEmail, threadId);
    } else if (messageId) {
      return this.mailService.getMessage(authEmail, messageId);
    } else {
      throw new Error('mail/invalid-input');
    }
  }
}
