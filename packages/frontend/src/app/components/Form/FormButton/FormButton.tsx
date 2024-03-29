import React from 'react';
import { useFormikContext } from 'formik';

import { Button, ButtonProps } from '@finex/ui-kit';

export interface FormButtonProps extends ButtonProps {
  isIgnoreValidation?: boolean;
}

/**
 * Use this button in Forms to auto-disable when form is not valid, or validating, or submitting
 * @param {FormButtonProps} props
 * @constructor
 */

export function FormButton(props: FormButtonProps): JSX.Element {
  const { isValid, isValidating, isSubmitting } = useFormikContext();
  const { disabled = false, isIgnoreValidation = false, ...rest } = props;

  const disable = disabled || (isIgnoreValidation ? false : !isValid);
  const loading = isValidating || isSubmitting;

  return <Button {...rest} disabled={disable || loading} />;
}
