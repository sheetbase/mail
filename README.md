<section id="head" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

# @sheetbase/mail

**Send email using Gmail in Sheetbase backend app.**

</section>

<section id="tocx" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

- [Installation](#installation)
- [Options](#options)
- [Lib](#lib)
  - [Lib properties](#lib-properties)
  - [Lib methods](#lib-methods)
    - [`registerRoutes(routeEnabling?, middlewares?)`](#lib-registerroutes-0)
- [Routing](#routing)
  - [Errors](#routing-errors)
  - [Routes](#routing-routes)
    - [Routes overview](#routing-routes-overview)
    - [Routes detail](#routing-routes-detail)
      - [`GET` /mail](#GET__mail)
      - [`PATCH` /mail](#PATCH__mail)
      - [`PUT` /mail](#PUT__mail)
      - [`GET` /mail/thread](#GET__mail_thread)
      - [`GET` /mail/threads](#GET__mail_threads)
- [Detail API reference](https://sheetbase.github.io/mail)


</section>

<section id="installation" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="installation"><p>Installation</p>
</a></h2>

- Install: `npm install --save @sheetbase/mail`

- Usage:

```ts
// 1. import module
import { MailModule } from "@sheetbase/mail";

// 2. create an instance
export class App {
  // the object
  mailModule: MailModule;

  // initiate the instance
  constructor() {
    this.mailModule = new MailModule(/* options */);
  }
}
```

</section>

<section id="options" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="options"><p>Options</p>
</a></h2>

| Name                                                                               | Type                                            | Description |
| ---------------------------------------------------------------------------------- | ----------------------------------------------- | ----------- |
| [categories?](https://sheetbase.github.io/mail/interfaces/options.html#categories) | <code>Record<string, string \| Category></code> |             |
| [forwarding?](https://sheetbase.github.io/mail/interfaces/options.html#forwarding) | <code>undefined \| string</code>                |             |
| [templates?](https://sheetbase.github.io/mail/interfaces/options.html#templates)   | <code>Record<string, Template<unknown>></code>  |             |

</section>

<section id="lib" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="lib" href="https://sheetbase.github.io/mail/classes/lib.html"><p>Lib</p>
</a></h2>

**The `Lib` class.**

<h3><a name="lib-properties"><p>Lib properties</p>
</a></h3>

| Name                                                                                     | Type                                                                                                                         | Description |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [attachmentService](https://sheetbase.github.io/mail/classes/lib.html#attachmentservice) | <code><a href="https://sheetbase.github.io/mail/classes/attachmentservice.html" target="_blank">AttachmentService</a></code> |             |
| [helperService](https://sheetbase.github.io/mail/classes/lib.html#helperservice)         | <code><a href="https://sheetbase.github.io/mail/classes/helperservice.html" target="_blank">HelperService</a></code>         |             |
| [labelService](https://sheetbase.github.io/mail/classes/lib.html#labelservice)           | <code><a href="https://sheetbase.github.io/mail/classes/labelservice.html" target="_blank">LabelService</a></code>           |             |
| [mailRoute](https://sheetbase.github.io/mail/classes/lib.html#mailroute)                 | <code><a href="https://sheetbase.github.io/mail/classes/mailroute.html" target="_blank">MailRoute</a></code>                 |             |
| [mailService](https://sheetbase.github.io/mail/classes/lib.html#mailservice)             | <code><a href="https://sheetbase.github.io/mail/classes/mailservice.html" target="_blank">MailService</a></code>             |             |
| [mailThreadRoute](https://sheetbase.github.io/mail/classes/lib.html#mailthreadroute)     | <code><a href="https://sheetbase.github.io/mail/classes/mailthreadroute.html" target="_blank">MailThreadRoute</a></code>     |             |
| [mailThreadsRoute](https://sheetbase.github.io/mail/classes/lib.html#mailthreadsroute)   | <code><a href="https://sheetbase.github.io/mail/classes/mailthreadsroute.html" target="_blank">MailThreadsRoute</a></code>   |             |
| [messageService](https://sheetbase.github.io/mail/classes/lib.html#messageservice)       | <code><a href="https://sheetbase.github.io/mail/classes/messageservice.html" target="_blank">MessageService</a></code>       |             |
| [optionService](https://sheetbase.github.io/mail/classes/lib.html#optionservice)         | <code><a href="https://sheetbase.github.io/mail/classes/optionservice.html" target="_blank">OptionService</a></code>         |             |
| [threadService](https://sheetbase.github.io/mail/classes/lib.html#threadservice)         | <code><a href="https://sheetbase.github.io/mail/classes/threadservice.html" target="_blank">ThreadService</a></code>         |             |

<h3><a name="lib-methods"><p>Lib methods</p>
</a></h3>

| Function                                                              | Returns type                 | Description              |
| --------------------------------------------------------------------- | ---------------------------- | ------------------------ |
| [registerRoutes(routeEnabling?, middlewares?)](#lib-registerroutes-0) | <code>RouterService<></code> | Expose the module routes |

<h4><a name="lib-registerroutes-0" href="https://sheetbase.github.io/mail/classes/lib.html#registerroutes"><p><code>registerRoutes(routeEnabling?, middlewares?)</code></p>
</a></h4>

**Expose the module routes**

**Parameters**

| Param         | Type                                         | Description |
| ------------- | -------------------------------------------- | ----------- |
| routeEnabling | <code>true \| DisabledRoutes</code>          |             |
| middlewares   | <code>Middlewares \| RouteMiddlewares</code> |             |

**Returns**

<code>RouterService<></code>

---

</section>

<section id="routing" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="routing"><p>Routing</p>
</a></h2>

**MailModule** provides REST API endpoints allowing clients to access server resources. Theses enpoints are not exposed by default, to expose the endpoints:

```ts
MailModule.registerRoutes(routeEnabling?);
```

<h3><a name="routing-errors"><p>Errors</p>
</a></h3>

**MailModule** returns these routing errors, you may use the error code to customize the message:

- `mail/invalid-input`: Invalid input.
- `mail/missing-recipient`: Missing required recipient for the action
- `mail/no-access`: Current auth user has no access permission for the resource.

<h3><a name="routing-routes"><p>Routes</p>
</a></h3>

<h4><a name="routing-routes-overview"><p>Routes overview</p>
</a></h4>

| Route                               | Method  | Disabled | Description                                                                      |
| ----------------------------------- | ------- | -------- | -------------------------------------------------------------------------------- |
| [/mail](#GET__mail)                 | `GET`   |          | Get mail information                                                             |
| [/mail](#PATCH__mail)               | `PATCH` | `true`   | Reply to a thread/message                                                        |
| [/mail](#PUT__mail)                 | `PUT`   | `true`   | Send an email                                                                    |
| [/mail/thread](#GET__mail_thread)   | `GET`   | `true`   | Get a single message/thread                                                      |
| [/mail/threads](#GET__mail_threads) | `GET`   | `true`   | Get threads (list by category/single - parent + children/single - children only) |

<h4><a name="routing-routes-detail"><p>Routes detail</p>
</a></h4>

<h5><a name="GET__mail"><p><code>GET</code> /mail</p>
</a></h5>

Get mail information

**Response**

`object`

---

<h5><a name="PATCH__mail"><p><code>PATCH</code> /mail</p>
</a></h5>

`DISABLED` Reply to a thread/message

**Request body**

| Name       | Type                      | Description |
| ---------- | ------------------------- | ----------- |
| threadId?  | <a data-sref="string"><code>string</code></a>                |             |
| messageId? | <a data-sref="string"><code>string</code></a>                |             |
| **input**  | <a data-sref="MailingInput<unknown>"><code>MailingInput<unknown></code></a> |             |
| replyAll?  | <a data-sref="boolean"><code>boolean</code></a>               |             |

**Middleware data**

| Name     | Type         | Description |
| -------- | ------------ | ----------- |
| **auth** | <a data-sref="AuthData" href="https://sheetbase.github.io/mail/interfaces/authdata.html"><code>AuthData</code></a> |             |

**Response**

`GmailMessage | GmailThread`

---

<h5><a name="PUT__mail"><p><code>PUT</code> /mail</p>
</a></h5>

`DISABLED` Send an email

**Request body**

| Name          | Type                      | Description |
| ------------- | ------------------------- | ----------- |
| **recipient** | <a data-sref="string"><code>string</code></a>                |             |
| **subject**   | <a data-sref="string"><code>string</code></a>                |             |
| **input**     | <a data-sref="MailingInput<unknown>"><code>MailingInput<unknown></code></a> |             |
| categoryName? | <a data-sref="string"><code>string</code></a>                |             |

**Response**

`object`

---

<h5><a name="GET__mail_thread"><p><code>GET</code> /mail/thread</p>
</a></h5>

`DISABLED` Get a single message/thread

**Request query**

| Name       | Type       | Description |
| ---------- | ---------- | ----------- |
| threadId?  | <a data-sref="string"><code>string</code></a> |             |
| messageId? | <a data-sref="string"><code>string</code></a> |             |

**Middleware data**

| Name     | Type         | Description |
| -------- | ------------ | ----------- |
| **auth** | <a data-sref="AuthData" href="https://sheetbase.github.io/mail/interfaces/authdata.html"><code>AuthData</code></a> |             |

**Response**

`null | Thread`

---

<h5><a name="GET__mail_threads"><p><code>GET</code> /mail/threads</p>
</a></h5>

`DISABLED` Get threads (list by category/single - parent + children/single - children only)

**Request query**

| Name          | Type        | Description |
| ------------- | ----------- | ----------- |
| threadId?     | <a data-sref="string"><code>string</code></a>  |             |
| categoryName? | <a data-sref="string"><code>string</code></a>  |             |
| childrenOnly? | <a data-sref="boolean"><code>boolean</code></a> |             |
| full?         | <a data-sref="boolean"><code>boolean</code></a> |             |
| grouping?     | <a data-sref="boolean"><code>boolean</code></a> |             |

**Middleware data**

| Name     | Type         | Description |
| -------- | ------------ | ----------- |
| **auth** | <a data-sref="AuthData" href="https://sheetbase.github.io/mail/interfaces/authdata.html"><code>AuthData</code></a> |             |

**Response**

`Thread[] | GroupingThread | GroupingThread[]`

---

</section>

<section id="license" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

## License

**@sheetbase/mail** is released under the [MIT](https://github.com/sheetbase/mail/blob/master/LICENSE) license.

</section>
