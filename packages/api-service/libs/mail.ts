import config from './config';
import * as nodemailer from 'nodemailer';
import { SES } from './ses';

const transportType: string = config.get('mail:transport');
let options;
switch (transportType) {
  case 'json': {
    options = { jsonTransport: true };
    break;
  }

  case 'ses': {
    options = { SES };
    break;
  }
}

export const transport: nodemailer.Transporter = nodemailer.createTransport(options);
