import React from 'react';
import clsx from 'clsx';

import { Link } from '../../components/Link/Link';
import { SignInForm } from '../../containers/SignInForm/SignInForm';
import { getT } from '../../lib/core/i18n';

import { ReactComponent as Logo } from '../../components/Icons/Logo.svg';

import styles from './Auth.module.scss';

const t = getT('Auth');

export function Auth(): JSX.Element {
  return (
    <div className={styles.page}>
      <h1 className={styles.page__header}> {t('Авторизация')} </h1>
      <div className={styles.container}>
        <div className={styles.container__logo}>
          <Logo />
        </div>

        <SignInForm />
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
}
