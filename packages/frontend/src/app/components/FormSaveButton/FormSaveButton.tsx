import React from 'react';
import { useFormikContext } from 'formik';

import { FormButton, FormButtonProps } from '../Form';

export function SaveButton(props: FormButtonProps): JSX.Element {
  const { setFieldValue, handleSubmit } = useFormikContext();
  const handleClick = () => {
    setFieldValue('isOnlySave', true);
    handleSubmit();
  };

  return <FormButton {...props} onClick={handleClick} />;
}
