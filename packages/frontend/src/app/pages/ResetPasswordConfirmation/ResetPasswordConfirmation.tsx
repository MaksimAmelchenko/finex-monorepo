import React, { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { Navigate, useSearchParams } from 'react-router-dom';

import { ApiErrors } from '../../core/errors';
import { AuthRepository } from '../../core/other-stores/auth-repository';
import { Form, FormButton, FormError, FormLayout, FormTextField } from '../../components/Form';
import { Layout } from '../../containers/Layout/Layout';
import { ResetPasswordConfirmationAcknowledgment } from './ResetPasswordConfirmationAcknowledgment/ResetPasswordConfirmationAcknowledgment';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './ResetPasswordConfirmation.module.scss';

interface ResetPasswordConfirmationFormValues {
  password: string;
}

const t = getT('ResetPasswordConfirmation');

export function ResetPasswordConfirmation(): JSX.Element {
  const authStore = useStore(AuthRepository);

  const [isDone, setIsDone] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(
    ({ password }: ResetPasswordConfirmationFormValues) => {
      if (token) {
        return authStore.resetPasswordConfirmation(token, password).then(() => {
          setIsDone(true);
        });
      }

      return Promise.reject('Token not found');
    },
    [authStore, token]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        password: Yup.string()
          .required(t('Please enter password'))
          .min(8, t('Use 8 characters or more for your password')),
      }),
    []
  );

  if (!token) {
    return <Navigate to="/" />;
  }

  if (isDone) {
    return <ResetPasswordConfirmationAcknowledgment />;
  }

  return (
    <Layout title={t('Reset Password')}>
      <div className={styles.container}>
        <Form<ResetPasswordConfirmationFormValues>
          onSubmit={onSubmit}
          initialValues={{ password: '' }}
          validationSchema={validationSchema}
          errorsHR={[
            [ApiErrors.Expired, t('The password has already been reset')],
            [ApiErrors.NotFound, t('Password reset request not found')],
          ]}
          name="reset-password-confirmation"
        >
          <FormLayout className={styles.formLayout}>
            <FormTextField
              name="password"
              type="password"
              label={t('New password')}
              autoFocusOnEmpty={true}
              autoComplete="new-password"
              helperText={t('Use 8 or more characters with a mix of letters, numbers & symbols')}
            />

            <FormError />
            <FormButton type="submit" size="lg" variant="primary" fullSize>
              {t('Reset')}
            </FormButton>
          </FormLayout>
        </Form>
      </div>
    </Layout>
  );
}

export default ResetPasswordConfirmation;
