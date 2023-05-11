import React, { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers, useField, useFormikContext } from 'formik';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { BackButton, DeleteButton, Header } from '../../components/Header/Header';
import { CreateMoneyData, IMoney, UpdateMoneyChanges } from '../../types/money';
import { CurrenciesRepository } from '../../stores/currency-repository';
import { Form, FormBody, FormButton, FormCheckbox, FormInput } from '../../components/Form';
import { ISelectOption, Select, SelectNative } from '@finex/ui-kit';
import { Money } from '../../stores/models/money';
import { MoneysRepository } from '../../stores/moneys-repository';
import { Shape } from '../../types';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './MoneyWindowMobile.module.scss';

interface MoneyFormValues {
  currencyCode: string;
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
  currencyCode,
  name,
  symbol,
  precision,
  isEnabled,
  sorting,
}: MoneyFormValues): CreateMoneyData {
  return {
    currencyCode: currencyCode ? currencyCode : null,
    name,
    symbol,
    precision: precision ? Number(precision) : null,
    isEnabled,
    sorting: sorting ? Number(sorting) : null,
  };
}

function mapValuesToUpdatePayload({
  currencyCode,
  name,
  symbol,
  precision,
  isEnabled,
  sorting,
}: MoneyFormValues): CreateMoneyData {
  return {
    currencyCode: currencyCode ? currencyCode : null,
    name,
    symbol,
    precision: precision ? Number(precision) : null,
    isEnabled,
    sorting: sorting ? Number(sorting) : null,
  };
}

export function MoneyWindowMobile({ money, onClose }: MoneyWindowMobileProps): JSX.Element {
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

  const { currencyCode, name, symbol, precision, isEnabled, sorting } = money;

  return (
    <Form<MoneyFormValues>
      onSubmit={onSubmit}
      initialValues={{
        name: name ?? '',
        symbol: symbol ?? '',
        precision: precision ? String(precision) : '',
        currencyCode: currencyCode ?? '',
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
        <CurrencyField />
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

const CurrencyField = observer(() => {
  const currenciesRepository = useStore(CurrenciesRepository);

  useEffect(() => {
    if (!currenciesRepository.currencies.length) {
      currenciesRepository.getCurrencies();
    }
  }, [currenciesRepository]);

  const selectCurrencyOptions = useMemo<ISelectOption[]>(() => {
    return [
      { value: '', label: t('Select currency') },
      ...currenciesRepository.currencies.map(({ code, name }) => ({ value: code, label: `${name} [${code}]` })),
    ];
  }, [currenciesRepository.currencies]);

  const [formikProps] = useField<string>('currencyCode');
  const { setFieldValue, setFieldTouched } = useFormikContext<MoneyFormValues>();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const currencyCode = e.target.value;

      setFieldValue('currencyCode', currencyCode);
      setFieldTouched('currencyCode', true, false);

      // if currency has changed, reset other fields
      if (currencyCode) {
        const currency = currenciesRepository.get(currencyCode);
        if (currency) {
          setFieldValue('name', currency.name);
          setFieldTouched('name', true, false);

          setFieldValue('symbol', currency.symbol);
          setFieldTouched('symbol', true, false);

          setFieldValue('precision', String(currency.precision));
          setFieldTouched('precision', true, false);
        }
      }
    },
    [currenciesRepository, setFieldValue, setFieldTouched]
  );

  return (
    <SelectNative
      {...formikProps}
      label={t('Standard currency')}
      options={selectCurrencyOptions}
      onChange={handleChange}
    />
  );
});
