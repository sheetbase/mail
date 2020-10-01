/* eslint-disable no-undef */
import {Thread, GroupingThread} from '@sheetbase/models';

import {Category} from '../types';
import {OptionService} from './option.service';
import {HelperService} from './helper.service';
import {LabelService} from './label.service';
import {MessageService} from './message.service';

export class ThreadService {
  constructor(
    private optionService: OptionService,
    private helperService: HelperService,
    private labelService: LabelService,
    private messageService: MessageService
  ) {}

  retrieveSent(recipient: string) {
    Utilities.sleep(2000);
    const [thread] = GmailApp.search('from:me to:' + recipient);
    return thread;
  }

  getThreadCategory(thread: GoogleAppsScript.Gmail.GmailThread) {
    const [label] = thread.getLabels();
    const labelName = label.getName();
    return this.optionService.getCategoryByLabel(labelName);
  }

  setThreadCategory(
    thread: GoogleAppsScript.Gmail.GmailThread,
    category: Category
  ) {
    const {appName} = this.optionService.getOptions();
    const label = this.labelService.getChildLabel(appName, category.title);
    return thread.addLabel(label);
  }

  notifyChanges(
    thread: GoogleAppsScript.Gmail.GmailThread,
    category?: Category
  ) {
    category = category || this.getThreadCategory(thread);
    return !(category as Category).major
      ? thread
      : thread.markUnread().moveToInbox();
  }

  getUserThreads(email: string) {
    return GmailApp.search(
      'from:me to:' + email + ' OR ' + 'from:' + email + ' to:me'
    );
  }

  getUserThreadsByLabel(
    email: string,
    appLabel: string,
    categoryLabel: string
  ) {
    const label = (appLabel + '-' + categoryLabel).toLowerCase();
    return GmailApp.search(
      'label:' + label + ' ' + 'from:me' + ' ' + 'to:' + email
    );
  }

  getUserThread(email: string, threadId: string) {
    let result: GoogleAppsScript.Gmail.GmailThread | undefined;
    const threads = this.getUserThreads(email);
    for (const thread of threads) {
      if (thread.getId() === threadId) {
        result = thread;
        break;
      }
    }
    return result;
  }

  extractThread(thread: GoogleAppsScript.Gmail.GmailThread, index = 1) {
    const threadId = thread.getId();
    const title = this.helperService.unprefixedSubject(
      thread.getFirstMessageSubject()
    );
    const type = (this.getThreadCategory(
      thread
    ) as Category).title.toLowerCase();
    const createdAt = thread.getLastMessageDate().toISOString();
    const content = thread.getPermalink();
    const commentCount = thread.getMessageCount();
    const isUnread = thread.isUnread();
    const isImportant = thread.isImportant();
    const isInInbox = thread.isInInbox();
    const isInSpam = thread.isInSpam();
    const isInTrash = thread.isInTrash();
    const hasStarred = thread.hasStarredMessages();
    const databaseThread: Thread = {
      '#': index,
      title,
      $key: threadId,
      type,
      createdAt,
      content,
      commentCount,
      meta: {
        isUnread,
        isImportant,
        isInInbox,
        isInSpam,
        isInTrash,
        hasStarred,
      },
    };
    if (hasStarred) {
      databaseThread.rating = {total: 5, count: 1};
    }
    return databaseThread;
  }

  extractThreadChildren(thread: GoogleAppsScript.Gmail.GmailThread, index = 1) {
    return this.messageService.extractMessages(
      thread.getMessages(),
      thread.getId(),
      index
    );
  }

  extractThreadFull(
    thread: GoogleAppsScript.Gmail.GmailThread,
    index = 1,
    grouping = false
  ) {
    let result: Thread[] | GroupingThread;
    // get the parent & its children
    const parent = this.extractThread(thread, index);
    const children = this.extractThreadChildren(thread, index);
    // final result
    if (grouping) {
      result = {parent, children};
    } else {
      result = [parent, ...children]; // merge the parent with its children
    }
    return result;
  }

  extractThreads(threads: GoogleAppsScript.Gmail.GmailThread[]) {
    const items: Thread[] = [];
    for (let i = 0, l = threads.length; i < l; i++) {
      const itemResult = this.extractThread(threads[i], i + 1);
      items.push(itemResult);
    }
    return items;
  }

  extractThreadsFull(
    threads: GoogleAppsScript.Gmail.GmailThread[],
    grouping = false
  ) {
    const groupingItems: GroupingThread[] = [];
    let items: Thread[] = [];
    for (let i = 0, l = threads.length; i < l; i++) {
      const index = i + 1;
      const thread = threads[i];
      if (grouping) {
        const item = this.extractThreadFull(
          thread,
          index,
          true
        ) as GroupingThread;
        groupingItems.push(item);
      } else {
        const item = this.extractThreadFull(thread, index, false) as Thread[];
        items = [...items, ...item];
      }
    }
    return grouping ? groupingItems : items;
  }
}
