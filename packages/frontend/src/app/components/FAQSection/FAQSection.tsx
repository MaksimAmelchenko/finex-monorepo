import React from 'react';

import { Button } from '@finex/ui-kit';
import { Container } from '../Container/Container';
import { FAQItem } from './FAQItem/FAQItem';
import { getT } from '../../lib/core/i18n';

import styles from './FAQSection.module.scss';

const t = getT('FAQSection');

export interface IFAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  heading: string;
  supportingText: string | React.ReactNode;
  faqItems: IFAQItem[];
}

export function FAQSection({ heading, supportingText, faqItems }: FAQSectionProps): JSX.Element {
  return (
    <section className={styles.root}>
      <Container>
        <div className={styles.root__headingAndSupportingText}>
          <h2 className={styles.root__heading}>{heading}</h2>
          <div className={styles.root__supportingText}>{supportingText}</div>
        </div>
      </Container>

      <Container>
        <div className={styles.root__faqItems}>
          {faqItems.map((item, index) => (
            <FAQItem question={item.question} answer={item.answer} key={index} />
          ))}
        </div>
      </Container>

      <Container>
        <div className={styles.getInTouch}>
          <div className={styles.getInTouch__headingAndSupportingText}>
            <h2 className={styles.getInTouch__heading}>{t('Still have questions?')}</h2>
            <div className={styles.getInTouch__supportingText}>
              {t('Can’t find the answer you’re looking for? Please chat to our friendly team.')}
            </div>
          </div>
          <div className={styles.getInTouch__actions}>
            <Button variant="primary" size="xl" href="https://t.me/finex_support">
              {t('Get in touch')}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
