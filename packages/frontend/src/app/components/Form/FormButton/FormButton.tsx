import React from 'react';
import { useFormikContext } from 'formik';

import { Button, IButtonProps } from '@finex/ui-kit';

export interface IFormButton extends IButtonProps {
  isIgnoreValidation?: boolean;
}

/**
 * Use this button in Forms to auto-disable when form is not valid, or validating, or submitting
 * @param {IFormButton} props
 * @constructor
 */

export const FormButton = (props: IFormButton): JSX.Element => {
  const { isValid, isValidating, isSubmitting } = useFormikContext();
  const { disabled = false, isIgnoreValidation = false, ...rest } = props;

  const disable = disabled || (isIgnoreValidation ? false : !isValid);
  const loading = isValidating || isSubmitting;

  return <Button {...rest} disabled={disable || loading} />;
};
