import { createSession } from './methods/create-session';
import { getSession } from './methods/get-session';
import { updateSession } from './methods/update-session';

export const SessionGateway = {
  createSession,
  getSession,
  updateSession,
};
