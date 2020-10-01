export interface Options extends Extendable {
  appName: string;
}

export interface Extendable {
  forwarding?: string;
  categories?: Record<string, string | Category>;
  templates?: Record<string, Template<unknown>>;
}

export interface Category {
  title: string;
  major?: boolean;
}

export type Template<Data> = (data: Data) => string;

export interface Templating<Data> {
  [templateName: string]: Data;
}

export interface MailingInput<TemplateData> extends MailingData {
  templating?: Templating<TemplateData>;
}

export interface MailingData {
  body?: string;
  options?: MailingOptions;
}

export interface MailingOptions {
  attachments?: GoogleAppsScript.Base.BlobSource[];
  bcc?: string;
  cc?: string;
  from?: string;
  htmlBody?: string;
  inlineImages?: {
    [imageKey: string]: GoogleAppsScript.Base.BlobSource;
  };
  name?: string;
  noReply?: boolean;
  replyTo?: string;
}
