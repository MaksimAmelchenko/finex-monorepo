import config from './config';
import * as nodemailer from 'nodemailer';

import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const { region, credentials } = config.get('mail:service');

const sesClient = new SESv2Client({ region, credentials });

class SendRawEmailCommand extends SendEmailCommand {
  constructor(params) {
    const input = {
      Content: {
        Raw: {
          Data: params.RawMessage.Data,
        },
      },
      FromEmailAddress: params.Source,
      Destination: {
        ToAddresses: params.Destinations,
      },
    };
    super(input);
  }
}

const transportType: string = config.get('mail:transport');
let options;

switch (transportType) {
  case 'json': {
    options = { jsonTransport: true };
    break;
  }

  case 'ses': {
    options = {
      SES: {
        ses: sesClient,
        aws: {
          SendRawEmailCommand,
        },
      },
    };
    break;
  }
}

export const transport: nodemailer.Transporter = nodemailer.createTransport(options);
