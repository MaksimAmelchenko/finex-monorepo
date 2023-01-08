import { OpenAPIV3 } from 'openapi-types';

import { Locale } from '../../../types/app';
import config from '../../../libs/config';

interface IOption {
  defaultLocale?: Locale;
  override?: OpenAPIV3.SchemaObject;
  exampleValue?: any;
  defaultValue?: any;
  descriptionValue?: any;
  isRequiredDefaultLocale?: boolean;
}

export const i18n = (type: OpenAPIV3.SchemaObject, options: IOption = {}): OpenAPIV3.SchemaObject => {
  const locales = (config.get('locales') as Locale[]) || ['de'];

  const {
    defaultLocale = locales[0],
    exampleValue,
    defaultValue,
    override = {},
    isRequiredDefaultLocale = false,
  } = options;
  const exampleExpression = exampleValue !== undefined ? { example: { [defaultLocale]: exampleValue } } : {};
  const defaultExpression = defaultValue !== undefined ? { default: { [defaultLocale]: defaultValue } } : {};
  const requiredExpression = isRequiredDefaultLocale ? { required: [defaultLocale] } : {};
  return {
    type: 'object',
    properties: locales.reduce((acc, locale) => {
      acc[locale] = type;
      return acc;
    }, {}),
    ...defaultExpression,
    ...exampleExpression,
    ...requiredExpression,
    additionalProperties: false,
    ...override,
  };
};
