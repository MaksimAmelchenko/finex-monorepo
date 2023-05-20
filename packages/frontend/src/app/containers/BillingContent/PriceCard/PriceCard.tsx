import React from 'react';
import clsx from 'clsx';

import { ReactComponent as HandDrawnArrow36Icon } from '../../../icons/hand-drawn-arrow-36.svg';
import { getT } from '../../../lib/core/i18n';

import styles from './PriceCard.module.scss';

interface PriceCardProps {
  title: string;
  description: string;
  price: string;
  isPopular?: boolean;
  className?: string;
  children: React.ReactNode;
}
const t = getT('PriceCard');
export function PriceCard({
  title,
  description,
  price,
  isPopular = false,
  children,
  className,
}: PriceCardProps): JSX.Element {
  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.root__header}>
        <h3 className={styles.root__price} dangerouslySetInnerHTML={{ __html: price }} />
        <div className={styles.root__headingAndSupportingText}>
          <div className={styles.root__heading}>{title}</div>
          <div className={styles.root__supportingText} dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        {isPopular && <CallOut className={styles.root__callOut} />}
      </div>
      {/*<div className={styles.root__content}></div>*/}
      <div className={styles.root__footer}>
        <div className={styles.root__actions}>{children}</div>
      </div>
    </div>
  );
}

interface CallOutProps {
  className?: string;
}
function CallOut({ className }: CallOutProps): JSX.Element {
  return (
    <div className={clsx(styles.callOut, className)}>
      <HandDrawnArrow36Icon strokeWidth={3} className={styles.callOut__icon} />
      <div className={styles.callOut__text}>{t('Most popular!')}</div>
    </div>
  );
}
