import React, { useCallback, useMemo, useRef } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { CreateMoneyData, IMoney, UpdateMoneyChanges } from '../../types/money';
import { CurrenciesRepository } from '../../stores/currency-repository';
import { Drawer } from '../../components/Drawer/Drawer';
import { DrawerFooter } from '../../components/Drawer/DrawerFooter';
import { Form, FormButton, FormCheckbox, FormLayout, FormTextField } from '../../components/Form';
import { FormSelect } from '../../components/Form/FormSelect/FormSelect';
import { ISelectOption } from '@finex/ui-kit';
import { Money } from '../../stores/models/money';
import { MoneysRepository } from '../../stores/moneys-repository';
import { Shape } from '../../types';
import { getPatch } from '../../lib/core/get-path';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './MoneyWindow.module.scss';

interface MoneyFormValues {
  currencyId: string | null;
  name: string;
  symbol: string;
  precision: string;
  isEnabled: boolean;
  sorting: string;
}

interface MoneyWindowProps {
  isOpened: boolean;
  money: Partial<IMoney> | Money;
  onClose: () => unknown;
}

const t = getT('MoneyWindow');

function mapValuesToCreatePayload({
  currencyId,
  name,
  symbol,
  precision,
  isEnabled,
  sorting,
}: MoneyFormValues): CreateMoneyData {
  return {
    currencyId,
    name,
    symbol,
    precision: precision ? Number(precision) : null,
    isEnabled,
    sorting: sorting ? Number(sorting) : null,
  };
}

function mapValuesToUpdatePayload({
  currencyId,
  name,
  symbol,
  precision,
  isEnabled,
  sorting,
}: MoneyFormValues): CreateMoneyData {
  return {
    currencyId,
    name,
    symbol,
    precision: precision ? Number(precision) : null,
    isEnabled,
    sorting: sorting ? Number(sorting) : null,
  };
}

export function MoneyWindow({ isOpened, money, onClose }: MoneyWindowProps): JSX.Element {
  const currenciesRepository = useStore(CurrenciesRepository);
  const moneysRepository = useStore(MoneysRepository);

  const { enqueueSnackbar } = useSnackbar();

  const nameFieldRef = useRef<HTMLInputElement | null>(null);

  const handleOnOpen = useCallback(() => {
    nameFieldRef.current?.focus();
  }, []);

  const onSubmit = useCallback(
    (values: MoneyFormValues, _: FormikHelpers<MoneyFormValues>, initialValues: MoneyFormValues) => {
      let result: Promise<unknown>;
      if (money instanceof Money) {
        const changes: UpdateMoneyChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = moneysRepository.updateMoney(money, changes);
      } else {
        const data: CreateMoneyData = mapValuesToCreatePayload(values);
        result = moneysRepository.createMoney(money, data);
      }

      return result
        .then(() => {
          onClose();
        })
        .catch(err => {
          let message: string = '';
          switch (err.code) {
            case 'money_id_project_name_u':
              message = t('Money already exists');
              break;
            case 'cashflow_detail_2_money':
              message = t("You can't delete money with transaction");
              break;
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [moneysRepository, onClose, money]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<MoneyFormValues>>({
        name: Yup.string().required('Please fill name'),
        precision: Yup.mixed().test('precision', t('Please enter a number'), value => !value || !isNaN(value)),
        sorting: Yup.mixed().test('sorting', t('Please enter a number'), value => !value || !isNaN(value)),
      }),
    []
  );

  const selectCurrencyOptions = useMemo<ISelectOption[]>(() => {
    return currenciesRepository.currencies.map(({ id: value, name: label }) => ({ value, label }));
  }, [currenciesRepository.currencies]);

  const { currency, name, symbol, precision, isEnabled, sorting } = money;

  return (
    <Drawer
      isOpened={isOpened}
      title={money instanceof Money ? t('Edit money') : t('Add new money')}
      onClose={onClose}
      onOpen={handleOnOpen}
    >
      <Form<MoneyFormValues>
        onSubmit={onSubmit}
        initialValues={{
          name: name ?? '',
          symbol: symbol ?? '',
          precision: precision ? String(precision) : '',
          currencyId: currency?.id ?? null,
          isEnabled: isEnabled ?? true,
          sorting: sorting ? String(sorting) : '',
        }}
        validationSchema={validationSchema}
        className={styles.form}
      >
        <div className={styles.form__bodyWrapper}>
          <FormLayout className={styles.form__body}>
            <FormSelect
              name="currencyId"
              isClearable
              label={t('Ordinary currency')}
              options={selectCurrencyOptions}
              // tabIndex={2}
            />
            <FormTextField name="name" label={t('Name')} ref={nameFieldRef} />
            <FormTextField name="symbol" label={t('Symbol')} helperText={t('Displayed currency sign')} />
            <FormTextField
              name="precision"
              // type="number"
              label={t('Precision')}
              helperText={t('A number of symbols after comma')}
            />
            <FormCheckbox
              name="isEnabled"
              label={t('Active')}
              helperText={t('Inactive money is hidden when creating or editing a transaction')}
            />
            <FormTextField name="sorting" label={t('Sorting')} />
          </FormLayout>
        </div>
        <DrawerFooter className={styles.footer}>
          <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
            {t('Cancel')}
          </FormButton>
          <FormButton type="submit" color="secondary" isIgnoreValidation>
            {t('Save')}
          </FormButton>
        </DrawerFooter>
      </Form>
    </Drawer>
  );
}
