import * as fs from 'fs';
import * as path from 'path';

export const create__text_text_v1 = {
  up: fs.readFileSync(path.resolve(__dirname, './v1-up.sql'), { encoding: 'utf8' }),
  down: fs.readFileSync(path.resolve(__dirname, './v1-down.sql'), { encoding: 'utf8' }),
};
