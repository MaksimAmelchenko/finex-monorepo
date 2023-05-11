import * as EmailTemplates from 'email-templates';
import * as path from 'node:path';

import config from '../../../libs/config';

import { IRequestContext } from '../../../types/app';
import { ISendParams } from '../../../types/transactional-email';
import { saveToLog } from './save-to-log';
import { transport } from '../../../libs/mail';

import de from '../../../locales/de';
import en from '../../../locales/en';
import ru from '../../../locales/ru';

const {
  from,
  templates: { resourcePath, viewsPath },
} = config.get('mail');

const locales = config.get('locales');

const isTest = config.get('nodeEnv').includes('test');

const emailTemplates = new EmailTemplates({
  juiceResources: {
    webResources: {
      relativeTo: path.join(process.cwd(), resourcePath),
    },
  },
  views: {
    root: path.join(process.cwd(), viewsPath),
  },
  message: {
    from,
  },
  htmlToText: false,
  send: !isTest,
  // preview: { openSimulator: false },
  transport,
  // https://github.com/mashpie/i18n-node#list-of-all-configuration-options
  i18n: {
    locales,
    defaultLocale: locales[0],
    objectNotation: true,
    staticCatalog: {
      en,
      de,
      ru,
    },
  },
});

// example of usage in template:
// | !{t('invoice.subject', {orderNumber: order.orderNumber, fullName})}
// | #{t('invoice.text', {orderNumber: order.orderNumber})}
// h2.title !{t('order.issuer', { fullName })}
// h3.subtitle #{t('order.number', { orderNumber: order.orderNumber })}

export async function send(ctx: IRequestContext, params: ISendParams): Promise<void> {
  const { email, template, locals, attachments } = params;

  const response = await emailTemplates.send({
    template,
    message: {
      to: email,
      attachments,
    },
    locals: {
      ...locals,
      locale: ctx.params.locale,
    },
  });

  response.message = '<removed>';
  response.raw = '<removed>';
  response.originalMessage.attachments = response.originalMessage.attachments.map(({ filename }) => ({ filename }));

  saveToLog(ctx, email, response).catch(err => {
    ctx.log.error({ err });
  });

  response.originalMessage.html = '<removed>';

  ctx.log.trace({ ses: response });
}
