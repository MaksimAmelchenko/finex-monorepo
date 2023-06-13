import React from 'react';

import { Container } from '../../components/Container/Container';
import { CookieConsent as CookieConsentBase, CookieConsentProps } from '../../components/CookieConsent/CookieConsent';

import styles from './CookieConsent.module.scss';

export function CookieConsent(props: CookieConsentProps): JSX.Element | null {
  return (
    <div className={styles.root}>
      <Container>
        <CookieConsentBase {...props} />
      </Container>
    </div>
  );
}
