import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

import {
  FormikConfig,
  FormikHelpers,
  FormikProps,
  FormikProvider,
  FormikValues,
  isEmptyChildren,
  isFunction,
  useFormik,
} from 'formik';

import { CoreError } from '../../core/errors';
import { CoreErrorConstructor, ErrorTranslation, translateErrorToHR } from '../../core/errors-translation';
import { ErrorContextValue, FormErrorProvider } from './FormError/FormError';

import styles from './Form.module.scss';

export type IFormProps<Values> = Omit<FormikConfig<Values>, 'onSubmit'> & {
  /**
   * Used for resetting a form state (saved -> not saved)
   */
  onChange?: (values: Values) => void;

  onDirtyChange?: (dirty: boolean) => void;

  /**
   * Process submitted values, in most cases they need to sent to backend
   * @param {Values} values
   * @param {FormikHelpers<Values>} formikHelpers
   * @return {void | Promise<any>}
   */
  onSubmit?: (values: Values, formikHelpers: FormikHelpers<Values>, initialValues: Values) => void | Promise<any>;

  /**
   * Callback which provide access to errors
   * @param {hr} errorsMap HumanReadable translations
   * @param {error} original CoreError
   * @return {void}
   */
  onError?: (hr: string | JSX.Element, error: CoreError) => void;

  /**
   * Provide custom errors translation to human readable form for each error class.
   * It will be merged with defaultApiErrorsHR.
   * Errors are compared by instanceof in provided order.
   *
   * RATIONALE: Quite often same error interpretation depends on context (form) where it happened
   * So, the only way to properly translate it into human readable is interpret it for each form
   * But, to avoid excessive code, we use defaultApiErrorsHR,
   * which contains default translations for the most common errors
   */
  errorsHR?: Map<CoreErrorConstructor, ErrorTranslation> | [CoreErrorConstructor, ErrorTranslation][];

  /**
   * Some syntax sugar for callback that called when onSubmit promise is resolved
   * If you need to handle successful submission of the form
   * @param result
   */
  afterSubmit?: (result: any) => unknown;
  className?: string;
  name: string;
};

/**
 * Use this component to render a form and handle it with repositories
 */
export function Form<Values extends FormikValues>(props: IFormProps<Values>): JSX.Element {
  const { children, component, render, initialValues } = props;
  const { onChange, onSubmit, onError, errorsHR, afterSubmit, onDirtyChange, className, name, ...rest } = props;

  // Prepare everything for errors translation to HumanReadable form
  const [errorContextValue, setErrorContextState] = useState<ErrorContextValue>({});

  // Run all submit handlers and process errors if any occurred
  const onSubmitCallback = useCallback(
    (values: Values, formikHelpers: FormikHelpers<Values>) => {
      if (onSubmit) {
        setErrorContextState({});
        let result = onSubmit(values, formikHelpers, initialValues);
        // If onSubmit returned Promise, we try to process it's error
        if (result instanceof Promise) {
          // On successful submission call afterSubmit
          if (afterSubmit) {
            result = result.then((submissionResult: any) => afterSubmit(submissionResult));
          }
          // Form must process only one submit at a time,
          // it is supposed to block any attempts to submit while the previous submission is not finished,
          // so we don't care about canceling previous promise, and assume there's only one promise at a time
          result = result.catch((e: CoreError) => {
            const hr = translateErrorToHR(e, errorsHR);
            setErrorContextState({ hr, error: e });
            onError && onError(hr, e);
          });
        }
        // We return original submission promise anyway
        return result;
      }
    },
    [afterSubmit, onError, errorsHR, onSubmit, initialValues]
  );

  const formikBag = useFormik<Values>({
    validateOnBlur: false,
    validateOnChange: false,
    ...rest,
    onSubmit: onSubmitCallback,
  });

  useEffect(() => {
    onChange && onChange(formikBag.values);
  }, [formikBag.values, onChange]);

  useEffect(() => {
    onDirtyChange && onDirtyChange(formikBag.dirty);
  }, [formikBag.dirty, onDirtyChange]);

  return (
    <FormikProvider value={formikBag}>
      <FormErrorProvider value={errorContextValue}>
        <form
          onSubmit={formikBag.handleSubmit}
          onReset={formikBag.handleReset}
          name={name}
          className={clsx(styles.form, className)}
        >
          {component
            ? React.createElement(component as any, formikBag)
            : render
            ? render(formikBag)
            : children // children come last, always called
            ? isFunction(children)
              ? (children as (bag: FormikProps<Values>) => JSX.Element)(formikBag as FormikProps<Values>)
              : !isEmptyChildren(children)
              ? children
              : null
            : null}
        </form>
      </FormErrorProvider>
    </FormikProvider>
  );
}
