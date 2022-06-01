import React, { useCallback, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { FormikHelpers, useFormikContext } from 'formik';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { AccountsRepository } from '../../stores/accounts-repository';
import { AmountField } from '../AmountField/AmountField';
import { ApiErrors } from '../../core/errors';
import { CategoriesRepository } from '../../stores/categories-repository';
import { CreateTransactionData, UpdateTransactionChanges } from '../../types/income-expense-transaction';
import { Drawer } from '../../components/Drawer/Drawer';
import { DrawerFooter } from '../../components/Drawer/DrawerFooter';
import { Form, FormButton, FormCheckbox, FormError, FormLayout, IFormButton } from '../../components/Form';
import { FormDateField } from '../../components/Form/FormDateField/FormDateField';
import { FormSelect } from '../../components/Form/FormSelect/FormSelect';
import { FormTabs } from '../../components/Form/FormTabs/FormsTabs';
import { FormTextAreaField } from '../../components/Form/FormTextArea/FormTextField';
import { HtmlTooltip } from '../../components/HtmlTooltip/HtmlTooltip';
import { ITabOption } from '../../components/Tabs/Tabs';
import { ITransaction } from '../../types/transaction';
import { IconButton, ISelectOption, QuestionIcon, Target } from '@finex/ui-kit';
import {
  IncomeExpenseTransaction,
  IncomeExpenseTransactionsRepository,
} from '../../stores/income-expense-transactions-repository';
import { Link } from '../../components/Link/Link';
import { MoneysRepository } from '../../stores/moneys-repository';
import { PlannedTransaction } from '../../stores/models/planned-transaction';
import { QuantityField } from '../QuantityField/QuantityField';
import { Shape, Sign } from '../../types';
import { TagsRepository } from '../../stores/tags-repository';
import { Transaction } from '../../stores/models/transaction';
import { getFormat, getT } from '../../lib/core/i18n';
import { getPatch } from '../../lib/core/get-path';
import { noop } from '../../lib/noop';
import { useStore } from '../../core/hooks/use-store';

import styles from './CashFlowTransactionWindow.module.scss';

interface CashFlowTransactionFormValues {
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

interface CashFlowTransactionWindowProps {
  isOpened: boolean;
  transaction: Partial<ITransaction> | IncomeExpenseTransaction;
  onClose: () => unknown;
}

const t = getT('CashFlowTransaction');

function mapValuesToCreatePayload({
  sign,
  amount,
  moneyId,
  categoryId,
  accountId,
  quantity,
  unitId,
  transactionDate,
  reportPeriod,
  note,
  tagIds,
  isNotConfirmed,
  planId,
}: CashFlowTransactionFormValues): CreateTransactionData {
  return {
    sign: Number(sign) as Sign,
    amount: Number(amount),
    moneyId,
    categoryId: categoryId!,
    accountId,
    contractorId: null,
    quantity: quantity ? Number(quantity) : null,
    unitId: unitId || null,
    transactionDate: format(transactionDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    note,
    tags: tagIds,
    isNotConfirmed,
    planId,
  };
}

function mapValuesToUpdatePayload({
  sign,
  amount,
  moneyId,
  categoryId,
  accountId,
  quantity,
  unitId,
  transactionDate,
  reportPeriod,
  note,
  tagIds,
  isNotConfirmed,
}: CashFlowTransactionFormValues): UpdateTransactionChanges {
  return {
    sign: Number(sign) as Sign,
    amount: Number(amount),
    moneyId,
    categoryId: categoryId!,
    accountId,
    quantity: quantity ? Number(quantity) : null,
    unitId: unitId || null,
    transactionDate: format(transactionDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    note,
    tags: tagIds,
    isNotConfirmed,
  };
}

export function CashFlowTransactionWindow({
  isOpened,
  transaction,
  onClose,
}: CashFlowTransactionWindowProps): JSX.Element {
  const signOptions: ITabOption[] = useMemo(
    () => [
      { value: '1', label: t('Income') },
      { value: '-1', label: t('Expense') },
    ],
    []
  );

  const accountsRepository = useStore(AccountsRepository);
  const categoriesRepository = useStore(CategoriesRepository);
  const incomeExpenseTransactionsRepository = useStore(IncomeExpenseTransactionsRepository);
  const moneysRepository = useStore(MoneysRepository);
  const tagsRepository = useStore(TagsRepository);

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const amountFieldRef = useRef<HTMLInputElement | null>(null);

  const handleOnOpen = useCallback(() => {
    amountFieldRef.current?.focus();
  }, []);

  const onSubmit = useCallback(
    (
      values: CashFlowTransactionFormValues,
      { resetForm }: FormikHelpers<CashFlowTransactionFormValues>,
      initialValues: CashFlowTransactionFormValues
    ) => {
      let result: Promise<unknown>;
      if (transaction instanceof Transaction) {
        const changes: UpdateTransactionChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = incomeExpenseTransactionsRepository.updateTransaction(transaction, changes);
      } else {
        // create transaction
        const data: CreateTransactionData = mapValuesToCreatePayload(values);
        result = incomeExpenseTransactionsRepository.createTransaction(transaction, data);
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
                unitId: null,
                quantity: '',
                note: '',
                tagIds: [],
                isNotConfirmed,
                isOnlySave: false,
                planId: null,
              },
            });

            amountFieldRef.current?.focus();
          }
        })
        .catch(err => {
          let message: string = '';
          switch (err.code) {
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [incomeExpenseTransactionsRepository, onClose, transaction]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<CashFlowTransactionFormValues>>({
        transactionDate: Yup.date().required('Please select date'),
        reportPeriod: Yup.date().required('Please select date'),
        amount: Yup.mixed()
          .required(t('Please fill amount'))
          .test('amount', t('Please enter a number'), value => !isNaN(value)),
        categoryId: Yup.mixed().test('categoryId', t('Please select category'), value => Boolean(value)),
        quantity: Yup.mixed().test('quantity', t('Please enter a number'), value => !value || (value && !isNaN(value))),
      }),
    []
  );

  const selectAccountsOptions = useMemo<ISelectOption[]>(() => {
    return accountsRepository.accounts
      .filter(({ isEnabled }) => isEnabled)
      .map(({ id: value, name: label }) => ({ value, label }));
  }, [accountsRepository.accounts]);

  const selectCategoriesOptions = useMemo<ISelectOption[]>(
    () =>
      categoriesRepository.categories
        .filter(({ isEnabled, isSystem }) => isEnabled && !isSystem)
        .map(category => {
          const label = category.fullPath(true);
          return { value: category.id, label };
        }),
    [categoriesRepository]
  );

  const selectTagsOptions = useMemo<ISelectOption[]>(() => {
    return tagsRepository.tags.map(({ id: value, name: label }) => ({ value, label }));
  }, [tagsRepository.tags]);

  const handleShowAdditionalFieldsClick = () => {
    setIsShowAdditionalFields(isShow => !isShow);
  };

  if (!accountsRepository.accounts.length) {
    return (
      <Drawer isOpened={isOpened} title="" onClose={onClose} onOpen={handleOnOpen}>
        <div>
          {t('At first,')} <Link href="/accounts">{t('create')}</Link> {t('at least one account.')}
        </div>
      </Drawer>
    );
  }

  const {
    sign,
    amount,
    money,
    category,
    account,
    transactionDate,
    reportPeriod,
    quantity,
    unit,
    isNotConfirmed,
    note,
    tags,
  } = transaction;

  return (
    <Drawer
      isOpened={isOpened}
      title={transaction instanceof Transaction ? t('Edit transaction') : t('Add new transaction')}
      onClose={onClose}
      onOpen={handleOnOpen}
    >
      <Form<CashFlowTransactionFormValues>
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
          isNotConfirmed: isNotConfirmed ?? false,
          note: note ?? '',
          tagIds: tags ? tags.map(tag => tag.id) : [],
          planId: transaction instanceof PlannedTransaction ? transaction.planId : null,

          isOnlySave: false,
        }}
        validationSchema={validationSchema}
        className={styles.form}
      >
        <div className={styles.form__bodyWrapper}>
          <FormLayout className={styles.form__body}>
            <FormTabs name="sign" options={signOptions} />
            <AmountField ref={amountFieldRef} tabIndex={1} />
            <div className={styles.categoryField}>
              <FormSelect name="categoryId" label={t('Category')} options={selectCategoriesOptions} tabIndex={2} />
              {/*<IconButton onClick={noop} tabIndex={-1}>*/}
              {/*  <PlusIcon />*/}
              {/*</IconButton>*/}
            </div>
            <FormSelect name="accountId" label={t('Account')} options={selectAccountsOptions} />
            <div className={styles.dateFields}>
              <FormDateField
                name="transactionDate"
                label={t('Date')}
                dateFormat={getFormat('date.formats.default')}
                className={styles.dateFields__dTransaction}
              />
              <div className={styles.reportPeriod}>
                <FormDateField
                  name="reportPeriod"
                  label={t('Period')}
                  dateFormat={getFormat('date.formats.month')}
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
                    <QuestionIcon />
                  </IconButton>
                </HtmlTooltip>
              </div>
            </div>

            <div className={styles.additional}>
              <div>
                <Target
                  label={isShowAdditionalFields ? t('Hide additional fields') : t('Show additional fields')}
                  onClick={handleShowAdditionalFieldsClick}
                />
                <div className={styles.additional__description}>{t('Quantity, Not confirmed, Note, Tags')}</div>
              </div>

              <div
                className={clsx(styles.additional__fields, !isShowAdditionalFields && styles.additional__fields_hidden)}
              >
                <QuantityField />
                <div className={styles.notConfirmedField}>
                  <FormCheckbox name="isNotConfirmed" label={t('Not confirmed operation')} />
                  <HtmlTooltip
                    title={
                      <div>
                        <p>
                          A not confirmed transaction will be marked in a journal yellow color. The overdue and not
                          confirmed operation will be marked red.
                        </p>
                        <p>Otherwise, they are no different from ordinary operations.</p>
                      </div>
                    }
                  >
                    <IconButton onClick={noop} size="medium">
                      <QuestionIcon />
                    </IconButton>
                  </HtmlTooltip>
                </div>
                <FormTextAreaField name="note" label={t('Note')} />
                <FormSelect isMulti name="tagIds" label={t('Tags')} options={selectTagsOptions} />
              </div>
            </div>
          </FormLayout>
        </div>
        <DrawerFooter className={styles.footer}>
          <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
            {t('Cancel')}
          </FormButton>
          <div className={styles.footer__rightButtons}>
            <SaveButton variant="outlined" isIgnoreValidation>
              {t('Save')}
            </SaveButton>
            <FormButton type="submit" color="secondary" isIgnoreValidation>
              {t('Save and Create New')}
            </FormButton>
          </div>
        </DrawerFooter>
      </Form>
    </Drawer>
  );
}

export const SaveButton = (props: IFormButton): JSX.Element => {
  const { setFieldValue, handleSubmit } = useFormikContext();
  const handleClick = () => {
    setFieldValue('isOnlySave', true);
    handleSubmit();
  };

  return <FormButton {...props} onClick={handleClick} />;
};
