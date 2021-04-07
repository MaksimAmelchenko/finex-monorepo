import * as nconf from 'nconf';
import * as path from 'path';
import { camelCase } from './camel-case';
import * as fs from 'fs';

nconf.env({
  separator: '__',
  parseValues: true,
  transform: obj => {
    // 'EMAIL_SERVICE__DOMAIN' => 'emailService__domain'
    obj.key = obj.key.split('__').map(camelCase).join('__');
    return obj;
  },
});

nconf.use('memory');

const env = nconf.get('nodeEnv') || 'development';
const configPath: string = path.join(__dirname, '../../config');

// if NODE_ENV=development-test-local then the next files will be loaded:
// development-test-local.js
// development-test.js
// development.js
// default.js

const files: string[] = env
  .split('-')
  .map((_, index, array) => {
    return array.slice(0, index + 1).join('-');
  })
  .reverse();

files.forEach(file => {
  try {
    const envCfg = require(`${configPath}/${file}`).default;
    nconf.add(file, { type: 'literal', store: envCfg });
    console.log(file);
  } catch (e) {
    console.log(e);
    console.warn(`Config "${file}" not found`);
  }
});

try {
  const defaults = require(`${configPath}/default`).default;
  nconf.add('defaults', { type: 'literal', store: defaults });
} catch (e) {
  console.warn('Default config not found');
}

let ver;

try {
  ver = fs.readFileSync('./version', 'utf8');
} catch (e) {
  ver = process.env.npmPackageVersion;
  if (!ver) {
    const packageJsonPath = path.join(process.cwd(), './package.json');
    ver = require(packageJsonPath).version;
  }
}

nconf.set('version', ver);

if (nconf.get('awsProfile')) {
  process.env.AWS_PROFILE = nconf.get('awsProfile');
}

export default nconf;
