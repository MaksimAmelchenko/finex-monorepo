import * as supertest from 'supertest';
import { ajv } from '../../libs/ajv';
import { OpenAPIV3_1 } from 'openapi-types';

export function validateResponse(response: supertest.Response, schema: OpenAPIV3_1.SchemaObject): void {
  const validate = ajv.compile(schema);
  if (!validate(response.body)) {
    console.log(
      '[ERROR] response is: ',
      JSON.stringify(response.body, null, 2),
      JSON.stringify(ajv.errorsText(validate.errors), null, 2)
    );
    throw new Error(ajv.errorsText(validate.errors));
  }
}
