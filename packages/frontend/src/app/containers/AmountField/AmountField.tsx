import React, { forwardRef, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useField, useFormikContext } from 'formik';

import { FormInlineSelect, IFormTextFieldProps } from '../../components/Form';
import { IOption, TextField } from '@finex/ui-kit';
import { MoneysRepository } from '../../stores/moneys-repository';
import { round } from '../../lib/round';
import { useStore } from '../../core/hooks/use-store';

import styles from './AmountField.module.scss';

interface MoneySelectProps {
  name: string;
  className?: string;
}

function MoneySelect({ name, className }: MoneySelectProps): JSX.Element {
  const moneysRepository = useStore(MoneysRepository);
  const [{ value }] = useField(name);

  const selectMoneysOptions = useMemo<IOption[]>(() => {
    return moneysRepository.moneys
      .filter(({ id, isEnabled }) => isEnabled || id === value)
      .map(({ id: value, symbol: label }) => ({
        value,
        label,
      }));
  }, [moneysRepository.moneys, value]);

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
    const moneysRepository = useStore(MoneysRepository);

    const moneySelect = useMemo(
      () =>
        ({ className }: { className?: string }) =>
          <MoneySelect name={moneyFieldName} className={className} />,
      [moneyFieldName]
    );

    const [amountFieldProps, meta] = useField(amountFieldName);
    const [{ value: moneyId }] = useField(moneyFieldName);

    const joinedProps = { ...props, ...amountFieldProps };

    const { setFieldValue, setFieldTouched } = useFormikContext<any>();

    const handleBlur = useCallback(() => {
      let value: string = amountFieldProps.value.trim();
      if (value) {
        value = value.replace(/[,ю]/g, '.').replace(/\s/g, '');
        try {
          // eslint-disable-next-line no-eval
          const amount: number = eval(value);
          const money = moneysRepository.get(moneyId);

          if (!isNaN(amount) && money) {
            setFieldValue(amountFieldName, String(round(amount, money.precision)));
            setFieldTouched(amountFieldName, true, false);
          }
        } catch (err) {
          /* empty */
        }
      }
    }, [amountFieldProps.value, moneysRepository, moneyId, setFieldValue, amountFieldName, setFieldTouched]);

    return <TextField {...joinedProps} error={meta.error} endAdornment={moneySelect} ref={ref} onBlur={handleBlur} />;
  }
);
