import React, { useState } from 'react';

import { Button, ShieldTickIcon } from '@finex/ui-kit';
import { CheckboxGroupItem } from '../CheckboxGroupItem/CheckboxGroupItem';
import { getT } from '../../lib/core/i18n';

import styles from './CookieConsent.module.scss';

type ConsentType =
  | 'ad_storage'
  | 'analytics_storage'
  | 'personalization_storage'
  | 'functionality_storage'
  | 'security_storage';

export interface CookieConsentProps {
  consentTypes: ConsentType[];
  showOptions?: boolean;
  onClose: () => void;
}

const t = getT('CookieConsent');
export function CookieConsent(props: CookieConsentProps): JSX.Element | null {
  const { consentTypes, onClose } = props;

  const consentTypesI18n: Record<ConsentType, { title: string; description: string }> = {
    ad_storage: {
      title: t('Marketing'),
      description: t(
        "This allows us to measure the effectiveness of our advertising efforts. By enabling this, you'll help us understand which ads are engaging and useful to our audience."
      ),
    },
    analytics_storage: {
      title: t('Analytics'),
      description: t(
        'We use this to understand how our visitors interact with our website. It helps us understand which pages are popular, how much time you spend on the site, and more. This information is used to improve your user experience.'
      ),
    },
    personalization_storage: {
      title: t('Personalized User Experience'),
      description: t(
        'This helps us to personalize your experience on our website. It enables features like remembering your preferences and settings, so you have a smoother, tailored experience each time you visit.'
      ),
    },
    functionality_storage: {
      title: t('Functionality'),
      description: t(
        'These cookies are essential for the basic functions of our website, such as navigation, accessing secure areas, and more. Without these cookies, our website may not function correctly.'
      ),
    },
    security_storage: {
      title: t('Security Features'),
      description: t(
        'These cookies are important for the security of our website and our users. They help us to detect malicious activity and violations of our terms of use.'
      ),
    },
  };

  const [showOptions, setShowOptions] = useState(props.showOptions ?? false);

  const initialConsentMode: Record<ConsentType, 'denied' | 'granted'> = {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'denied',
  };

  if (localStorage.getItem('consentMode') !== null) {
    try {
      const consentMode: Record<ConsentType, 'denied' | 'granted'> = JSON.parse(localStorage.getItem('consentMode')!);
      (
        [
          'ad_storage',
          'analytics_storage',
          'functionality_storage',
          'personalization_storage',
          'security_storage',
        ] as ConsentType[]
      ).forEach(consentType => {
        if (['granted', 'denied'].includes(consentMode[consentType])) {
          initialConsentMode[consentType] = consentMode[consentType];
        }
      });
    } catch (e) {
      console.log('Error parsing consentMode from localStorage', e);
    }
  }

  const [consentMode, setConsentMode] = useState<Record<ConsentType, 'denied' | 'granted'>>(initialConsentMode);

  const handleAcceptAllClick = () => {
    const consent = {
      ...consentMode,
      ...consentTypes.reduce<any>((acc, contentType) => {
        acc[contentType] = 'granted';
        return acc;
      }, {}),
    };

    window.gtag('consent', 'update', consent);
    window.gtag('event', 'consent-update');
    localStorage.setItem('consentMode', JSON.stringify(consent));
    onClose();
  };

  const handleRejectAllClick = () => {
    const consent = {
      ...consentMode,
      ...consentTypes.reduce<any>((acc, contentType) => {
        acc[contentType] = 'denied';
        return acc;
      }, {}),
    };

    window.gtag('consent', 'update', consent);
    window.gtag('event', 'consent-update');
    localStorage.setItem('consentMode', JSON.stringify(consent));
    onClose();
  };

  const handleAcceptSelectionClick = () => {
    window.gtag('consent', 'update', consentMode);
    window.gtag('event', 'consent-update');
    localStorage.setItem('consentMode', JSON.stringify(consentMode));
    onClose();
  };

  const handleMoreOptionsClick = () => {
    setShowOptions(true);
  };

  const handleChange = (consentType: ConsentType) => (value: boolean) => {
    setConsentMode(prev => ({
      ...prev,
      [consentType]: value ? 'granted' : 'denied',
    }));
  };

  return (
    <div className={styles.root}>
      <div className={styles.root__content}>
        <div className={styles.root__info}>
          <div className={styles.root__featuredFlag}>
            <ShieldTickIcon />
          </div>
          <div className={styles.root__textAndSupportingText}>
            <div className={styles.root__text}>{t('We use cookies to improve your experience and for marketing.')}</div>
            <div className={styles.root__supportingText}>
              {t('Learn more in our ')}
              <a
                href="/legal/cookies-policy/"
                target="_blank"
                rel="nofollow"
                className={styles.root__supportingTextLink}
              >
                {t('Cookie Policy')}
              </a>
              {'.'}
            </div>
          </div>
        </div>
        <div className={styles.root__actions}>
          {showOptions ? (
            <Button
              size="lg"
              variant="secondaryGray"
              className={styles.root__button}
              onClick={handleAcceptSelectionClick}
            >
              {t('Save and continue')}
            </Button>
          ) : (
            <Button size="lg" variant="secondaryGray" className={styles.root__button} onClick={handleMoreOptionsClick}>
              {t('Learn more and customize')}
            </Button>
          )}
          <Button size="lg" variant="secondaryColor" className={styles.root__button} onClick={handleRejectAllClick}>
            {t('Reject all')}
          </Button>
          <Button size="lg" variant="secondaryColor" className={styles.root__button} onClick={handleAcceptAllClick}>
            {t('Accept all')}
          </Button>
        </div>
      </div>

      {showOptions && (
        <div className={styles.root__options}>
          {consentTypes.map(contentType => {
            const { title, description } = consentTypesI18n[contentType];
            const selected = consentMode[contentType] === 'granted';
            return (
              <CheckboxGroupItem
                key={contentType}
                title={title}
                description={description}
                onChange={handleChange(contentType)}
                selected={selected}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
