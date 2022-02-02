import React from 'react';

import { Button } from '@fnx/ui-kit';
import { Layout } from '../../../containers/Layout/Layout';
import { getT } from '../../../lib/core/i18n';

import styles from './ResetPasswordConfirmationAcknowledgment.module.scss';

const t = getT('ResetPasswordConfirmationAcknowledgment');

export function ResetPasswordConfirmationAcknowledgment(): JSX.Element {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.container__text}>{t('The password has been reset')}</div>
        <Button color="blue" href="/sign-in" className={styles.container__signInBtn}>
          {t('Sign In')}
        </Button>
      </div>
    </Layout>
  );
}
