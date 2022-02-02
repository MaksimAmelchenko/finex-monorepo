import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import { ApiErrors, CoreError } from '../../core/errors';
import { AuthRepository } from '../../core/other-stores/auth-repository';
import { CoreErrorConstructor, ErrorTranslation, translateErrorToHR } from '../../core/errors-translation';
import { Layout } from '../../containers/Layout/Layout';
import { Link } from '../../components/Link/Link';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './SignUpConfirmation.module.scss';

const t = getT('SignUpConfirmation');

const errorsHR: [CoreErrorConstructor, ErrorTranslation][] = [
  [ApiErrors.Expired, t('The email has already been confirmed')],
  [ApiErrors.NotFound, t('Sign Up request not found')],
  [ApiErrors.ConflictError, t('This email already registered')],
];

export function SignUpConfirmation(): JSX.Element {
  const authStore = useStore(AuthRepository);
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [error, setError] = useState<CoreError | null>(null);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      authStore
        .signUpConfirmation(token)
        .then(() => {
          setStatus('success');
        })
        .catch(error => {
          setStatus('error');
          setError(error);
        });
    }
  }, [token, authStore]);

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <Layout title={t('Email confirmation')}>
      <div className={styles.container}>
        {status === 'pending' && <p>{t('Processing...')}</p>}
        {status === 'success' && (
          <>
            <p>{t('You email has been confirmed.')}</p>
            <Link href="/">{t('Start to use')}</Link>
          </>
        )}
        {status === 'error' && <p>{translateErrorToHR(error, errorsHR)}</p>}
      </div>
    </Layout>
  );
}

export default SignUpConfirmation;
