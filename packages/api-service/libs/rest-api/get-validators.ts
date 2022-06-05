import { OpenAPIV3 } from 'openapi-types';
import { ValidateFunction } from 'ajv';
import * as isPlainObject from 'lodash.isplainobject';

import { ajv } from '../ajv';

import { Schemas, SchemasValidators } from './types';

export const emptyValidator: ValidateFunction = ajv.compile({});

export const getValidator = (schema: OpenAPIV3.SchemaObject | undefined): ValidateFunction =>
  schema && isPlainObject(schema) ? ajv.compile(schema) : emptyValidator;

export function getValidators(schemas: Schemas = {}): SchemasValidators {
  return {
    params: getValidator(schemas.params),
    response: getValidator(schemas.response),
  };
}
