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
  FormTextAreaField,
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
  amountSell: string;
  moneySellId: string;
  amountBuy: string;
  moneyBuyId: string | null;
  accountSellId: string;
  accountBuyId: string;
  exchangeDate: Date;
  reportPeriod: Date;
  isFee: boolean;
  fee: string;
  moneyFeeId: string | null;
  accountFeeId: string | null;
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
  amountSell,
  moneySellId,
  amountBuy,
  moneyBuyId,
  accountSellId,
  accountBuyId,
  exchangeDate,
  reportPeriod,
  isFee,
  fee,
  moneyFeeId,
  accountFeeId,
  note,
  tagIds,
}: ExchangeFormValues): CreateExchangeData {
  const data: CreateExchangeData = {
    amountSell: Number(amountSell),
    moneySellId,
    amountBuy: Number(amountBuy),
    moneyBuyId: moneyBuyId!,
    accountSellId,
    accountBuyId,
    exchangeDate: format(exchangeDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    note,
    tags: tagIds,
  };
  if (isFee) {
    if (!fee || !moneyFeeId || !accountFeeId) {
      throw new Error('Exchange form is corrupted');
    }

    data.fee = Number(fee);
    data.moneyFeeId = moneyFeeId;
    data.accountFeeId = accountFeeId;
  }
  return data;
}

function mapValuesBuyUpdatePayload({
  amountSell,
  moneySellId,
  amountBuy,
  moneyBuyId,
  accountSellId,
  accountBuyId,
  exchangeDate,
  reportPeriod,
  isFee,
  fee,
  moneyFeeId,
  accountFeeId,
  note,
  tagIds,
}: ExchangeFormValues): UpdateExchangeChanges {
  const changes: UpdateExchangeChanges = {
    amountSell: Number(amountSell),
    moneySellId,
    amountBuy: Number(amountBuy),
    moneyBuyId: moneyBuyId!,
    accountSellId,
    accountBuyId,
    exchangeDate: format(exchangeDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    note,
    tags: tagIds,
  };

  if (isFee) {
    if (!moneyFeeId || !accountFeeId) {
      throw new Error('Exchange form is corrupted');
    }
    changes.fee = Number(fee);
    changes.moneyFeeId = moneyFeeId;
    changes.accountFeeId = accountFeeId;
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

  const amountSellFieldRef = useRef<HTMLInputElement | null>(null);

  const amountSellFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      amountSellFieldRef.current = node;
      amountSellFieldRef.current.focus();
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
              amountSell,
              moneySellId,
              amountBuy,
              moneyBuyId,
              accountSellId,
              accountBuyId,
              isFee,
              fee,
              moneyFeeId,
              accountFeeId,
              exchangeDate,
              reportPeriod,
            } = values;
            resetForm({
              values: {
                amountSell: '',
                moneySellId,
                amountBuy: '',
                moneyBuyId,
                accountSellId,
                accountBuyId,
                exchangeDate,
                reportPeriod,
                isFee,
                fee: '',
                moneyFeeId,
                accountFeeId,
                note: '',
                tagIds: [],
                isOnlySave: false,
              },
            });
            setIsNew(true);
            amountSellFieldRef.current?.focus();
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
        amountSell: Yup.mixed()
          .required(t('Please fill amount'))
          .test('amountSell', t('Please enter a number'), value => !isNaN(value)),
        amountBuy: Yup.mixed()
          .required(t('Please fill amount'))
          .test('amountBuy', t('Please enter a number'), value => !isNaN(value))
          .test('amountBuy', t('Please select money'), function () {
            return this.parent.moneyBuyId;
          })
          .test(
            'amountBuy',
            t('Please select a money other than the money you are exchanging money from'),
            function () {
              return !(this.parent.moneySellId === this.parent.moneyBuyId);
            }
          ),
        exchangeDate: Yup.date().required(t('Please select date')),
        reportPeriod: Yup.date().required(t('Please select date')),
        fee: Yup.mixed().test('fee', t('Please fill fee'), function (value) {
          return !(this.parent.isFee && isNaN(value));
        }),
        accountFeeId: Yup.mixed().test('accountFeeId', t('Please select account'), function (value) {
          return !(this.parent.isFee && !value);
        }),
      }),
    []
  );

  const selectAccountsOptions = useMemo<ISelectOption[]>(() => {
    return accountsRepository.accounts
      .filter(
        ({ id, isEnabled }) =>
          isEnabled || [exchange.accountSell?.id, exchange.accountBuy?.id, exchange.accountFee?.id].includes(id)
      )
      .map(({ id: value, name: label }) => ({ value, label }));
  }, [accountsRepository.accounts, exchange.accountBuy?.id, exchange.accountFee?.id, exchange.accountSell?.id]);

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
    amountSell,
    moneySell,
    amountBuy,
    moneyBuy,
    accountSell,
    accountBuy,
    exchangeDate,
    reportPeriod,
    fee,
    moneyFee,
    accountFee,
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
        amountSell: amountSell ? String(amountSell) : '',
        moneySellId: moneySell?.id ?? defaultMoney.id,
        amountBuy: amountBuy ? String(amountBuy) : '',
        moneyBuyId: moneyBuy?.id ?? null,
        accountSellId: accountSell?.id ?? defaultAccount.id,
        accountBuyId: accountBuy?.id ?? defaultAccount.id,
        exchangeDate: exchangeDate ? parseISO(exchangeDate) : new Date(),
        reportPeriod: reportPeriod ? parseISO(reportPeriod) : new Date(),
        isFee: Boolean(fee),
        fee: fee ? String(fee) : '',
        moneyFeeId: moneyFee?.id ?? defaultMoney.id,
        accountFeeId: accountFee?.id ?? null,
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
                amountFieldName="amountSell"
                moneyFieldName="moneySellId"
                label={t('Sell')}
                ref={amountSellFieldRefCallback}
                tabIndex={1}
              />
              <AmountField amountFieldName="amountBuy" moneyFieldName="moneyBuyId" label={t('Buy')} />
            </div>
            <FormSelect name="accountSellId" label={t('Sell account')} options={selectAccountsOptions} />
            <FormSelect name="accountBuyId" label={t('Buy account')} options={selectAccountsOptions} />
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
              <AmountField amountFieldName="fee" moneyFieldName="moneyFeeId" label={t('Fee')} />
              <FormSelect name="accountFeeId" label={t('Fee account')} options={selectAccountsOptions} />
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
                <FormTextAreaField name="note" label={t('Note')} />
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
              <FormButton type="submit" color="primary" isIgnoreValidation>
                {t('Save and Create New')}
              </FormButton>
            </div>
          </FormFooter>
        </>
      )}
    </Form>
  );
}
