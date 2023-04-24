import * as fs from 'fs';
import * as path from 'path';

export const cf$_currency_get_rate_v2 = {
  up: fs.readFileSync(path.resolve(__dirname, './v2-up.sql'), { encoding: 'utf8' }),
  down: fs.readFileSync(path.resolve(__dirname, './v2-down.sql'), { encoding: 'utf8' }),
};
