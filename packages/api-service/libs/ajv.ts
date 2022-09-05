import Ajv from 'ajv-draft-04';
import ajvFormats from 'ajv-formats';
import { AjvValidator } from 'objection';

const ajv: Ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  // useDefaults: true,
});

ajv.addKeyword('example');

ajvFormats(ajv);

ajv.addFormat('json', (str: string): boolean => {
  try {
    const obj: any = JSON.parse(str);
    return Boolean(obj) && typeof obj === 'object';
  } catch (e) {
    return false;
  }
});

// for objections model validations
// static createValidator(): Validator {
//   return ajvValidator;
// }

const ajvValidator: AjvValidator = new AjvValidator({
  onCreateAjv: ajv => {
    ajv.addKeyword('example');
    ajvFormats(ajv);
  },
  options: {
    allErrors: true,
    validateSchema: false,
    ownProperties: true,
  },
});

export { ajv, ajvValidator };
