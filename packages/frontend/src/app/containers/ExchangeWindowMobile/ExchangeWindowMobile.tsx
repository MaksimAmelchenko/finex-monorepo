import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { FormikHelpers } from 'formik';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { Accordion, ChevronRightIcon } from '@finex/ui-kit';
import { AccountField } from '../AccountFieldMobile/AccountField';
import { AccountsRepository } from '../../stores/accounts-repository';
import { AmountField } from '../AmountFieldMobile/AmountField';
import { BackButton, DeleteButton, Header } from '../../components/Header/Header';
import { CreateExchangeData, UpdateExchangeChanges } from '../../types/exchange';
import { DateField } from '../../components/DateField/DateField';
import { Form, FormBody, FormCheckbox } from '../../components/Form';
import { FormTextAreaField } from '../../components/Form/FormTextArea2/FormTextArea';
import { IOperationExchange } from '../../types/operation';
import { MoneysRepository } from '../../stores/moneys-repository';
import { OperationExchange } from '../../stores/models/operation';
import { OperationsRepository } from '../../stores/operations-repository';
import { SaveButton } from '../../components/FormSaveButton/FormSaveButton';
import { Shape } from '../../types';
import { TagsField } from '../TagsFieldMobile/TagsField';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from '../OperationWindowMobile/OperationWindowMobile.module.scss';

interface ExchangeFormValues {
  amountSell: string;
  moneySellId: string | null;
  amountBuy: string;
  moneyBuyId: string | null;
  accountSellId: string | null;
  accountBuyId: string | null;
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

interface ExchangeWindowMobileProps {
  exchange: Partial<IOperationExchange> | OperationExchange;
  onClose: () => unknown;
}

const t = getT('ExchangeWindowMobile');

function mapValuesToCreatePayload(values: ExchangeFormValues): CreateExchangeData {
  const {
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
  } = values;
  const data: CreateExchangeData = {
    amountSell: Number(amountSell),
    moneySellId: moneySellId!,
    amountBuy: Number(amountBuy),
    moneyBuyId: moneyBuyId!,
    accountSellId: accountSellId!,
    accountBuyId: accountBuyId!,
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

function mapValuesToUpdatePayload(values: ExchangeFormValues): UpdateExchangeChanges {
  const {
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
  } = values;
  const changes: UpdateExchangeChanges = {
    amountSell: Number(amountSell),
    moneySellId: moneySellId!,
    amountBuy: Number(amountBuy),
    moneyBuyId: moneyBuyId!,
    accountSellId: accountSellId!,
    accountBuyId: accountBuyId!,
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

export function ExchangeWindowMobile({ exchange, onClose }: ExchangeWindowMobileProps): JSX.Element {
  const {
    //
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

  const accountsRepository = useStore(AccountsRepository);
  const moneysRepository = useStore(MoneysRepository);
  const operationsRepository = useStore(OperationsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(Boolean(note || tags?.length));
  const [isNew, setIsNew] = useState<boolean>(!(exchange instanceof OperationExchange));

  useEffect(() => {
    analytics.view({
      page_title: 'exchange-mobile',
    });
  }, []);

  const amountSellFieldRef = useRef<HTMLInputElement | null>(null);
  const amountSellFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      amountSellFieldRef.current = node;
      requestAnimationFrame(() => amountSellFieldRef.current && amountSellFieldRef.current.focus());
    }
  }, []);

  const onSubmit = useCallback(
    (
      values: ExchangeFormValues,
      { resetForm }: FormikHelpers<ExchangeFormValues>,
      initialValues: ExchangeFormValues
    ) => {
      let result: Promise<OperationExchange>;
      if (isNew) {
        // create exchange
        const data: CreateExchangeData = mapValuesToCreatePayload(values);
        result = operationsRepository.createExchange(data).then(exchange => {
          operationsRepository.setLastOperationId(exchange.id);
          return exchange;
        });
      } else {
        const changes: UpdateExchangeChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = operationsRepository.updateExchange(exchange as OperationExchange, changes);
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
            enqueueSnackbar(t('Exchange has been saved'), { variant: 'success' });
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
    [enqueueSnackbar, operationsRepository, onClose, exchange, isNew]
  );

  const handleDeleteClick = () => {
    operationsRepository
      .deleteExchange(exchange as OperationExchange)
      .then(() => {
        onClose();
      })
      .catch(err => {
        let message = '';
        switch (err.code) {
          default:
            message = err.message;
        }
        enqueueSnackbar(message, { variant: 'error' });
      });
  };

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<ExchangeFormValues>>({
        amountSell: Yup.mixed()
          .required(t('Please fill amount'))
          .test('amountSell', t('Please enter a number'), value => !isNaN(value))
          .test('amountSell', t('Please select money'), function () {
            return this.parent.moneySellId;
          }),
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
        accountSellId: Yup.mixed().test('accountSellId', t('Please select account'), value => Boolean(value)),
        accountBuyId: Yup.mixed().test('accountBuyId', t('Please select account'), value => Boolean(value)),
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

  const handleShowAdditionalFieldsClick = () => {
    setIsShowAdditionalFields(isShow => !isShow);
  };

  const defaultMoney = moneysRepository.availableMoneys[0];
  const defaultAccount = accountsRepository.availableAccounts[0];

  return (
    <Form<ExchangeFormValues>
      onSubmit={onSubmit}
      initialValues={{
        amountSell: amountSell ? String(amountSell) : '',
        moneySellId: moneySell?.id ?? defaultMoney?.id ?? null,
        amountBuy: amountBuy ? String(amountBuy) : '',
        moneyBuyId: moneyBuy?.id ?? null,
        accountSellId: accountSell?.id ?? defaultAccount?.id ?? null,
        accountBuyId: accountBuy?.id ?? defaultAccount?.id ?? null,
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
      name="exchange-mobile"
    >
      {({ values }) => (
        <>
          <Header
            title={isNew ? t('Add exchange') : t('Edit exchange')}
            startAdornment={<BackButton onClick={onClose} />}
            endAdornment={!isNew && <DeleteButton onClick={handleDeleteClick} />}
          />
          <FormBody className={styles.main}>
            <AmountField
              amountFieldName="amountSell"
              moneyFieldName="moneySellId"
              label={t('Sell')}
              ref={amountSellFieldRefCallback}
            />

            <AmountField amountFieldName="amountBuy" moneyFieldName="moneyBuyId" label={t('Buy')} />

            <AccountField name="accountSellId" label={t('Sell account')} />

            <AccountField name="accountBuyId" label={t('Buy account')} />

            <div className={styles.dateFields}>
              <DateField name="exchangeDate" label={t('Date')} dateFormat="date.format.fullDateWithDayOfWeek" />

              <DateField
                name="reportPeriod"
                label={t('Period')}
                dateFormat="date.format.month"
                showMonthYearPicker
                className={styles.dateFields__reportPeriod}
              />
            </div>

            <div className={clsx(styles.fee)}>
              <FormCheckbox name="isFee">{t('Fee')}</FormCheckbox>
              <Accordion isExpanded={values.isFee} className={styles.fee__fields}>
                <AmountField amountFieldName="fee" moneyFieldName="moneyFeeId" label={t('Fee')} />
                <AccountField name="accountFeeId" label={t('Fee account')} />
              </Accordion>
            </div>

            <div className={styles.additional}>
              <div className={styles.additional__header} onClick={handleShowAdditionalFieldsClick}>
                <div className={styles.additional__title}>
                  {isShowAdditionalFields ? t('Hide additional fields') : t('Show additional fields')}
                  <ChevronRightIcon
                    className={clsx(
                      styles.additional__icon,
                      isShowAdditionalFields && styles.additional__icon_expended
                    )}
                  />
                </div>
                <div className={styles.additional__description}>{t('Note, Tags')}</div>
              </div>
              <Accordion isExpanded={isShowAdditionalFields} className={styles.additional__fields}>
                <FormTextAreaField name="note" label={t('Note')} minRows={1} />
                <TagsField name="tagIds" label={t('Tags')} />
              </Accordion>
            </div>
          </FormBody>

          <footer className={styles.footer}>
            <SaveButton variant="secondaryGray" isOnlySave={false} isIgnoreValidation>
              {t('Save and Create New')}
            </SaveButton>
            <SaveButton type="submit" variant="primary" isIgnoreValidation>
              {t('Save')}
            </SaveButton>
          </footer>
        </>
      )}
    </Form>
  );
}
