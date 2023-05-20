import React from 'react';
import clsx from 'clsx';

import { ChevronRightIcon, Ling01Icon, LingBroken01Icon } from '@finex/ui-kit';
import { IAccount } from '../../../types/connections';
import { getT } from '../../../lib/core/i18n';

import styles from './ConnectionAccountCard.module.scss';

export interface AccountCardProps {
  account: IAccount;
  onClick: (account: IAccount) => void;
}

const t = getT('ConnectionAccountCard');

export function ConnectionAccountCard({ account: connectionAccount, onClick }: AccountCardProps): JSX.Element {
  const { providerAccountName, providerAccountProduct, account } = connectionAccount;

  const handleClick = () => {
    onClick(connectionAccount);
  };

  const isLinked = Boolean(account);

  const providerAccountFullName = `${providerAccountName} ${
    providerAccountProduct ? ` [${providerAccountProduct}]` : ''
  }`;

  return (
    <button type="button" className={clsx(styles.root, !isLinked && styles.root_notLinked)} onClick={handleClick}>
      <div className={styles.root__icon}>{isLinked ? <Ling01Icon /> : <LingBroken01Icon />}</div>
      <div className={styles.root__content}>
        <div className={styles.root__providerAccount}>{providerAccountFullName}</div>
        <div className={styles.root__linkedAccount}>{isLinked ? account!.name : t('No linked account')}</div>
      </div>
      <div className={styles.root__expandButton}>
        <ChevronRightIcon />
      </div>
    </button>
  );
}
