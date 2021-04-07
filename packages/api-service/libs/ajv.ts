import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';

const ajv: Ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
});

ajvFormats(ajv);
ajv.addKeyword('example');

ajv.addFormat('json', (str: string): boolean => {
  try {
    const obj: any = JSON.parse(str);
    return Boolean(obj) && typeof obj === 'object';
  } catch (e) {
    return false;
  }
});

export { ajv };
