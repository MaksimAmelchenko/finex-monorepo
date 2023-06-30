import React from 'react';

import { ArrowRightIcon, Building02Icon, Button } from '@finex/ui-kit';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { getT } from '../../lib/core/i18n';

import styles from './NoContractor.module.scss';

const t = getT('NoContractor');

interface NoContractorProps {
  onClose: () => void;
  supportingText: React.ReactNode;
  className?: string;
}

export function NoContractor({ onClose, supportingText, className }: NoContractorProps): JSX.Element {
  return (
    <EmptyState
      illustration={<Building02Icon className={styles.root__illustration} />}
      text={t('Contractors')}
      supportingText={supportingText}
      className={className}
    >
      <Button variant="secondaryGray" size="lg" onClick={onClose}>
        {t('Close')}
      </Button>

      <Button size="lg" endIcon={<ArrowRightIcon />} href="/settings/contractors">
        {t('Go to Contractors')}
      </Button>
    </EmptyState>
  );
}
