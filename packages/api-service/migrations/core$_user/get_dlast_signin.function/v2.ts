import * as fs from 'fs';
import * as path from 'path';

export const get_dlast_signin_v2 = {
  up: fs.readFileSync(path.resolve(__dirname, './v2-up.sql'), { encoding: 'utf8' }),
  down: fs.readFileSync(path.resolve(__dirname, './v1-up.sql'), { encoding: 'utf8' }),
};
