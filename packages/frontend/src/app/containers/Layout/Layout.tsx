import React, { FC } from 'react';
import clsx from 'clsx';

import { Link } from '../../components/Link/Link';
import { getT } from '../../lib/core/i18n';

import { ReactComponent as Logo } from '../../components/Icons/Logo.svg';

import styles from './Layout.module.scss';

export interface LayoutProps {
  title?: string;
}

const t = getT('Layout');

export const Layout: FC<LayoutProps> = ({ title, children }) => {
  return (
    <div className={styles.page}>
      {title && <h1 className={styles.page__header}> {title} </h1>}
      <div className={styles.page__body}>
        <div className={styles.page__logo}>
          <Logo />
        </div>

        {children}
      </div>
      <footer className={clsx(styles.page__footer, styles.footer)}>
        <Link href="https://finex.io" className={styles.footer__link}>
          {t('На главную')}
        </Link>
        |
        <Link href="mailto:support@finex.io" className={styles.footer__link}>
          {t('Поддержка')}
        </Link>
      </footer>
    </div>
  );
};
