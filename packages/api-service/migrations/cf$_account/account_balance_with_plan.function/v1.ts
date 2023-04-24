import * as fs from 'node:fs';
import * as path from 'node:path';

export const account_balance_with_plan_v1 = {
  up: fs.readFileSync(path.resolve(__dirname, './v1-up.sql'), { encoding: 'utf8' }),
  down: fs.readFileSync(path.resolve(__dirname, './v1-down.sql'), { encoding: 'utf8' }),
};
