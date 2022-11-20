import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { AuthRepository } from '../../core/other-stores/auth-repository';
import { CommonStorageStore } from '../../core/other-stores/common-storage-store';
import { Form, FormButton, FormError, FormLayout, FormTextField } from '../../components/Form';
import { Layout } from '../../containers/Layout/Layout';
import { Link } from '../../components/Link/Link';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './SignIn.module.scss';

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
  const { enqueueSnackbar } = useSnackbar();

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
        .catch(err => {
          let message = '';
          switch (err.code) {
            case 'unauthorized': {
              message = t('Invalid username or password');
              break;
            }
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });

          // On error from backend we clear-up password field without validation
          formHelpers.setFieldValue('password', '', false);
          throw err;
        });
    },
    [authStore, enqueueSnackbar, from, navigate]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        username: Yup.string().required(t('Please enter your e-mail')).email(t('Invalid e-mail address')),
        password: Yup.string().required(t('Please enter your password')),
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
        >
          <FormLayout>
            <FormTextField name="username" type="text" label={t('E-mail')} autoFocusOnEmpty={true} />
            <FormTextField
              name="password"
              type="password"
              label={t('Password')}
              autoFocusOnEmpty={true}
              autoComplete="current-password"
            />
            <FormButton type="submit" size="medium" color="primary" fullSize isIgnoreValidation>
              {t('SignIn')}
            </FormButton>
            <Link href="/reset-password">{t('Forgot your password?')}</Link>
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
