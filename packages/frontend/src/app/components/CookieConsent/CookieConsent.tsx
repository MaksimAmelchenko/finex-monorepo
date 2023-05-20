import React, { useEffect, useState } from 'react';

import { Button } from '@finex/ui-kit';
import { Link } from '../Link/Link';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';

import { ReactComponent as Flag05Icon } from '../../icons/flag-05.svg';

import styles from './CookieConsent.module.scss';

export interface CookieConsentProps {
  googleAnalytics: {
    trackingId: string;
  };
}

const t = getT('CookieConsent');

export function CookieConsent({ googleAnalytics }: CookieConsentProps): JSX.Element | null {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consentCookie = localStorage.getItem('gdpr_cookie_consent');
    if (!consentCookie) {
      setShow(true);
    } else {
      if (consentCookie === 'accepted') {
        analytics.initializeAndTrack({ trackingId: googleAnalytics.trackingId });
      }
    }
  }, [googleAnalytics.trackingId]);

  const handleAcceptCookies = () => {
    localStorage.setItem('gdpr_cookie_consent', 'accepted');
    analytics.initializeAndTrack({ trackingId: googleAnalytics.trackingId });
    setShow(false);
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('gdpr_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.root__content}>
        <div className={styles.root__info}>
          <div className={styles.root__featuredFlag}>
            <Flag05Icon />
          </div>
          <div className={styles.root__textAndSupportingText}>
            <div className={styles.root__text}>{t('We use cookies to improve your experience and for marketing.')}</div>
            <div className={styles.root__supportingText}>
              {t('Learn more in our ')}
              <Link href="https://finex.io/legal/cookies-policy/" className={styles.root__supportingTextLink}>
                {t('Cookie Policy')}
              </Link>
              {'.'}
            </div>
          </div>
        </div>
        <div className={styles.root__actions}>
          <Button size="lg" variant="secondaryGray" className={styles.root__button} onClick={handleDeclineCookies}>
            {t('Decline')}
          </Button>
          <Button size="lg" variant="secondaryColor" className={styles.root__button} onClick={handleAcceptCookies}>
            {t('Allow')}
          </Button>
        </div>
      </div>
    </div>
  );
}
