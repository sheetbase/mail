import {
  ServerModule,
  DisabledRoutes,
  Middlewares,
  RouteMiddlewares,
} from '@sheetbase/server';

import {Options} from './types/mail.type';

import {OptionService} from './services/option.service';
import {HelperService} from './services/helper.service';
import {AttachmentService} from './services/attachment.service';
import {LabelService} from './services/label.service';
import {MessageService} from './services/message.service';
import {ThreadService} from './services/thread.service';
import {MailService} from './services/mail.service';

import {MailRoute} from './routes/mail.route';
import {MailThreadsRoute} from './routes/mail-threads.route';
import {MailThreadRoute} from './routes/mail-thread.route';

export class Lib {
  optionService: OptionService;
  helperService: HelperService;
  attachmentService: AttachmentService;
  labelService: LabelService;
  messageService: MessageService;
  threadService: ThreadService;
  mailService: MailService;
  mailRoute: MailRoute;
  mailThreadsRoute: MailThreadsRoute;
  mailThreadRoute: MailThreadRoute;

  constructor(private serverModule: ServerModule, options: Options) {
    // services
    this.optionService = new OptionService(
      this.serverModule.optionService,
      options
    );
    this.helperService = new HelperService(this.optionService);
    this.attachmentService = new AttachmentService();
    this.labelService = new LabelService();
    this.messageService = new MessageService(
      this.helperService,
      this.attachmentService
    );
    this.threadService = new ThreadService(
      this.optionService,
      this.helperService,
      this.labelService,
      this.messageService
    );
    this.mailService = new MailService(
      this.optionService,
      this.threadService,
      this.messageService
    );
    // routes
    this.mailRoute = new MailRoute(this.mailService);
    this.mailThreadsRoute = new MailThreadsRoute(this.mailService);
    this.mailThreadRoute = new MailThreadRoute(this.mailService);
  }

  /**
   * Expose the module routes
   */
  registerRoutes(
    routeEnabling?: true | DisabledRoutes,
    middlewares?: Middlewares | RouteMiddlewares
  ) {
    return this.serverModule.routerService.register(
      [this.mailRoute, this.mailThreadsRoute, this.mailThreadRoute],
      routeEnabling,
      middlewares
    );
  }
}
