import React, { useCallback, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import format from 'date-fns/format';
import { FormikHelpers, useFormikContext } from 'formik';

import { AccountsRepository } from '../../stores/accounts-repository';
import { AmountField } from '../AmountField/AmountField';
import { ApiErrors } from '../../core/errors';
import { CategoriesRepository } from '../../stores/categories-repository';
import { CreateIncomeExpenseTransactionData } from '../../types/income-expense-transaction';
import { Drawer } from '../../components/Drawer/Drawer';
import { DrawerFooter } from '../../components/Drawer/DrawerFooter';
import { Form, FormButton, FormCheckbox, FormError, FormLayout, IFormButton } from '../../components/Form';
import { FormDateField } from '../../components/Form/FormDateField/FormDateField';
import { FormSelect } from '../../components/Form/FormSelect/FormSelect';
import { FormTabs } from '../../components/Form/FormTabs/FormsTabs';
import { FormTextAreaField } from '../../components/Form/FormTextArea/FormTextField';
import { HtmlTooltip } from '../../components/HtmlTooltip/HtmlTooltip';
import { ITabOption } from '../../components/Tabs/Tabs';
import { IconButton, ISelectOption, PlusIcon, QuestionIcon, Target } from '@finex/ui-kit';
import { IncomeExpenseTransactionsRepository } from '../../stores/income-expense-transactions-repository';
import { MoneysRepository } from '../../stores/moneys-repository';
import { QuantityField } from '../QuantityField/QuantityField';
import { Shape, Sign } from '../../types';
import { TagsRepository } from '../../stores/tags-repository';
import { getFormat, getT } from '../../lib/core/i18n';
import { noop } from '../../lib/noop';
import { useStore } from '../../core/hooks/use-store';

import styles from './AddCashFlowTransaction.module.scss';

interface AddCashFlowTransactionFormValues {
  operationType: '1' | '2';
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
  isOnlySave: boolean;
}

interface AddCashFlowTransactionProps {
  isOpened: boolean;
  onClose: () => unknown;
}

const t = getT('AddCashFlowTransaction');

export function AddCashFlowTransaction({ isOpened, onClose }: AddCashFlowTransactionProps): JSX.Element {
  const operationType: ITabOption[] = useMemo(
    () => [
      { value: '1', label: t('Income') },
      { value: '2', label: t('Expense') },
    ],
    []
  );

  const accountsRepository = useStore(AccountsRepository);
  const categoriesRepository = useStore(CategoriesRepository);
  const moneysRepository = useStore(MoneysRepository);
  const tagsRepository = useStore(TagsRepository);
  const incomeExpenseTransactionsRepository = useStore(IncomeExpenseTransactionsRepository);
  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(false);

  const amountFieldRef = useRef<HTMLInputElement | null>(null);

  const handleOnOpen = useCallback(() => {
    amountFieldRef.current?.focus();
  }, []);

  const onSubmit = useCallback(
    (
      {
        categoryId,
        accountId,
        moneyId,
        unitId,
        transactionDate,
        reportPeriod,
        operationType,
        amount,
        quantity,
        note,
        tagIds,
        isNotConfirmed,
        isOnlySave,
      }: AddCashFlowTransactionFormValues,
      { resetForm, setFieldValue, setFieldTouched }: FormikHelpers<AddCashFlowTransactionFormValues>
    ) => {
      const data: CreateIncomeExpenseTransactionData = {
        sign: { '1': 1 as Sign, '2': -1 as Sign }[operationType],
        amount: Number(amount),
        moneyId,
        categoryId: categoryId!,
        accountId,
        contractorId: null,
        quantity: quantity ? Number(quantity) : null,
        unitId,
        transactionDate: format(transactionDate, 'yyyy-MM-dd'),
        reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
        note,
        tags: tagIds,
        isNotConfirmed,
        planId: null,
      };

      return incomeExpenseTransactionsRepository.addTransaction(data).then(() => {
        if (isOnlySave) {
          onClose();
        } else {
          resetForm({
            values: {
              operationType,
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
            },
          });

          amountFieldRef.current?.focus();
        }
      });
    },
    [incomeExpenseTransactionsRepository]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<AddCashFlowTransactionFormValues>>({
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
        .map(({ id: value }) => {
          const label = categoriesRepository.path(value, true);
          return { value, label };
        }),
    [categoriesRepository]
  );

  const selectTagsOptions = useMemo<ISelectOption[]>(() => {
    return tagsRepository.tags.map(({ id: value, name: label }) => ({ value, label }));
  }, [tagsRepository.tags]);

  const handleShowAdditionalFieldsClick = () => {
    setIsShowAdditionalFields(isShow => !isShow);
  };

  return (
    <Drawer isOpened={isOpened} title={t('Add new transaction')} onClose={onClose} onOpen={handleOnOpen}>
      <Form<AddCashFlowTransactionFormValues>
        onSubmit={onSubmit}
        initialValues={{
          operationType: '2',
          amount: '',
          moneyId: moneysRepository.moneys[0].id,
          categoryId: null,
          accountId: accountsRepository.accounts[0].id,
          transactionDate: new Date(),
          reportPeriod: new Date(),
          quantity: '',
          unitId: null,
          isNotConfirmed: false,
          note: '',
          tagIds: [],
          isOnlySave: false,
        }}
        validationSchema={validationSchema}
        errorsHR={[
          //
          [ApiErrors.InvalidRequest, t('Check data and try again')],
        ]}
        className={styles.form}
      >
        <div className={styles.form__bodyWrapper}>
          <FormLayout className={styles.form__body}>
            <FormTabs name="operationType" options={operationType} />
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
                    <IconButton onClick={() => {}} size="medium">
                      <QuestionIcon />
                    </IconButton>
                  </HtmlTooltip>
                </div>
                <FormTextAreaField name="note" label={t('Note')} />
                <FormSelect isMulti name="tagIds" label={t('Tags')} options={selectTagsOptions} />
              </div>
            </div>

            <FormError />
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
