import React from 'react';
import { useFormikContext } from 'formik';

import { FormButton, FormButtonProps } from '../Form';

interface SaveButtonProps extends FormButtonProps {
  isOnlySave?: boolean;
}

export function SaveButton({ isOnlySave = true, ...rest }: SaveButtonProps): JSX.Element {
  const { setFieldValue, handleSubmit } = useFormikContext();

  const handleClick = () => {
    setFieldValue('isOnlySave', isOnlySave);
    handleSubmit();
  };

  return <FormButton {...rest} onClick={handleClick} />;
}
