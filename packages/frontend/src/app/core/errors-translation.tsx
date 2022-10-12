import React from 'react';

import { getT } from '../lib/core/i18n';
import { ApiErrors, CoreError } from './errors';

/**
 * For each CoreError sub-class, you may pass a human readable (HR) string
 * or a function that takes the error in arguments and return HR string
 */
export type ErrorTranslation = string | JSX.Element | ((error: CoreError) => string);

/**
 * Type which determines CoreError class constructor,
 * You need to pass the class itself, not one of its instances
 * see defaultApiErrorsHR
 */
export type CoreErrorConstructor = new (...args: any[]) => CoreError;

/**
 * Fallback HR text for unknown or useless error for a user.
 * "Something went wrong, please try again."
 */
const unknownErrorHr = 'Something went wrong, please try again.';

const t = getT('Error');
/**
 * These are default CoreErrors interpretations used in Form
 * to show errors to user
 * @type {any[]}
 */
export const defaultApiErrorsHR: [CoreErrorConstructor, ErrorTranslation][] = [
  [ApiErrors.Unauthorized, t('The requested resource is restricted and requires authentication.')],
  [ApiErrors.NetworkError, t('Could not connect to servers, please try again')],
  [ApiErrors.ServerError, t('Something wrong happened with server, please try again.')],
  [CoreError, t('Something went wrong, please try again')],
];

/**
 * Merges errorsMap with defaultApiErrorsHR and find the first (in array/map order) matching error translation.
 * Provided errorsMap translations have higher priority to the defaultApiErrorsHR.
 * @param error
 * @param errorsMap
 */
export function translateErrorToHR(
  error: CoreError | unknown,
  errorsMap?: Map<CoreErrorConstructor, ErrorTranslation> | [CoreErrorConstructor, ErrorTranslation][]
): string | JSX.Element {
  const errorsFullMap = Array.from(new Map<CoreErrorConstructor, ErrorTranslation>(errorsMap || []).entries()).concat(
    defaultApiErrorsHR
  );

  if (error instanceof CoreError) {
    const firstErrorMatch = errorsFullMap.find(
      (hr: [CoreErrorConstructor, ErrorTranslation]) => error instanceof hr[0]
    );
    if (firstErrorMatch) {
      const hrValue = firstErrorMatch[1];
      return typeof hrValue === 'function' ? hrValue(error) : hrValue;
    }
  }

  return unknownErrorHr;
}
