import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { CreateMoneyData, IMoney, UpdateMoneyChanges } from '../../types/money';
import { CurrenciesRepository } from '../../stores/currency-repository';
import {
  Form,
  FormBody,
  FormButton,
  FormCheckbox,
  FormFooter,
  FormHeader,
  FormSelect,
  FormTextField,
} from '../../components/Form';
import { ISelectOption } from '@finex/ui-kit';
import { Money } from '../../stores/models/money';
import { MoneysRepository } from '../../stores/moneys-repository';
import { Shape } from '../../types';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

interface MoneyFormValues {
  currencyId: string | null;
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

export function MoneyWindow({ money, onClose }: MoneyWindowProps): JSX.Element {
  const currenciesRepository = useStore(CurrenciesRepository);
  const moneysRepository = useStore(MoneysRepository);

  const { enqueueSnackbar } = useSnackbar();

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

  const selectCurrencyOptions = useMemo<ISelectOption[]>(() => {
    return currenciesRepository.currencies.map(({ id: value, name: label }) => ({ value, label }));
  }, [currenciesRepository.currencies]);

  const { currency, name, symbol, precision, isEnabled, sorting } = money;

  return (
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
    >
      <FormHeader title={money instanceof Money ? t('Edit money') : t('Add new money')} onClose={onClose} />

      <FormBody>
        <FormSelect name="currencyId" isClearable label={t('Ordinary currency')} options={selectCurrencyOptions} />
        <FormTextField name="name" label={t('Name')} ref={nameFieldRefCallback} />
        <FormTextField name="symbol" label={t('Symbol')} helperText={t('Displayed currency sign')} />
        <FormTextField name="precision" label={t('Precision')} helperText={t('A number of symbols after comma')} />
        <FormCheckbox
          name="isEnabled"
          helperText={t('Inactive money is hidden when creating or editing a transaction')}
        >
          {t('Active')}
        </FormCheckbox>
        <FormTextField name="sorting" label={t('Sorting')} helperText={t('Sets the currency display order for multicurrency accounts')}/>
      </FormBody>

      <FormFooter>
        <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
          {t('Cancel')}
        </FormButton>
        <FormButton type="submit" color="primary" isIgnoreValidation>
          {t('Save')}
        </FormButton>
      </FormFooter>
    </Form>
  );
}
