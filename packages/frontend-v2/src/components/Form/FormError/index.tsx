import { createContext, h, JSX } from 'preact';
import { useContext } from 'preact/hooks';

import { CoreError } from '../../../core/errors';

import style from './style.css';

export type ErrorContextValue = { hr: string | JSX.Element; error: CoreError } | {};

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
  return hasError(errorContextValue) ? <div class={style.error}>{errorContextValue.hr}</div> : null;
};
