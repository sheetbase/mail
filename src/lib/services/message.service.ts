/* eslint-disable no-undef */
import {Thread} from '@sheetbase/models';

import {HelperService} from './helper.service';
import {AttachmentService} from './attachment.service';

export class MessageService {
  constructor(
    private helperService: HelperService,
    private attachmentService: AttachmentService
  ) {}

  getUserMessage(email: string, messageId: string) {
    let result: GoogleAppsScript.Gmail.GmailMessage | undefined;
    const message = GmailApp.getMessageById(messageId);
    const from = message.getFrom();
    const to = message.getTo();
    if (from === email || to.indexOf(email) !== -1) {
      result = message;
    }
    return result;
  }

  extractMessage(
    message: GoogleAppsScript.Gmail.GmailMessage,
    index?: number,
    parent?: string
  ) {
    const messageAttachments = message.getAttachments();
    // database thread
    const title = this.helperService.unprefixedSubject(message.getSubject());
    const $key = message.getId();
    const createdAt = message.getDate().toISOString();
    const content = message.getBody();
    const email = message.getFrom();
    const isUnread = message.isUnread();
    const isDraft = message.isDraft();
    const isStarred = message.isStarred();
    const isInInbox = message.isInInbox();
    const isInTrash = message.isInTrash();
    const attachments = this.attachmentService.extractAttachmentsAsObject(
      messageAttachments
    );
    const thread: Thread = {
      '#': index || new Date().getTime(),
      title,
      $key,
      createdAt,
      content,
      attachments,
      email,
      meta: {
        isUnread,
        isDraft,
        isStarred,
        isInInbox,
        isInTrash,
      },
    };
    if (parent) {
      thread.parent = parent;
    }
    if (isStarred) {
      thread.rating = {total: 5, count: 1};
    }
    return thread;
  }

  extractMessages(
    messages: GoogleAppsScript.Gmail.GmailMessage[],
    parent?: string,
    parentIndex = 0
  ) {
    const items: Thread[] = [];
    for (let i = 0, l = messages.length; i < l; i++) {
      const itemResult = this.extractMessage(
        messages[i],
        parentIndex + i + 1,
        parent
      );
      items.push(itemResult);
    }
    return items;
  }
}
