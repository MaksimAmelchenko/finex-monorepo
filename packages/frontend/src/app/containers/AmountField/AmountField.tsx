import React, { forwardRef, useMemo } from 'react';

import { FormInlineSelect, FormTextField, IFormTextFieldProps } from '../../components/Form';
import { IOption } from '@finex/ui-kit';
import { MoneysRepository } from '../../stores/moneys-repository';
import { useStore } from '../../core/hooks/use-store';

import styles from './AmountField.module.scss';

function MoneySelect({ name }: { name: string }): JSX.Element {
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
      <FormInlineSelect name={name} options={selectMoneysOptions} className={styles.moneySelect__target} />
    </div>
  );
}

interface AmountFieldProps extends IFormTextFieldProps {
  amountFieldName: string;
  moneyFieldName: string;
}

export const AmountField = forwardRef<HTMLInputElement, Omit<AmountFieldProps, 'name' | 'endAdornment'>>(
  ({ amountFieldName, moneyFieldName, ...props }, ref) => {
    return (
      <FormTextField
        {...props}
        name={amountFieldName}
        endAdornment={() => <MoneySelect name={moneyFieldName} />}
        ref={ref}
      />
    );
  }
);
