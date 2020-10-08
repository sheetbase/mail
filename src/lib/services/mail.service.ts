import {
  Template,
  MailingInput,
  MailingData,
  MailingOptions,
} from '../types/mail.type';
import {OptionService} from './option.service';
import {ThreadService} from './thread.service';
import {MessageService} from './message.service';

export class MailService {
  constructor(
    private optionService: OptionService,
    private threadService: ThreadService,
    private messageService: MessageService
  ) {}

  private processMailingInput<TemplateData>(input: MailingInput<TemplateData>) {
    const {forwarding} = this.optionService.getOptions();
    const appName = this.optionService.getAppName();
    const {templating, body: textBody, options = {}} = input;
    // options
    options.name = appName; // sender name
    options.bcc = !forwarding
      ? options.bcc // with forwarding
      : options.bcc
      ? options.bcc + ', ' + forwarding
      : forwarding;
    // templating
    if (templating) {
      const [templateName] = Object.keys(templating);
      const template = this.optionService.getTemplate(templateName) as Template<
        TemplateData
      >;
      options.htmlBody = template(templating[templateName]);
    }
    // finalize values
    const body =
      textBody ||
      (options.htmlBody
        ? options.htmlBody.replace(/<[^>]*>?/g, '') // text version of html body
        : 'This email was sent by the Sheetbase Gmail service: https://sheetbase.dev'); // default body
    // final data
    return {body, options} as MailingData;
  }

  /**
   * Get daily remaining mailing data
   */
  quota() {
    // eslint-disable-next-line no-undef
    return MailApp.getRemainingDailyQuota();
  }

  /**
   * Send a new email
   * @param mailingData - The mailing data object
   * @param categoryName - Mailing category name
   * @param templating - Templating object
   * @param major - Override category major flag
   */
  send<TemplateData>(
    recipient: string,
    subject: string,
    input: MailingInput<TemplateData>,
    categoryName = 'uncategorized'
  ) {
    if (!recipient) {
      throw new Error('mail/missing-recipient');
    }
    // process mailing data and send email
    const {body, options} = this.processMailingInput(input);
    // eslint-disable-next-line no-undef
    GmailApp.sendEmail(
      recipient,
      subject,
      body as string,
      options as MailingOptions
    );
    // finalize
    const category = this.optionService.getCategory(categoryName);
    const thread = this.threadService.retrieveSent(recipient);
    this.threadService.setThreadCategory(thread, category);
    this.threadService.notifyChanges(thread, category);
    // result
    return {threadId: thread.getId()};
  }

  /**
   * Reply to an email thread
   * @param authEmail - The auth user email
   * @param threadId - Thread to be replied to
   * @param mailingData - The mailing data object (body or options)
   * @param templating - Mailing templating
   * @param replyAll - Is replied to all recipients
   */
  replyThread<TemplateData>(
    authEmail: string,
    threadId: string,
    input: MailingInput<TemplateData>,
    replyAll = false
  ) {
    const thread = this.threadService.getUserThread(authEmail, threadId);
    if (!thread) {
      throw new Error('mail/no-access');
    }
    // process mailing data
    const {body, options} = this.processMailingInput(input);
    // send reply
    if (replyAll) {
      thread.replyAll(body as string, options as MailingOptions);
    } else {
      thread.reply(body as string, options as MailingOptions);
    }
    // finalize
    this.threadService.notifyChanges(thread);
    // result
    return thread;
  }

  /**
   * Reply all to an email thread
   * @param authEmail - The auth user email
   * @param threadId - Thread to be replied to
   * @param mailingData - The mailing data object (body or options)
   * @param templating - Mailing templating
   */
  replyThreadAll<TemplateData>(
    authEmail: string,
    threadId: string,
    input: MailingInput<TemplateData>
  ) {
    return this.replyThread(authEmail, threadId, input, true);
  }

  /**
   * Reply to an email message
   * @param authEmail - The auth user email
   * @param messageId - Thread to be replied to
   * @param mailingData - The mailing data object (body or options)
   * @param templating - Mailing templating
   * @param replyAll - Is replied to all recipients
   */
  replyMessage<TemplateData>(
    authEmail: string,
    messageId: string,
    input: MailingInput<TemplateData>,
    replyAll = false
  ) {
    const message = this.messageService.getUserMessage(authEmail, messageId);
    if (!message) {
      throw new Error('mail/no-access');
    }
    // process mailing data
    const {body, options} = this.processMailingInput(input);
    // send reply
    if (replyAll) {
      message.replyAll(body as string, options as MailingOptions);
    } else {
      message.reply(body as string, options as MailingOptions);
    }
    // finalize
    const thread = message.getThread();
    this.threadService.notifyChanges(thread);
    // result
    return message;
  }

  /**
   * Reply all to an email message
   * @param authEmail - The auth user email
   * @param messageId - Thread to be replied to
   * @param mailingData - The mailing data object (body or options)
   * @param templating - Mailing templating
   */
  replyMessageAll<TemplateData>(
    authEmail: string,
    messageId: string,
    input: MailingInput<TemplateData>
  ) {
    return this.replyMessage(authEmail, messageId, input, true);
  }

  /**
   * Get database threads, from category-based threads
   * @param authEmail - The auth user email
   * @param categoryName - Mailing category name
   */
  getThreadsByCategory(
    authEmail: string,
    categoryName: string,
    full = false,
    grouping = false
  ) {
    const appName = this.optionService.getAppName();
    const {title} = this.optionService.getCategory(categoryName);
    const threads = this.threadService.getUserThreadsByLabel(
      authEmail,
      appName,
      title
    );
    return !threads.length
      ? []
      : full
      ? this.threadService.extractThreadsFull(threads, grouping)
      : this.threadService.extractThreads(threads);
  }

  /**
   * Get a database thread, from a user thread
   * @param authEmail - The auth user email
   * @param threadId - A Gmail thread id
   */
  getThread(authEmail: string, threadId: string) {
    const thread = this.threadService.getUserThread(authEmail, threadId);
    return !thread ? null : this.threadService.extractThread(thread);
  }

  /**
   * Get database threads (its messages only), from a user thread
   * @param authEmail - The auth user email
   * @param threadId - A Gmail thread id
   */
  getThreadChildren(authEmail: string, threadId: string) {
    const thread = this.threadService.getUserThread(authEmail, threadId);
    return !thread ? [] : this.threadService.extractThreadChildren(thread);
  }

  /**
   * Get full database threads (thread + its messages), from a user thread
   * @param authEmail - The auth user email
   * @param threadId - A Gmail thread id
   * @param grouping - Group threads
   */
  getThreadFull(authEmail: string, threadId: string, grouping = false) {
    const thread = this.threadService.getUserThread(authEmail, threadId);
    return !thread
      ? []
      : this.threadService.extractThreadFull(thread, 1, grouping);
  }

  /**
   * Get database thread, from a user message
   * @param authEmail - The auth user email
   * @param messageId - A Gmail message id
   */
  getMessage(authEmail: string, messageId: string) {
    const message = this.messageService.getUserMessage(authEmail, messageId);
    return !message ? null : this.messageService.extractMessage(message);
  }

  /**
   * Get a message attachments as a list of file info
   * @param authEmail - The auth user email
   * @param messageId - A Gmail message id
   */
  // getAttachments(authEmail: string, messageId: string) {
  //   // TODO:
  //   // 1. check if the auth user has access to this message
  //   // 3. check for files in Upload/attachments/[Message ID]
  //   // 4. save all attachments to Drive
  // }

  /**
   * Get a message attachment as a file info
   * @param authEmail - The auth user email
   * @param messageId - A Gmail message id
   * @param attachmentName - The attachment name (also the file name)
   */
  // getAttachment(authEmail: string, messageId: string, attachmentName: string) {
  //   // TODO:
  //   // 1. check if the auth user has access to this message
  //   // 2. check for the file in Upload/attachments/[Message ID]/[Attachment name]
  //   // 3. save this attachment to Drive
  // }
}
