import { closeSession } from './methods/close-session';
import { createSession } from './methods/create-session';
import { getJwt } from './methods/get-jwt';
import { getSession } from './methods/get-session';
import { updateSession } from './methods/update-session';
import { updateSessionAccessTime } from './methods/update-session-access-time';
import { verifyJwt } from './methods/verify-jwt';

export const SessionService = {
  closeSession,
  createSession,
  getJwt,
  getSession,
  updateSession,
  updateSessionAccessTime,
  verifyJwt,
};
