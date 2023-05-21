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
import { CategoryField } from '../CategoryFieldMobile/CategoryField';
import { CreateTransactionData, ITransaction, UpdateTransactionChanges } from '../../types/transaction';
import { DateField } from '../../components/DateField/DateField';
import { Form, FormBody, FormCheckbox, FormTextArea, FormSegmentedControl } from '../../components/Form';
import { ITabOption } from '../../components/Tabs/Tabs';
import { MoneysRepository } from '../../stores/moneys-repository';
import { QuantityField } from '../QuantityFieldMobile/QuantityField';
import { SaveButton } from '../../components/FormSaveButton/FormSaveButton';
import { Shape, Sign } from '../../types';
import { TagsField } from '../TagsFieldMobile/TagsField';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from '../OperationWindowMobile/OperationWindowMobile.module.scss';

interface TransactionFormValues {
  sign: '1' | '-1';
  amount: string;
  moneyId: string | null;
  categoryId: string | null;
  accountId: string | null;
  transactionDate: Date;
  reportPeriod: Date;
  quantity: string;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tagIds: string[];
  planId: string | null;
  isOnlySave: boolean;
}

interface TransactionWindowMobileProps {
  transaction: Partial<ITransaction> /*| PlannedTransaction*/;
  onClose: () => unknown;
  onCreate: (data: CreateTransactionData) => Promise<unknown>;
  onUpdate: (cashFlowId: string, transactionId: string, changes: UpdateTransactionChanges) => Promise<unknown>;
  onDelete: (cashFlowId: string, transactionId: string) => Promise<unknown>;
}

const t = getT('TransactionWindowMobile');

function mapValuesToCreatePayload(values: TransactionFormValues): CreateTransactionData {
  const {
    sign,
    amount,
    moneyId,
    categoryId,
    accountId,
    transactionDate,
    reportPeriod,
    quantity,
    unitId,
    isNotConfirmed,
    note,
    tagIds,
    planId,
  } = values;
  return {
    sign: Number(sign) as Sign,
    amount: Number(amount),
    moneyId: moneyId!,
    categoryId: categoryId!,
    accountId: accountId!,
    // TODO take contractorId from PlannedTransaction
    contractorId: null,
    transactionDate: format(transactionDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    quantity: quantity ? Number(quantity) : null,
    unitId: unitId || null,
    isNotConfirmed,
    note,
    tags: tagIds,
    planId,
  };
}

function mapValuesToUpdatePayload(values: TransactionFormValues): UpdateTransactionChanges {
  const {
    sign,
    amount,
    moneyId,
    categoryId,
    accountId,
    transactionDate,
    reportPeriod,
    quantity,
    unitId,
    isNotConfirmed,
    note,
    tagIds,
  } = values;
  return {
    sign: Number(sign) as Sign,
    amount: Number(amount),
    moneyId: moneyId!,
    categoryId: categoryId!,
    accountId: accountId!,
    transactionDate: format(transactionDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    quantity: quantity ? Number(quantity) : null,
    unitId: unitId || null,
    isNotConfirmed,
    note,
    tags: tagIds,
  };
}

export function TransactionWindowMobile({
  transaction,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: TransactionWindowMobileProps): JSX.Element {
  const {
    //
    sign,
    amount,
    money,
    category,
    account,
    transactionDate,
    reportPeriod,
    quantity,
    unit,
    note,
    tags,
  } = transaction;

  const signOptions: ITabOption[] = useMemo(
    () => [
      { value: '1', label: t('Income') },
      { value: '-1', label: t('Expense') },
    ],
    []
  );

  const accountsRepository = useStore(AccountsRepository);
  const moneysRepository = useStore(MoneysRepository);

  const { enqueueSnackbar } = useSnackbar();

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(
    Boolean(quantity || note || tags?.length)
  );
  const [isNew, setIsNew] = useState<boolean>(!transaction.id);

  useEffect(() => {
    analytics.view({
      page_title: 'transaction-mobile',
    });
  }, []);

  const amountFieldRef = useRef<HTMLInputElement | null>(null);
  const amountFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      amountFieldRef.current = node;
      requestAnimationFrame(() => amountFieldRef.current && amountFieldRef.current.focus());
    }
  }, []);

  const onSubmit = useCallback(
    (
      values: TransactionFormValues,
      { resetForm }: FormikHelpers<TransactionFormValues>,
      initialValues: TransactionFormValues
    ) => {
      let result: Promise<unknown>;
      if (isNew) {
        // create transaction
        const data: CreateTransactionData = mapValuesToCreatePayload(values);
        result = onCreate({ ...data, cashFlowId: transaction.cashFlowId });
      } else {
        const changes: UpdateTransactionChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        const { cashFlowId, id } = transaction;
        result = onUpdate(cashFlowId!, id!, changes);
      }

      return result
        .then(() => {
          if (values.isOnlySave) {
            onClose();
          } else {
            const { sign, moneyId, categoryId, accountId, transactionDate, reportPeriod, isNotConfirmed } = values;
            resetForm({
              values: {
                sign,
                amount: '',
                moneyId,
                categoryId,
                accountId,
                transactionDate,
                reportPeriod,
                quantity: '',
                unitId: null,
                isNotConfirmed,
                note: '',
                tagIds: [],
                isOnlySave: false,
                planId: null,
              },
            });
            setIsNew(true);
            amountFieldRef.current?.focus();
            enqueueSnackbar(t('Transaction has been saved'), { variant: 'success' });
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
    [enqueueSnackbar, onCreate, onUpdate, onClose, transaction, isNew]
  );

  const handleDeleteClick = () => {
    const { cashFlowId, id } = transaction;
    onDelete(cashFlowId!, id!)
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
      Yup.object<Shape<TransactionFormValues>>({
        transactionDate: Yup.date().required(t('Please select date')),
        reportPeriod: Yup.date().required(t('Please select date')),
        amount: Yup.mixed()
          .required(t('Please fill amount'))
          .test('amount', t('Please enter a number'), value => !isNaN(value)),
        moneyId: Yup.mixed().test('moneyId', t('Please select money'), value => Boolean(value)),
        categoryId: Yup.mixed().test('categoryId', t('Please select category'), value => Boolean(value)),
        accountId: Yup.mixed().test('accountId', t('Please select account'), value => Boolean(value)),
        quantity: Yup.mixed().test('quantity', t('Please enter a number'), value => !value || (value && !isNaN(value))),
      }),
    []
  );

  const handleShowAdditionalFieldsClick = () => {
    setIsShowAdditionalFields(isShow => !isShow);
  };

  const defaultMoney = moneysRepository.availableMoneys[0];
  const defaultAccount = accountsRepository.availableAccounts[0];

  const isPlanned = false;
  return (
    <Form<TransactionFormValues>
      onSubmit={onSubmit}
      initialValues={{
        sign: String(sign) as any,
        amount: amount ? String(amount) : '',
        moneyId: money?.id ?? defaultMoney?.id ?? null,
        categoryId: category?.id ?? null,
        accountId: account?.id ?? defaultAccount?.id ?? null,
        transactionDate: transactionDate ? parseISO(transactionDate) : new Date(),
        reportPeriod: reportPeriod ? parseISO(reportPeriod) : new Date(),
        quantity: quantity ? String(quantity) : '',
        unitId: unit?.id ?? null,
        isNotConfirmed: isPlanned ? false : transaction?.isNotConfirmed ?? false,
        note: note ?? '',
        tagIds: tags ? tags.map(tag => tag.id) : [],
        // planId: isPlanned ? transaction.planId : null,
        planId: null,
        isOnlySave: false,
      }}
      validationSchema={validationSchema}
      name="transaction-mobile"
    >
      <Header
        title={isNew ? t('Add transaction') : t('Edit transaction')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={!isNew && <DeleteButton onClick={handleDeleteClick} />}
      />
      <FormBody className={styles.main}>
        <FormSegmentedControl name="sign" options={signOptions} />

        <AmountField
          amountFieldName="amount"
          moneyFieldName="moneyId"
          label={t('Amount')}
          ref={amountFieldRefCallback}
        />

        <CategoryField name="categoryId" label={t('Category')} />

        <AccountField name="accountId" label={t('Account')} />

        <div className={styles.dateFields}>
          <DateField name="transactionDate" label={t('Date')} dateFormat="date.format.fullDateWithDayOfWeek" />

          <DateField
            name="reportPeriod"
            label={t('Period')}
            dateFormat="date.format.month"
            showMonthYearPicker
            className={styles.dateFields__reportPeriod}
          />
        </div>

        <div className={styles.additional}>
          <div className={styles.additional__header} onClick={handleShowAdditionalFieldsClick}>
            <div className={styles.additional__title}>
              {isShowAdditionalFields ? t('Hide additional fields') : t('Show additional fields')}
              <ChevronRightIcon
                className={clsx(styles.additional__icon, isShowAdditionalFields && styles.additional__icon_expended)}
              />
            </div>
            <div className={styles.additional__description}>{t('Quantity, Not confirmed, Note, Tags')}</div>
          </div>
          <Accordion isExpanded={isShowAdditionalFields} className={styles.additional__fields}>
            <QuantityField quantityFieldName="quantity" unitFieldName="unitId" label={t('Quantity')} />
            <FormCheckbox name="isNotConfirmed">{t('Not confirmed transaction')}</FormCheckbox>
            <FormTextArea name="note" label={t('Note')} minRows={1} />
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
    </Form>
  );
}
