import React from 'react';

import styles from './FAQItem.module.scss';

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps): JSX.Element {
  return (
    <article className={styles.root}>
      <div className={styles.root__content}>
        <div className={styles.root__textAndSupportingText}>
          <div className={styles.root__text}>{question}</div>
          <div className={styles.root__supportingText}>{answer}</div>
        </div>
      </div>
    </article>
  );
}
