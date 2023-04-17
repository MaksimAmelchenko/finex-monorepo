import React from 'react';

import { Container } from '../../components/Container/Container';
import { CookieConsent as CookieConsentBase } from '../../components/CookieConsent/CookieConsent';

import styles from './CookieConsent.module.scss';

const googleAnalytics = {
  trackingId: process.env.NX_TRACKING_ID!,
};

export function CookieConsent(): JSX.Element | null {
  if (!googleAnalytics.trackingId) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Container>
        <CookieConsentBase googleAnalytics={googleAnalytics} />
      </Container>
    </div>
  );
}
