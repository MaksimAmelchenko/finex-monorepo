import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';

import { ApiErrors } from '../../core/errors';
import { AuthRepository } from '../../core/other-stores/auth-repository';
import { CommonStorageStore } from '../../core/other-stores/common-storage-store';
import { Form, FormButton, FormError, FormLayout, FormTextField } from '../../components/Form';
import { Link } from '../../components/Link/Link';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './SignIn.module.scss';
import { Layout } from '../../containers/Layout/Layout';

interface ISignInFormValues {
  username: string;
  password: string;
}

const t = getT('SignIn');

export function SignIn(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const authStore = useStore(AuthRepository);
  const username = useStore(CommonStorageStore).get('username') ?? '';

  const from = (location.state as any)?.from?.pathname || '/';

  const onSubmit = useCallback(
    (values: ISignInFormValues, formHelpers: FormikHelpers<ISignInFormValues>) => {
      return authStore
        .signIn(values)
        .then(() => {
          // Send them back to the page they tried to visit when they were
          // redirected to the login page. Use { replace: true } so we don't create
          // another entry in the history stack for the login page.  This means that
          // when they get to the protected page and click the back button, they
          // won't end up back on the login page, which is also really nice for the
          // user experience.
          navigate(from, { replace: true });
        })
        .catch(error => {
          // On error from backend we clear-up password field without validation
          formHelpers.setFieldValue('password', '', false);
          throw error;
        });
    },
    [authStore]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        username: Yup.string().required(t('Please enter email address')).email(t('Please enter a valid email address')),
        password: Yup.string().required(t('Please enter password')),
      }),
    []
  );

  return (
    <Layout title={t('Sign in')}>
      <div className={styles.container}>
        <Form<ISignInFormValues>
          onSubmit={onSubmit}
          // afterSubmit={afterSubmit}
          initialValues={{ username, password: '' }}
          validationSchema={validationSchema}
          errorsHR={[
            //
            [
              ApiErrors.Unauthorized,
              t('Invalid username or password. To reset your password click "Forgot your Password?"'),
            ],
          ]}
        >
          <FormLayout className={styles.formLayout}>
            <FormTextField name="username" type="text" label={t('Email')} autoFocusOnEmpty={true} />
            <FormTextField
              name="password"
              type="password"
              label={t('Password')}
              autoFocusOnEmpty={true}
              autoComplete="current-password"
            />
            <FormError />
            <FormButton type="submit" color="blue" fullSize isIgnoreValidation={true}>
              {t('SignIn')}
            </FormButton>
            <Link href="/">{t('Forgot your Password?')}</Link>
            <div>
              <span>{t('New to FINEX?')}</span> <Link href="/sign-up">{t('Create an account')}</Link>
            </div>
          </FormLayout>
        </Form>
      </div>
    </Layout>
  );
}

export default SignIn;
