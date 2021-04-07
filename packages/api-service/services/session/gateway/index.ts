import { closeSession } from './methods/close-session';
import { createSession } from './methods/create-session';
import { getSession } from './methods/get-session';
import { updateSession } from './methods/update-session';

// tslint:disable-next-line:variable-name
export const SessionGateway = {
  close: closeSession,
  create: createSession,
  get: getSession,
  update: updateSession,
};
