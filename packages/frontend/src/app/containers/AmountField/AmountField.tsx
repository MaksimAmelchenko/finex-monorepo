import React, { forwardRef, useMemo } from 'react';

import { FormInlineSelect, FormTextField, IFormTextFieldProps } from '../../components/Form';
import { IOption } from '@finex/ui-kit';
import { MoneysRepository } from '../../stores/moneys-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './AmountField.module.scss';

const t = getT('AmountField');

function MoneySelect(): JSX.Element {
  const moneysRepository = useStore(MoneysRepository);

  const selectMoneysOptions = useMemo<IOption[]>(() => {
    return moneysRepository.moneys
      .filter(({ isEnabled }) => isEnabled)
      .map(({ id: value, symbol: label }) => ({
        value,
        label,
      }));
  }, [moneysRepository.moneys]);

  return (
    <div className={styles.moneySelect}>
      <div className={styles.moneySelect__delimiter} />
      <FormInlineSelect name="moneyId" options={selectMoneysOptions} className={styles.moneySelect__target} />
    </div>
  );
}

export const AmountField = forwardRef<HTMLInputElement, Omit<IFormTextFieldProps, 'name' | 'label' | 'endAdornment'>>(
  (props, ref) => {
    return <FormTextField {...props} name="amount" label={t('Amount')} endAdornment={MoneySelect} ref={ref} />;
  }
);
