import React, { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';

import { ApiErrors } from '../../core/errors';
import { AuthRepository } from '../../core/other-stores/auth-repository';
import { Form, FormButton, FormError, FormInput, FormLayout } from '../../components/Form';
import { Layout } from '../../containers/Layout/Layout';
import { Link } from '../../components/Link/Link';
import { SignUpAcknowledgment } from './SignUpAcknowledgment/SignUpAcknowledgment';
import { analytics } from '../../lib/analytics';
import { currentLocale, defaultLocale, getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

interface ISignUpFormValues {
  name: string;
  username: string;
  password: string;
}

const t = getT('SignUp');

export function SignUp(): JSX.Element {
  const authStore = useStore(AuthRepository);
  const [email, setEmail] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);

  const onSubmit = useCallback(
    (values: ISignUpFormValues) => {
      return authStore.signUp(values).then(() => {
        setEmail(values.username);
        setIsDone(true);
        analytics.event('sign_up', { method: 'onsite' });
      });
    },
    [authStore]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t('Please enter your name')),
        username: Yup.string().required(t('Please enter your e-mail address')).email(t('Invalid email address')),
        password: Yup.string()
          .required(t('Please enter your password'))
          .min(8, t('Your password is not strong enough. Your password must be at least 8 characters.')),
      }),
    []
  );

  if (isDone) {
    return <SignUpAcknowledgment email={email} />;
  }

  const locale = currentLocale() === defaultLocale() ? '' : `${currentLocale()}/`;

  return (
    <Layout title={t('Create your FINEX account')}>
      <Form<ISignUpFormValues>
        onSubmit={onSubmit}
        initialValues={{ name: '', username: '', password: '' }}
        validationSchema={validationSchema}
        errorsHR={[
          //
          [ApiErrors.ConflictError, t('This e-mail already registered')],
        ]}
        name="sign-up"
      >
        <FormLayout>
          <FormInput name="name" type="text" label={t('Name')} autoFocus />
          <FormInput name="username" type="text" label={t('E-mail')} />
          <FormInput
            name="password"
            type="password"
            label={t('Password')}
            autoComplete="new-password"
            helperText={t(
              'Your password needs to be at least 8 characters. Include multiple words and phrases to make it more secure.'
            )}
          />
          <p>
            {t('By clicking Get started, you agree to FINEX')}{' '}
            {locale === 'ru' && (
              <Link href={`https://finex.io/${locale}legal/agreement/`}>
                {t('User Agreement')}
                {', '}
              </Link>
            )}
            <Link href={`https://finex.io/${locale}legal/terms/`}>{t('Terms of Use')}</Link> {t('and ')}{' '}
            <Link href={`https://finex.io/${locale}legal/privacy/`}>{t('Privacy Policy')}</Link>
          </p>

          <FormError />
          <FormButton type="submit" size="lg" variant="primary" fullSize isIgnoreValidation>
            {t('Get started')}
          </FormButton>
          <div>
            <span>{t('Already have an account?')}</span> <Link href="/sign-in">{t('Log in')}</Link>
          </div>
        </FormLayout>
      </Form>
    </Layout>
  );
}

export default SignUp;
