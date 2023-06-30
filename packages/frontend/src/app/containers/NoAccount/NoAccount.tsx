import React from 'react';

import { ArrowRightIcon, Button, Wallet01Icon } from '@finex/ui-kit';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { getT } from '../../lib/core/i18n';

import styles from './NoAccount.module.scss';

const t = getT('NoAccount');

interface NoAccountProps {
  onClose: () => void;
  supportingText: React.ReactNode;
  className?: string;
}

export function NoAccount({ onClose, supportingText, className }: NoAccountProps): JSX.Element {
  return (
    <EmptyState
      illustration={<Wallet01Icon className={styles.root__illustration} />}
      text={t('Accounts')}
      supportingText={supportingText}
      className={className}
    >
      <Button variant="secondaryGray" size="lg" onClick={onClose}>
        {t('Close')}
      </Button>

      <Button size="lg" endIcon={<ArrowRightIcon />} href="/settings/accounts">
        {t('Go to Accounts')}
      </Button>
    </EmptyState>
  );
}
