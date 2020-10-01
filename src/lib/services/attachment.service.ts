import {ThreadAttachment} from '@sheetbase/models';

export class AttachmentService {
  constructor() {}

  extractAttachment(attachment: GoogleAppsScript.Gmail.GmailAttachment) {
    const name = attachment.getName();
    const mimeType = attachment.getContentType();
    const size = attachment.getSize();
    return {name, mimeType, size} as ThreadAttachment;
  }

  extractAttachments(
    attachments: GoogleAppsScript.Gmail.GmailAttachment[],
    asObject = false
  ) {
    const objectItems: {[index: string]: ThreadAttachment} = {};
    const items: ThreadAttachment[] = [];
    for (let i = 0, l = attachments.length; i < l; i++) {
      const attachment = this.extractAttachment(attachments[i]);
      if (asObject) {
        objectItems['' + (i + 1)] = attachment;
      } else {
        items.push(attachment);
      }
    }
    return asObject ? objectItems : items;
  }

  extractAttachmentsAsList(
    attachments: GoogleAppsScript.Gmail.GmailAttachment[]
  ) {
    return this.extractAttachments(attachments) as ThreadAttachment[];
  }

  extractAttachmentsAsObject(
    attachments: GoogleAppsScript.Gmail.GmailAttachment[]
  ) {
    return this.extractAttachments(attachments, true) as {
      [index: string]: ThreadAttachment;
    };
  }
}
