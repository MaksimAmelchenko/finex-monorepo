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
import { CategoryField } from '../CategoryFieldMobile/CategoryField';
import { CreateTransactionData, UpdateTransactionChanges } from '../../types/transaction';
import { DateField } from '../../components/DateField/DateField';
import { Form, FormBody, FormButton, FormCheckbox } from '../../components/Form';
import { FormSegmentedControl } from '../../components/Form/FormSegmentedControl/FormSegmentedControl';
import { FormTextAreaField } from '../../components/Form/FormTextArea2/FormTextArea';
import { BackButton, DeleteButton, Header } from '../../components/Header/Header';
import { IOperationTransaction } from '../../types/operation';
import { ITabOption } from '../../components/Tabs/Tabs';
import { MoneysRepository } from '../../stores/moneys-repository';
import { OperationTransaction } from '../../stores/models/operation';
import { OperationsRepository } from '../../stores/operations-repository';
import { QuantityField } from '../QuantityFieldMobile/QuantityField';
import { SaveButton } from '../../components/FormSaveButton/FormSaveButton';
import { Shape, Sign } from '../../types';
import { TagsField } from '../TagsFieldMobile/TagsField';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './TransactionWindowMobile.module.scss';

interface TransactionFormValues {
  sign: '1' | '-1';
  amount: string;
  moneyId: string;
  categoryId: string | null;
  accountId: string;
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
  transaction: Partial<IOperationTransaction> | OperationTransaction;
  onClose: () => unknown;
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
    moneyId,
    categoryId: categoryId!,
    accountId,
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
    moneyId,
    categoryId: categoryId!,
    accountId,
    transactionDate: format(transactionDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    quantity: quantity ? Number(quantity) : null,
    unitId: unitId || null,
    isNotConfirmed,
    note,
    tags: tagIds,
  };
}

export function TransactionWindowMobile({ transaction, onClose }: TransactionWindowMobileProps): JSX.Element {
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
  const operationsRepository = useStore(OperationsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(
    Boolean(quantity || note || tags?.length)
  );
  const [isNew, setIsNew] = useState<boolean>(!(transaction instanceof OperationTransaction));

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
        result = operationsRepository.createTransaction(transaction, data);
      } else {
        const changes: UpdateTransactionChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = operationsRepository.updateTransaction(transaction as OperationTransaction, changes);
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
    [enqueueSnackbar, operationsRepository, onClose, transaction, isNew]
  );

  const handleDeleteClick = () => {
    operationsRepository
      .deleteTransaction(transaction as OperationTransaction)
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
        categoryId: Yup.mixed().test('categoryId', t('Please select category'), value => Boolean(value)),
        quantity: Yup.mixed().test('quantity', t('Please enter a number'), value => !value || (value && !isNaN(value))),
      }),
    []
  );

  const handleShowAdditionalFieldsClick = () => {
    setIsShowAdditionalFields(isShow => !isShow);
  };

  const isPlanned = false;
  return (
    <Form<TransactionFormValues>
      onSubmit={onSubmit}
      initialValues={{
        sign: String(sign) as any,
        amount: amount ? String(amount) : '',
        moneyId: money?.id ?? moneysRepository.moneys[0].id,
        categoryId: category?.id ?? null,
        accountId: account?.id ?? accountsRepository.accounts[0].id,
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
          <DateField name="transactionDate" label={t('Date')} dateFormat="date.formats.fullDateWithDayOfWeek" />

          <DateField
            name="reportPeriod"
            label={t('Period')}
            dateFormat="date.formats.month"
            showMonthYearPicker
            className={styles.dateFields__reportPeriod}
          />
        </div>

        <div className={styles.additional__header} onClick={handleShowAdditionalFieldsClick}>
          <div className={styles.additional__title}>
            {isShowAdditionalFields ? t('Hide additional fields') : t('Show additional fields')}
            <ChevronRightIcon
              className={clsx(styles.additional__icon, isShowAdditionalFields && styles.additional__icon_expended)}
            />
          </div>
          <div className={styles.additional__description}>{t('Quantity, Not confirmed, Note, Tags')}</div>
        </div>
        <div>
          <Accordion isExpanded={isShowAdditionalFields} className={styles.additional__fields}>
            <QuantityField quantityFieldName="quantity" unitFieldName="unitId" label={t('Quantity')} />
            <FormCheckbox name="isNotConfirmed">{t('Not confirmed operation')}</FormCheckbox>
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
    </Form>
  );
}
