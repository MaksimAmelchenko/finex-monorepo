import React, { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';

import { ApiErrors } from '../../core/errors';
import { AuthRepository } from '../../core/other-stores/auth-repository';
import { CommonStorageStore } from '../../core/other-stores/common-storage-store';
import { Form, FormButton, FormError, FormLayout, FormTextField } from '../../components/Form';
import { Layout } from '../../containers/Layout/Layout';
import { ResetPasswordAcknowledgment } from './ResetPasswordAcknowledgment/ResetPasswordAcknowledgment';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './ResetPassword.module.scss';

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
        username: Yup.string().required(t('Please enter email address')).email(t('Please enter a valid email address')),
      }),
    []
  );

  if (isDone) {
    return <ResetPasswordAcknowledgment />;
  }

  return (
    <Layout title={t('Forgot your Password?')}>
      <div className={styles.container}>
        <Form<ResetPasswordFormValues>
          onSubmit={onSubmit}
          initialValues={{ username }}
          validationSchema={validationSchema}
          errorsHR={[
            //
            [ApiErrors.NotFound, t('User not found')],
          ]}
        >
          <FormLayout className={styles.formLayout}>
            {t('To reset you password enter your email')}
            <FormTextField name="username" type="text" label={t('Email')} autoFocusOnEmpty={true} />
            <FormError />
            <FormButton type="submit" color="blue" fullSize>
              {t('Next')}
            </FormButton>
          </FormLayout>
        </Form>
      </div>
    </Layout>
  );
}

export default ResetPassword;
