import React from 'react';

import { ArrowRightIcon, Button, Coins02Icon } from '@finex/ui-kit';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { getT } from '../../lib/core/i18n';

import styles from './NoMoney.module.scss';

const t = getT('NoMoney');

interface NoMoneyProps {
  onClose: () => void;
  supportingText: React.ReactNode;
  className?: string;
}

export function NoMoney({ onClose, supportingText, className }: NoMoneyProps): JSX.Element {
  return (
    <EmptyState
      illustration={<Coins02Icon className={styles.root__illustration} />}
      text={t('Moneys')}
      supportingText={supportingText}
      className={className}
    >
      <Button variant="secondaryGray" size="lg" onClick={onClose}>
        {t('Close')}
      </Button>

      <Button size="lg" endIcon={<ArrowRightIcon />} href="/settings/moneys">
        {t('Go to Moneys')}
      </Button>
    </EmptyState>
  );
}
