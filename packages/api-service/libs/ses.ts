import { AWS } from './aws';
import config from './config';

const service = config.get('mail:service');

export const SES = new AWS.SES({
  apiVersion: '2010-12-01',
  ...service,
});
