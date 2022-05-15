import { createContext, useContext } from 'react';

import { CoreError } from '../../../core/errors';

import styles from './FormError.module.scss';

export type ErrorContextValue = { hr: string | JSX.Element; error: CoreError } | Record<string, unknown>;

export function hasError(a: ErrorContextValue): a is { hr: string; error: CoreError } {
  return a && (a as any).hr !== undefined && (a as any).error;
}

export const formErrorContext = createContext<ErrorContextValue>({});

export const FormErrorProvider = formErrorContext.Provider;
export const FormErrorConsumer = formErrorContext.Consumer;

/**
 * TODO: Add styles when design will be available
 * Renders a form submit error if any happened
 */
export const FormError = (): JSX.Element | null => {
  const errorContextValue = useContext<ErrorContextValue>(formErrorContext);
  return hasError(errorContextValue) ? (
    <div className={styles.error} dangerouslySetInnerHTML={{ __html: errorContextValue.hr }} />
  ) : null;
};
