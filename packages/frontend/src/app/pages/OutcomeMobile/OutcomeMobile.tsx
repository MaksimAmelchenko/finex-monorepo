import React from 'react';
import { observer } from 'mobx-react-lite';

import { AccountBalances } from './AccountBalances/AccountBalances';
import { DebtBalances } from './DebtBalances/DebtBalances';
import { getT } from '../../lib/core/i18n';

import styles from './OutcomeMobile.module.scss';

const t = getT('OutcomeMobile');

export const OutcomeMobile = observer(() => {
  return (
    <div className={styles.root}>
      <AccountBalances />
      <DebtBalances />
    </div>
  );
});

export default OutcomeMobile;
