import * as EmailTemplates from 'email-templates';
import * as path from 'path';

import config from '../../../libs/config';

import { IRequestContext } from '../../../types/app';
import { ISendParams } from '../../../types/transactional-email';
import { transport } from '../../../libs/mail';
import { saveToLog } from './save-to-log';

const {
  from,
  templates: { resourcePath, viewsPath },
} = config.get('mail');

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
  send: false,
  preview: true,
  transport,
});

export async function send(ctx: IRequestContext, params: ISendParams): Promise<void> {
  const { email, template, locals, attachments } = params;

  const response = await emailTemplates.send({
    template,
    message: {
      to: email,
      attachments,
    },
    locals,
  });

  saveToLog(ctx, email, response).catch(err => {
    ctx.log.error({ err });
  });

  ctx.log.trace({ ses: { ...response, message: undefined } });
}
