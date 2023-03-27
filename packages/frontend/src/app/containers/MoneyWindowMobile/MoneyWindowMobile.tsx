import React, { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { BackButton, DeleteButton, Header } from '../../components/Header/Header';
import { CreateMoneyData, IMoney, UpdateMoneyChanges } from '../../types/money';
import { CurrenciesRepository } from '../../stores/currency-repository';
import { Form, FormBody, FormButton, FormCheckbox, FormInput } from '../../components/Form';
import { FormSelectNative } from '../../components/Form/FormSelectNative/FormSelectNative';
import { ISelectOption } from '@finex/ui-kit';
import { Money } from '../../stores/models/money';
import { MoneysRepository } from '../../stores/moneys-repository';
import { Shape } from '../../types';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './MoneyWindowMobile.module.scss';

interface MoneyFormValues {
  currencyId: string;
  name: string;
  symbol: string;
  precision: string;
  isEnabled: boolean;
  sorting: string;
}

interface MoneyWindowMobileProps {
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
    currencyId: currencyId ? currencyId : null,
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
    currencyId: currencyId ? currencyId : null,
    name,
    symbol,
    precision: precision ? Number(precision) : null,
    isEnabled,
    sorting: sorting ? Number(sorting) : null,
  };
}

export function MoneyWindowMobile({ money, onClose }: MoneyWindowMobileProps): JSX.Element {
  const currenciesRepository = useStore(CurrenciesRepository);
  const moneysRepository = useStore(MoneysRepository);

  const { enqueueSnackbar } = useSnackbar();

  const isNew = !(money instanceof Money);

  useEffect(() => {
    analytics.view({
      page_title: 'money-mobile',
    });
  }, []);

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      // node.focus();
      requestAnimationFrame(() => node.focus());
    }
  }, []);

  const onSubmit = useCallback(
    (values: MoneyFormValues, _: FormikHelpers<MoneyFormValues>, initialValues: MoneyFormValues) => {
      let result: Promise<unknown>;
      if (isNew) {
        const data: CreateMoneyData = mapValuesToCreatePayload(values);
        result = moneysRepository.createMoney(money, data);
      } else {
        const changes: UpdateMoneyChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = moneysRepository.updateMoney(money, changes);
      }

      return result
        .then(() => {
          onClose();
        })
        .catch(err => {
          let message = '';
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
    [enqueueSnackbar, isNew, money, moneysRepository, onClose]
  );

  const handleDeleteClick = () => {
    moneysRepository
      .deleteMoney(money as Money)
      .then(() => {
        onClose();
      })
      .catch(err => {
        let message = '';
        switch (err.code) {
          case 'cashflow_detail_2_money': {
            message = t('There are transactions with this money');
            break;
          }
          default:
            message = err.message;
        }
        enqueueSnackbar(message, { variant: 'error' });
      });
  };
  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<MoneyFormValues>>({
        name: Yup.string().required(t('Please fill name')),
        precision: Yup.mixed().test('precision', t('Please enter a number'), value => !value || !isNaN(value)),
        sorting: Yup.mixed().test('sorting', t('Please enter a number'), value => !value || !isNaN(value)),
      }),
    []
  );

  const selectCurrencyOptions = useMemo<ISelectOption[]>(() => {
    return [
      { value: '', label: t('Standard currency not specified') },
      ...currenciesRepository.currencies.map(({ id: value, name: label }) => ({ value, label })),
    ];
  }, [currenciesRepository.currencies]);

  const { currency, name, symbol, precision, isEnabled, sorting } = money;

  return (
    <Form<MoneyFormValues>
      onSubmit={onSubmit}
      initialValues={{
        name: name ?? '',
        symbol: symbol ?? '',
        precision: precision ? String(precision) : '',
        currencyId: currency?.id ?? '',
        isEnabled: isEnabled ?? true,
        sorting: sorting ? String(sorting) : '',
      }}
      validationSchema={validationSchema}
      name="money-mobile"
    >
      <Header
        title={isNew ? t('Add new money') : t('Edit money')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={!isNew && <DeleteButton onClick={handleDeleteClick} />}
      />

      <FormBody className={styles.main}>
        <FormSelectNative name="currencyId" label={t('Ordinary currency')} options={selectCurrencyOptions} />
        <FormInput name="name" label={t('Name')} ref={nameFieldRefCallback} />
        <FormInput name="symbol" label={t('Symbol')} helperText={t('Displayed currency sign')} />
        <FormInput
          name="precision"
          label={t('Precision')}
          inputMode="decimal"
          helperText={t('A number of symbols after comma')}
        />
        <FormCheckbox
          name="isEnabled"
          helperText={t('Inactive money is hidden when creating or editing a transaction')}
        >
          {t('Active')}
        </FormCheckbox>
        <FormInput
          name="sorting"
          label={t('Sorting')}
          inputMode="decimal"
          helperText={t('Sets the currency display order for multicurrency accounts')}
        />
      </FormBody>

      <footer className={styles.footer}>
        <FormButton type="submit" color="primary" isIgnoreValidation>
          {t('Save')}
        </FormButton>
      </footer>
    </Form>
  );
}
