import { IRequestContext } from '../types/app';
import uuid = require('uuid');
import { log } from './log';

export default function createRequestContext(requestId: string = uuid.v4()): IRequestContext {
  return {
    params: {},
    log: log.child(
      {
        requestId,
      },
      true
    ),
    requestId,
    userAgent: '?',
  };
}
