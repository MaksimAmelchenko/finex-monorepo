import config from './libs/config';

const { user, password } = config.get('db:migrations');

const db = config.get('db');

module.exports = {
  ...db,
  connection: {
    ...db.connection,
    user,
    password,
  },
};
