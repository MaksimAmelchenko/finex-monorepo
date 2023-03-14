import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { useField, useFormikContext } from 'formik';

import { Dropdown, Input } from '@finex/ui-kit';
import { IFormInputProps } from '../../components/Form';
import { Money } from '../../stores/models/money';
import { MoneysMobile } from '../MoneysMobile/MoneysMobile_';
import { MoneysRepository } from '../../stores/moneys-repository';
import { round } from '../../lib/round';
import { useStore } from '../../core/hooks/use-store';

interface AmountFieldProps extends Omit<IFormInputProps, 'name' | 'endAdornment'> {
  amountFieldName: string;
  moneyFieldName: string;
}

export const AmountField = forwardRef<HTMLInputElement, Omit<AmountFieldProps, 'name' | 'endAdornment'>>(
  ({ amountFieldName, moneyFieldName, ...props }, ref) => {
    const moneysRepository = useStore(MoneysRepository);

    const [openMoneys, setOpenMoneys] = useState<boolean>(false);

    const { setFieldValue, setFieldTouched } = useFormikContext<any>();
    const [amountFieldProps, meta] = useField(amountFieldName);
    const [{ value: moneyId }] = useField(moneyFieldName);

    const money = useMemo(() => moneysRepository.get(moneyId), [moneyId]);

    const handleBlur = useCallback(() => {
      let value: string = amountFieldProps.value.trim();
      if (value) {
        value = value.replace(/[,ю]/g, '.').replace(/\s/g, '');
        try {
          const amount: number = eval(value);

          if (!isNaN(amount) && money) {
            setFieldValue(amountFieldName, String(round(amount, money.precision)));
            setFieldTouched(amountFieldName, true, false);
          }
        } catch (err) {}
      }
    }, [amountFieldName, setFieldValue, setFieldTouched, meta.value]);

    const handleMoneyDropdownClick = useCallback(() => {
      setOpenMoneys(true);
    }, []);

    const handleMoneySelect = useCallback(
      (money: Money) => {
        setFieldValue(moneyFieldName, money.id);
        setFieldTouched(moneyFieldName, true, false);
        setOpenMoneys(false);
      },
      [moneyFieldName]
    );

    const handleMoneysClose = useCallback(() => {
      setOpenMoneys(false);
    }, []);

    const joinedProps = { ...props, ...amountFieldProps };

    return (
      <>
        <Input
          {...joinedProps}
          // type="text"
          // pattern="\d*"
          inputMode="decimal"
          errorText={meta.error}
          endAdornment={<Dropdown text={money?.symbol || ''} onClick={handleMoneyDropdownClick} />}
          ref={ref}
          onBlur={handleBlur}
        />

        <MoneysMobile open={openMoneys} onSelect={handleMoneySelect} onClose={handleMoneysClose} />
      </>
    );
  }
);
