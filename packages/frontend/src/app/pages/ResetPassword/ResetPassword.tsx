import React, { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';

import { ApiErrors } from '../../core/errors';
import { AuthRepository } from '../../core/other-stores/auth-repository';
import { CommonStorageStore } from '../../core/other-stores/common-storage-store';
import { Form, FormButton, FormError, FormInput, FormLayout } from '../../components/Form';
import { Layout } from '../../containers/Layout/Layout';
import { ResetPasswordAcknowledgment } from './ResetPasswordAcknowledgment/ResetPasswordAcknowledgment';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

interface ResetPasswordFormValues {
  username: string;
}

const t = getT('ResetPassword');

export function ResetPassword(): JSX.Element {
  const authStore = useStore(AuthRepository);
  const username = useStore(CommonStorageStore).get('username') ?? '';
  const [isDone, setIsDone] = useState<boolean>(false);

  const onSubmit = useCallback(
    ({ username }: ResetPasswordFormValues) => {
      return authStore.resetPassword(username).then(() => {
        setIsDone(true);
      });
    },
    [authStore]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        username: Yup.string().required(t('Please enter your e-mail address')).email(t('Invalid email address')),
      }),
    []
  );

  if (isDone) {
    return <ResetPasswordAcknowledgment />;
  }

  return (
    <Layout title={t('Forgot your password?')}>
      <Form<ResetPasswordFormValues>
        onSubmit={onSubmit}
        initialValues={{ username }}
        validationSchema={validationSchema}
        errorsHR={[
          //
          [ApiErrors.NotFound, t('User not found')],
        ]}
        name="reset-password"
      >
        <FormLayout>
          <p>
            {t(
              "Enter the email address associated with your account and we'll send you a link to reset your password."
            )}
          </p>
          <FormInput name="username" type="text" label={t('E-mail')} autoFocus />
          <FormError />
          <FormButton type="submit" variant="primary" size="lg" fullSize>
            {t('Continue')}
          </FormButton>
        </FormLayout>
      </Form>
    </Layout>
  );
}

export default ResetPassword;
