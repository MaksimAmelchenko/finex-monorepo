import React, { forwardRef, useMemo } from 'react';
import clsx from 'clsx';

import { FormInlineSelect, FormTextField, IFormTextFieldProps } from '../../components/Form';
import { IOption } from '@finex/ui-kit';
import { MoneysRepository } from '../../stores/moneys-repository';
import { useStore } from '../../core/hooks/use-store';

import styles from './AmountField.module.scss';

interface MoneySelectProps {
  name: string;
  className?: string;
}

function MoneySelect({ name, className }: MoneySelectProps): JSX.Element {
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
    <div className={clsx(styles.moneySelect, className)}>
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
    const moneySelect = useMemo(
      () =>
        ({ className }: { className?: string }) =>
          <MoneySelect name={moneyFieldName} className={className} />,
      [moneyFieldName]
    );

    return <FormTextField {...props} name={amountFieldName} endAdornment={moneySelect} ref={ref} />;
  }
);
