import config from './config';
import * as nodemailer from 'nodemailer';

const transportType: string = config.get('mail:transport');
const smtp: string = config.get('mail:smtp');
let options;

switch (transportType) {
  case 'json': {
    options = { jsonTransport: true };
    break;
  }

  case 'smtp': {
    options = smtp;
    break;
  }
}

export const transport: nodemailer.Transporter = nodemailer.createTransport(options);
