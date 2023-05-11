import React, { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers, useField, useFormikContext } from 'formik';
import { OnChangeValue } from 'react-select/dist/declarations/src/types';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { CreateMoneyData, IMoney, UpdateMoneyChanges } from '../../types/money';
import { CurrenciesRepository } from '../../stores/currency-repository';
import { Form, FormBody, FormButton, FormCheckbox, FormFooter, FormHeader, FormTextField } from '../../components/Form';
import { ISelectOption, Select } from '@finex/ui-kit';
import { Money } from '../../stores/models/money';
import { MoneysRepository } from '../../stores/moneys-repository';
import { Shape } from '../../types';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useCloseOnEscape } from '../../hooks/use-close-on-escape';
import { useStore } from '../../core/hooks/use-store';

interface MoneyFormValues {
  currencyCode: string | null;
  name: string;
  symbol: string;
  precision: string;
  isEnabled: boolean;
  sorting: string;
}

interface MoneyWindowProps {
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
    currencyCode,
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
    currencyCode,
    name,
    symbol,
    precision: precision ? Number(precision) : null,
    isEnabled,
    sorting: sorting ? Number(sorting) : null,
  };
}

export function MoneyWindow({ money, onClose }: MoneyWindowProps): JSX.Element {
  const moneysRepository = useStore(MoneysRepository);

  const { enqueueSnackbar } = useSnackbar();
  const { onCanCloseChange } = useCloseOnEscape({ onClose });

  useEffect(() => {
    analytics.view({
      page_title: 'money',
    });
  }, []);

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus();
    }
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
    [enqueueSnackbar, money, moneysRepository, onClose]
  );

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
      onDirtyChange={dirty => onCanCloseChange(!dirty)}
      name="money"
    >
      <FormHeader title={money instanceof Money ? t('Edit money') : t('Add new money')} onClose={onClose} />

      <FormBody>
        <CurrencyField />
        <FormTextField name="name" label={t('Name')} ref={nameFieldRefCallback} />
        <FormTextField name="symbol" label={t('Symbol')} helperText={t('Displayed currency sign')} />
        <FormTextField name="precision" label={t('Precision')} helperText={t('A number of symbols after comma')} />
        <FormCheckbox
          name="isEnabled"
          helperText={t('Inactive money is hidden when creating or editing a transaction')}
        >
          {t('Active')}
        </FormCheckbox>
        <FormTextField
          name="sorting"
          label={t('Sorting')}
          helperText={t('Sets the currency display order for multicurrency accounts')}
        />
      </FormBody>

      <FormFooter>
        <FormButton variant="secondaryGray" isIgnoreValidation onClick={onClose}>
          {t('Cancel')}
        </FormButton>
        <FormButton type="submit" color="primary" isIgnoreValidation>
          {t('Save')}
        </FormButton>
      </FormFooter>
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

  const [formikProps, meta] = useField<string>('currencyCode');
  const { setFieldValue, setFieldTouched } = useFormikContext<MoneyFormValues>();

  const value = meta.value === null ? null : selectCurrencyOptions.find(({ value }) => value === meta.value) || null;

  const handleChange = useCallback(
    (newValue: OnChangeValue<ISelectOption, false>) => {
      const currencyCode = newValue?.value || null;

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
    <Select<false>
      {...formikProps}
      label={t('Ordinary currency')}
      options={selectCurrencyOptions}
      value={value}
      onChange={handleChange}
    />
  );
});
