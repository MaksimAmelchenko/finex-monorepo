import React, { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';

import { ApiErrors } from '../../core/errors';
import { AuthRepository } from '../../core/other-stores/auth-repository';
import { Form, FormButton, FormError, FormLayout, FormTextField } from '../../components/Form';
import { Layout } from '../../containers/Layout/Layout';
import { Link } from '../../components/Link/Link';
import { SignUpAcknowledgment } from './SignUpAcknowledgment/SignUpAcknowledgment';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './SignUp.module.scss';

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

  return (
    <Layout title={t('Create your FINEX account')}>
      <div className={styles.container}>
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
          <FormLayout className={styles.formLayout}>
            <FormTextField name="name" type="text" label={t('Name')} autoFocusOnEmpty={true} />
            <FormTextField name="username" type="text" label={t('E-mail')} autoFocusOnEmpty={true} />
            <FormTextField
              name="password"
              type="password"
              label={t('Password')}
              autoFocusOnEmpty={true}
              autoComplete="new-password"
              helperText={t(
                'Your password needs to be at least 8 characters. Include multiple words and phrases to make it more secure.'
              )}
            />
            <FormError />
            <FormButton type="submit" size="medium" color="primary" fullSize isIgnoreValidation={true}>
              {t('Create account')}
            </FormButton>
            <div>
              <span>{t('Already have an account?')}</span>{' '}
              <Link href="/sign-in" className={styles.footer__link}>
                {t('Sign in')}
              </Link>
            </div>
          </FormLayout>
        </Form>
      </div>
    </Layout>
  );
}

export default SignUp;
