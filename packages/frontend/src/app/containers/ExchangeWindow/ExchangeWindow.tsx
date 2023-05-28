import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { FormikHelpers } from 'formik';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { AccountsRepository } from '../../stores/accounts-repository';
import { AmountField } from '../AmountField/AmountField';
import { CircleQuestionIcon, IconButton, ISelectOption, Target } from '@finex/ui-kit';
import { CreateExchangeData, IExchange, UpdateExchangeChanges } from '../../types/exchange';
import { Exchange } from '../../stores/models/exchange';
import { ExchangesRepository } from '../../stores/exchanges-repository';
import {
  Form,
  FormBody,
  FormButton,
  FormCheckbox,
  FormDateField,
  FormFooter,
  FormHeader,
  FormSelect,
  FormTextArea,
} from '../../components/Form';
import { HtmlTooltip } from '../../components/HtmlTooltip/HtmlTooltip';
import { Link } from '../../components/Link/Link';
import { MoneysRepository } from '../../stores/moneys-repository';
import { SaveButton } from '../../components/FormSaveButton/FormSaveButton';
import { Shape } from '../../types';
import { TagsRepository } from '../../stores/tags-repository';
import { analytics } from '../../lib/analytics';
import { getFormat, getT } from '../../lib/core/i18n';
import { getPatch } from '../../lib/core/get-patch';
import { noop } from '../../lib/noop';
import { useCloseOnEscape } from '../../hooks/use-close-on-escape';
import { useStore } from '../../core/hooks/use-store';

import styles from './ExchangeWindow.module.scss';

interface ExchangeFormValues {
  sellAmount: string;
  sellMoneyId: string;
  buyAmount: string;
  buyMoneyId: string | null;
  sellAccountId: string;
  buyAccountId: string;
  exchangeDate: Date;
  reportPeriod: Date;
  isFee: boolean;
  fee: string;
  feeMoneyId: string | null;
  feeAccountId: string | null;
  note: string;
  tagIds: string[];
  isOnlySave: boolean;
}

interface ExchangeWindowProps {
  exchange: Partial<IExchange> | Exchange;
  onClose: () => unknown;
}

const t = getT('ExchangeWindow');

function mapValuesBuyCreatePayload({
  sellAmount,
  sellMoneyId,
  buyAmount,
  buyMoneyId,
  sellAccountId,
  buyAccountId,
  exchangeDate,
  reportPeriod,
  isFee,
  fee,
  feeMoneyId,
  feeAccountId,
  note,
  tagIds,
}: ExchangeFormValues): CreateExchangeData {
  const data: CreateExchangeData = {
    sellAmount: Number(sellAmount),
    sellMoneyId,
    buyAmount: Number(buyAmount),
    buyMoneyId: buyMoneyId!,
    sellAccountId,
    buyAccountId,
    exchangeDate: format(exchangeDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    note,
    tags: tagIds,
  };
  if (isFee) {
    if (!fee || !feeMoneyId || !feeAccountId) {
      throw new Error('Exchange form is corrupted');
    }

    data.fee = Number(fee);
    data.feeMoneyId = feeMoneyId;
    data.feeAccountId = feeAccountId;
  }
  return data;
}

function mapValuesBuyUpdatePayload({
  sellAmount,
  sellMoneyId,
  buyAmount,
  buyMoneyId,
  sellAccountId,
  buyAccountId,
  exchangeDate,
  reportPeriod,
  isFee,
  fee,
  feeMoneyId,
  feeAccountId,
  note,
  tagIds,
}: ExchangeFormValues): UpdateExchangeChanges {
  const changes: UpdateExchangeChanges = {
    sellAmount: Number(sellAmount),
    sellMoneyId,
    buyAmount: Number(buyAmount),
    buyMoneyId: buyMoneyId!,
    sellAccountId,
    buyAccountId,
    exchangeDate: format(exchangeDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    note,
    tags: tagIds,
  };

  if (isFee) {
    if (!feeMoneyId || !feeAccountId) {
      throw new Error('Exchange form is corrupted');
    }
    changes.fee = Number(fee);
    changes.feeMoneyId = feeMoneyId;
    changes.feeAccountId = feeAccountId;
  } else {
    changes.isFee = false;
  }

  return changes;
}

export function ExchangeWindow({ exchange, onClose }: ExchangeWindowProps): JSX.Element {
  const accountsRepository = useStore(AccountsRepository);
  const moneysRepository = useStore(MoneysRepository);
  const tagsRepository = useStore(TagsRepository);
  const exchangesRepository = useStore(ExchangesRepository);

  const { enqueueSnackbar } = useSnackbar();
  const { onCanCloseChange } = useCloseOnEscape({ onClose });

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(!(exchange instanceof Exchange));

  useEffect(() => {
    analytics.view({
      page_title: 'exchange',
    });
  }, []);

  const sellAmountFieldRef = useRef<HTMLInputElement | null>(null);

  const sellAmountFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      sellAmountFieldRef.current = node;
      sellAmountFieldRef.current.focus();
    }
  }, []);

  const onSubmit = useCallback(
    (
      values: ExchangeFormValues,
      { resetForm }: FormikHelpers<ExchangeFormValues>,
      initialValues: ExchangeFormValues
    ) => {
      let result: Promise<unknown>;
      if (isNew) {
        const data: CreateExchangeData = mapValuesBuyCreatePayload(values);
        result = exchangesRepository.createExchange(data);
      } else {
        const changes: UpdateExchangeChanges = getPatch(
          mapValuesBuyUpdatePayload(initialValues),
          mapValuesBuyUpdatePayload(values)
        );
        result = exchangesRepository.updateExchange(exchange as Exchange, changes);
      }

      return result
        .then(() => {
          if (values.isOnlySave) {
            onClose();
          } else {
            const {
              sellAmount,
              sellMoneyId,
              buyAmount,
              buyMoneyId,
              sellAccountId,
              buyAccountId,
              isFee,
              fee,
              feeMoneyId,
              feeAccountId,
              exchangeDate,
              reportPeriod,
            } = values;
            resetForm({
              values: {
                sellAmount: '',
                sellMoneyId,
                buyAmount: '',
                buyMoneyId,
                sellAccountId,
                buyAccountId,
                exchangeDate,
                reportPeriod,
                isFee,
                fee: '',
                feeMoneyId,
                feeAccountId,
                note: '',
                tagIds: [],
                isOnlySave: false,
              },
            });
            setIsNew(true);
            sellAmountFieldRef.current?.focus();
          }
        })
        .catch(err => {
          let message = '';
          switch (err.code) {
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [enqueueSnackbar, exchangesRepository, onClose, exchange, isNew]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<ExchangeFormValues>>({
        sellAmount: Yup.mixed()
          .required(t('Please fill amount'))
          .test('sellAmount', t('Please enter a number'), value => !isNaN(value)),
        buyAmount: Yup.mixed()
          .required(t('Please fill amount'))
          .test('buyAmount', t('Please enter a number'), value => !isNaN(value))
          .test('buyAmount', t('Please select money'), function () {
            return this.parent.buyMoneyId;
          })
          .test(
            'buyAmount',
            t('Please select a money other than the money you are exchanging money from'),
            function () {
              return !(this.parent.sellMoneyId === this.parent.buyMoneyId);
            }
          ),
        exchangeDate: Yup.date().required(t('Please select date')),
        reportPeriod: Yup.date().required(t('Please select date')),
        fee: Yup.mixed().test('fee', t('Please fill fee'), function (value) {
          return !(this.parent.isFee && isNaN(value));
        }),
        feeAccountId: Yup.mixed().test('feeAccountId', t('Please select account'), function (value) {
          return !(this.parent.isFee && !value);
        }),
      }),
    []
  );

  const selectAccountsOptions = useMemo<ISelectOption[]>(() => {
    return accountsRepository.accounts
      .filter(
        ({ id, isEnabled }) =>
          isEnabled || [exchange.sellAccount?.id, exchange.buyAccount?.id, exchange.feeAccount?.id].includes(id)
      )
      .map(({ id: value, name: label }) => ({ value, label }));
  }, [accountsRepository.accounts, exchange.buyAccount?.id, exchange.feeAccount?.id, exchange.sellAccount?.id]);

  const selectTagsOptions = useMemo<ISelectOption[]>(() => {
    return tagsRepository.tags.map(({ id: value, name: label }) => ({ value, label }));
  }, [tagsRepository.tags]);

  const handleShowAdditionalFieldsClick = () => {
    setIsShowAdditionalFields(isShow => !isShow);
  };

  if (!accountsRepository.accounts.length) {
    return (
      <div>
        {t('At first,')} <Link href="/accounts">{t('create')}</Link> {t('at least one account.')}
      </div>
    );
  }

  const {
    sellAmount,
    sellMoney,
    buyAmount,
    buyMoney,
    sellAccount,
    buyAccount,
    exchangeDate,
    reportPeriod,
    fee,
    feeMoney,
    feeAccount,
    note,
    tags,
  } = exchange;

  const defaultMoney = moneysRepository.availableMoneys[0];
  const defaultAccount = accountsRepository.availableAccounts[0];
  return (
    <Form<ExchangeFormValues>
      onSubmit={onSubmit}
      onError={(hr, error) => {
        console.log(hr, error);
      }}
      initialValues={{
        sellAmount: sellAmount ? String(sellAmount) : '',
        sellMoneyId: sellMoney?.id ?? defaultMoney.id,
        buyAmount: buyAmount ? String(buyAmount) : '',
        buyMoneyId: buyMoney?.id ?? null,
        sellAccountId: sellAccount?.id ?? defaultAccount.id,
        buyAccountId: buyAccount?.id ?? defaultAccount.id,
        exchangeDate: exchangeDate ? parseISO(exchangeDate) : new Date(),
        reportPeriod: reportPeriod ? parseISO(reportPeriod) : new Date(),
        isFee: Boolean(fee),
        fee: fee ? String(fee) : '',
        feeMoneyId: feeMoney?.id ?? defaultMoney.id,
        feeAccountId: feeAccount?.id ?? null,
        note: note ?? '',
        tagIds: tags ? tags.map(tag => tag.id) : [],
        isOnlySave: false,
      }}
      validationSchema={validationSchema}
      onDirtyChange={dirty => onCanCloseChange(!dirty)}
      name="exchange"
    >
      {({ values }) => (
        <>
          <FormHeader title={isNew ? t('Add new exchange record') : t('Edit exchange record')} onClose={onClose} />

          <FormBody>
            <div className={styles.amountFields}>
              <AmountField
                amountFieldName="sellAmount"
                moneyFieldName="sellMoneyId"
                label={t('Sell')}
                ref={sellAmountFieldRefCallback}
                tabIndex={1}
              />
              <AmountField amountFieldName="buyAmount" moneyFieldName="buyMoneyId" label={t('Buy')} />
            </div>
            <FormSelect name="sellAccountId" label={t('Sell account')} options={selectAccountsOptions} />
            <FormSelect name="buyAccountId" label={t('Buy account')} options={selectAccountsOptions} />
            <div className={styles.dateFields}>
              <FormDateField
                name="exchangeDate"
                label={t('Date')}
                dateFormat={getFormat('date.format.default')}
                className={styles.dateFields__date}
              />
              <div className={styles.reportPeriod}>
                <FormDateField
                  name="reportPeriod"
                  label={t('Period')}
                  dateFormat={getFormat('date.format.month')}
                  showMonthYearPicker
                  className={styles.reportPeriod__input}
                />
                <HtmlTooltip
                  title={
                    <p>
                      The reporting month allows you to attribute income or expenses not to the actual date, but to the
                      reporting month (used to build reports)
                    </p>
                  }
                >
                  <IconButton onClick={noop} size="medium">
                    <CircleQuestionIcon />
                  </IconButton>
                </HtmlTooltip>
              </div>
            </div>

            <FormCheckbox name="isFee">{t('Fee')}</FormCheckbox>

            <div className={clsx(styles.fee__fields, !values.isFee && styles.fee__fields_hidden)}>
              <AmountField amountFieldName="fee" moneyFieldName="feeMoneyId" label={t('Fee')} />
              <FormSelect name="feeAccountId" label={t('Fee account')} options={selectAccountsOptions} />
            </div>

            <div className={styles.additional}>
              <div>
                <Target
                  label={isShowAdditionalFields ? t('Hide additional fields') : t('Show additional fields')}
                  onClick={handleShowAdditionalFieldsClick}
                />
                <div className={styles.additional__description}>{t('Note, Tags')}</div>
              </div>

              <div
                className={clsx(styles.additional__fields, !isShowAdditionalFields && styles.additional__fields_hidden)}
              >
                <FormTextArea name="note" label={t('Note')} />
                <FormSelect isMulti name="tagIds" label={t('Tags')} options={selectTagsOptions} />
              </div>
            </div>
          </FormBody>

          <FormFooter>
            <FormButton variant="secondaryGray" isIgnoreValidation onClick={onClose}>
              {t('Cancel')}
            </FormButton>
            <div className={styles.footer__rightButtons}>
              <SaveButton variant="secondaryGray" isIgnoreValidation>
                {t('Save')}
              </SaveButton>
              <FormButton type="submit" variant="primary" isIgnoreValidation>
                {t('Save and Create New')}
              </FormButton>
            </div>
          </FormFooter>
        </>
      )}
    </Form>
  );
}
