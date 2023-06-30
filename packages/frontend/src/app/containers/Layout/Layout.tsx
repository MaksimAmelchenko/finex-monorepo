import React from 'react';
import clsx from 'clsx';

import { Link } from '../../components/Link/Link';
import { getT } from '../../lib/core/i18n';

import { ReactComponent as Logo } from '../../icons/logo.svg';

import styles from './Layout.module.scss';

export interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

const t = getT('Layout');

export const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <div className={styles.root}>
      <div className={styles.root__content}>
        <div className={styles.root__header}>{title && <h1 className={styles.root__headerText}>{title}</h1>}</div>
        <div className={styles.root__body}>
          <div className={styles.root__logomark}>
            <Logo />
          </div>
          {children}
        </div>
        <footer className={clsx(styles.root__footer, styles.footer)}>
          <Link href="https://finex.io" className={styles.footer__link}>
            {t('Home')}
          </Link>
          |
          <Link href="mailto:support@finex.io" className={styles.footer__link}>
            {t('Support')}
          </Link>
        </footer>
      </div>
    </div>
  );
};
