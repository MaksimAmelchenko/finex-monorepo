import React from 'react';
import { observer } from 'mobx-react-lite';

import { BillingContent } from '../../containers/BillingContent/BillingContent';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';
import { getT } from '../../lib/core/i18n';

import styles from './Billing.module.scss';

const t = getT('Billing');

export const Billing = observer(() => {
  return (
    <div className={styles.root}>
      <HeaderLayout title={t('Billing settings')} className={styles.root__header} />
      <main className={styles.root__content}>
        <BillingContent />
      </main>
    </div>
  );
});

export default Billing;
