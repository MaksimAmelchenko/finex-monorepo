import { closeSession } from './methods/close-session';
import { createSession } from './methods/create-session';
import { getJwt } from './methods/get-jwt';
import { getSession } from './methods/get-session';
import { updateSessionAccessTime } from './methods/update-session-access-time';
import { updateSession } from './methods/update-session';
import { verifyJwt } from './methods/verify-jwt';

// tslint:disable-next-line:variable-name
export const Session = {
  close: closeSession,
  create: createSession,
  getJwt,
  get: getSession,
  updateAccessTime: updateSessionAccessTime,
  update: updateSession,
  verifyJwt,
};
