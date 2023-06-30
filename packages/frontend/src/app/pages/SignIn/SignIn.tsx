import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { AuthRepository } from '../../core/other-stores/auth-repository';
import { CommonStorageStore } from '../../core/other-stores/common-storage-store';
import { Form, FormButton, FormInput, FormLayout } from '../../components/Form';
import { Layout } from '../../containers/Layout/Layout';
import { Link } from '../../components/Link/Link';
import { Loader } from '../../components/Loader/Loader';
import { Locale } from '../../types';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

interface ISignInFormValues {
  username: string;
  password: string;
}

const { NX_DEMO_EN = '/', NX_DEMO_DE = '/', NX_DEMO_RU = '/' } = process.env;

const demoUserMap: Record<string, { username: string; password: string }> = {};

if (NX_DEMO_EN) {
  const [username, password] = NX_DEMO_EN.split('/');
  demoUserMap[Locale.En] = {
    username,
    password,
  };
}

if (NX_DEMO_DE) {
  const [username, password] = NX_DEMO_DE.split('/');
  demoUserMap[Locale.De] = {
    username,
    password,
  };
}

if (NX_DEMO_RU) {
  const [username, password] = NX_DEMO_RU.split('/');
  demoUserMap[Locale.Ru] = {
    username,
    password,
  };
}

const t = getT('SignIn');

export function SignIn(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const authStore = useStore(AuthRepository);
  const username = useStore(CommonStorageStore).get('username') ?? '';
  const { enqueueSnackbar } = useSnackbar();

  const { pathname: from = '/', search = '' } = location.state?.from || {};
  // get locale search parameter from location 'https://app.finex.io/demo?locale=en'
  const locale = (search && (new URLSearchParams(search).get('locale') as Locale)) || Locale.En;

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
          analytics.event('login', { method: 'onsite' });
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

  if (from === '/demo') {
    const user = demoUserMap[locale];
    if (user) {
      const { username, password } = user;
      authStore.signIn({ username, password }).then(() => {
        analytics.event('login', { method: 'onsite-demo' });
        navigate('/');
      });

      return <Loader />;
    }
  }

  const isThereUsername = Boolean(username);
  return (
    <Layout title={t('Log in')}>
      <Form<ISignInFormValues>
        onSubmit={onSubmit}
        initialValues={{ username, password: '' }}
        validationSchema={validationSchema}
        name="log-in"
      >
        <FormLayout>
          <FormInput name="username" type="email" label={t('E-mail')} autoFocus={!isThereUsername} />
          <FormInput
            name="password"
            type="password"
            label={t('Password')}
            autoFocus={isThereUsername}
            autoComplete="current-password"
          />
          <FormButton type="submit" variant="primary" size="lg" fullSize isIgnoreValidation>
            {t('Continue')}
          </FormButton>
          <Link href="/reset-password">{t('Forgot your password?')}</Link>
          <div>
            <span>{t('New to FINEX?')}</span> <Link href="/sign-up">{t('Create an account')}</Link>
          </div>
        </FormLayout>
      </Form>
    </Layout>
  );
}

export default SignIn;
