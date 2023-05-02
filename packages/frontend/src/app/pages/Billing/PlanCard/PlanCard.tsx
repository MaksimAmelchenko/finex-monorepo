import React from 'react';
import clsx from 'clsx';

import { Plan } from '../../../types/billing';
import { getT, toCurrency } from '../../../lib/core/i18n';

import styles from './PlanCard.module.scss';

interface PlanCardProps {
  plan: Plan;
  children: React.ReactNode;
  className?: string;
}

const t = getT('Plan');

const currencySymbolMap: Record<string, string> = {
  RUB: '₽',
  EUR: '&euro;',
};

export function PlanCard({ plan, children, className }: PlanCardProps): JSX.Element {
  const { name, description, price, currency } = plan;

  return (
    <div className={clsx(styles.root, className)}>
      <h2 className={styles.root__header}>{name}</h2>
      <div className={styles.root__description} dangerouslySetInnerHTML={{ __html: description || '&nbsp;' }} />
      <div className={clsx(styles.root__price, styles.price)}>
        <span className={styles.price__number}>{toCurrency(price!, {precision: 2})}</span>
        <span className={styles.price__currency} dangerouslySetInnerHTML={{ __html: currencySymbolMap[currency!] }} />
      </div>
      <div className={styles.root__cancelText}>{t('Plan automatically renews until canceled')}</div>
      <div className={styles.root__buttons}>{children}</div>
    </div>
  );
}
