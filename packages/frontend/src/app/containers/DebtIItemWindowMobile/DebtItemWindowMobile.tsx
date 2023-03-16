import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { FormikHelpers } from 'formik';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { Accordion, ChevronRightIcon, IOption } from '@finex/ui-kit';
import { AccountField } from '../AccountFieldMobile/AccountField';
import { AccountsRepository } from '../../stores/accounts-repository';
import { AmountField } from '../AmountFieldMobile/AmountField';
import { BackButton, DeleteButton, Header } from '../../components/Header/Header';
import { CategoriesRepository } from '../../stores/categories-repository';
import { CreateDebtItemData, UpdateDebtItemChanges } from '../../types/debt';
import { DateField } from '../../components/DateField/DateField';
import { Form, FormBody } from '../../components/Form';
import { FormSegmentedControl } from '../../components/Form/FormSegmentedControl/FormSegmentedControl';
import { FormSelectNative } from '../../components/Form/FormSelectNative/FormSelectNative';
import { FormTextAreaField } from '../../components/Form/FormTextArea2/FormTextArea';
import { IOperationDebtItem } from '../../types/operation';
import { ITabOption } from '../../components/Tabs/Tabs';
import { MoneysRepository } from '../../stores/moneys-repository';
import { OperationDebtItem } from '../../stores/models/operation';
import { OperationsRepository } from '../../stores/operations-repository';
import { SaveButton } from '../../components/FormSaveButton/FormSaveButton';
import { Shape, Sign } from '../../types';
import { TagsField } from '../TagsFieldMobile/TagsField';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from '../OperationWindowMobile/OperationWindowMobile.module.scss';

interface DebtItemFormValues {
  sign: '1' | '-1';
  amount: string;
  moneyId: string;
  categoryId: string | null;
  accountId: string;
  debtItemDate: Date;
  reportPeriod: Date;
  note: string;
  tagIds: string[];
  isOnlySave: boolean;
}

interface DebtItemWindowMobileProps {
  debtItem: Partial<IOperationDebtItem> | OperationDebtItem;
  onClose: () => unknown;
}

const t = getT('DebtItemWindowMobile');

function mapValuesToCreatePayload(values: DebtItemFormValues): CreateDebtItemData {
  const { sign, amount, moneyId, categoryId, accountId, debtItemDate, reportPeriod, note, tagIds } = values;
  return {
    sign: Number(sign) as Sign,
    amount: Number(amount),
    moneyId,
    categoryId: categoryId!,
    accountId,
    debtItemDate: format(debtItemDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    note,
    tags: tagIds,
  };
}

function mapValuesToUpdatePayload(values: DebtItemFormValues): UpdateDebtItemChanges {
  const { sign, amount, moneyId, categoryId, accountId, debtItemDate, reportPeriod, note, tagIds } = values;
  return {
    sign: Number(sign) as Sign,
    amount: Number(amount),
    moneyId,
    categoryId: categoryId!,
    accountId,
    debtItemDate: format(debtItemDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    note,
    tags: tagIds,
  };
}

export function DebtItemWindowMobile({ debtItem, onClose }: DebtItemWindowMobileProps): JSX.Element {
  const {
    //
    sign,
    amount,
    money,
    category,
    account,
    debtItemDate,
    reportPeriod,
    note,
    tags,
  } = debtItem;

  const signOptions: ITabOption[] = useMemo(
    () => [
      { value: '1', label: t('Income') },
      { value: '-1', label: t('Expense') },
    ],
    []
  );

  const accountsRepository = useStore(AccountsRepository);
  const categoriesRepository = useStore(CategoriesRepository);
  const moneysRepository = useStore(MoneysRepository);
  const operationsRepository = useStore(OperationsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(Boolean(note || tags?.length));
  const [isNew, setIsNew] = useState<boolean>(!(debtItem instanceof OperationDebtItem));

  const selectCategoriesOptions = useMemo<IOption[]>(() => {
    const { debtCategory } = categoriesRepository;
    return categoriesRepository.categories
      .filter(({ isEnabled, parent }) => isEnabled && parent === debtCategory)
      .map(({ id: value, name: label }) => ({ value, label }));
  }, [categoriesRepository]);

  useEffect(() => {
    analytics.view({
      page_title: 'debt-item-mobile',
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
      values: DebtItemFormValues,
      { resetForm }: FormikHelpers<DebtItemFormValues>,
      initialValues: DebtItemFormValues
    ) => {
      let result: Promise<unknown>;
      if (isNew) {
        // create debtItem
        const data: CreateDebtItemData = mapValuesToCreatePayload(values);
        // result = operationsRepository.createDebtItem(data);
        throw new Error('Adding is not implemented');
      } else {
        const changes: UpdateDebtItemChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = operationsRepository.updateDebtItem(debtItem as OperationDebtItem, changes);
      }

      return result
        .then(() => {
          if (values.isOnlySave) {
            onClose();
          } else {
            const { sign, moneyId, categoryId, accountId, debtItemDate, reportPeriod } = values;
            resetForm({
              values: {
                sign,
                amount: '',
                moneyId,
                categoryId,
                accountId,
                debtItemDate,
                reportPeriod,
                note: '',
                tagIds: [],
                isOnlySave: false,
              },
            });
            setIsNew(true);
            amountFieldRef.current?.focus();
            enqueueSnackbar(t('Debt has been saved'), { variant: 'success' });
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
    [enqueueSnackbar, operationsRepository, onClose, debtItem, isNew]
  );

  const handleDeleteClick = () => {
    operationsRepository
      .deleteDebtItem(debtItem as OperationDebtItem)
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
      Yup.object<Shape<DebtItemFormValues>>({
        debtItemDate: Yup.date().required(t('Please select date')),
        reportPeriod: Yup.date().required(t('Please select date')),
        amount: Yup.mixed()
          .required(t('Please fill amount'))
          .test('amount', t('Please enter a number'), value => !isNaN(value)),
        categoryId: Yup.mixed().test('categoryId', t('Please select category'), value => Boolean(value)),
      }),
    []
  );

  const handleShowAdditionalFieldsClick = () => {
    setIsShowAdditionalFields(isShow => !isShow);
  };

  const defaultMoney = moneysRepository.availableMoneys[0];
  const defaultAccount = accountsRepository.availableAccounts[0];

  return (
    <Form<DebtItemFormValues>
      onSubmit={onSubmit}
      initialValues={{
        sign: String(sign) as any,
        amount: amount ? String(amount) : '',
        moneyId: money?.id ?? defaultMoney.id,
        categoryId: category?.id ?? null, // TODO
        accountId: account?.id ?? defaultAccount.id,
        debtItemDate: debtItemDate ? parseISO(debtItemDate) : new Date(),
        reportPeriod: reportPeriod ? parseISO(reportPeriod) : new Date(),
        note: note ?? '',
        tagIds: tags ? tags.map(tag => tag.id) : [],
        isOnlySave: false,
      }}
      validationSchema={validationSchema}
      name="debt-item-mobile"
    >
      <Header
        title={isNew ? t('Add debt record') : t('Edit debt record')}
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

        <FormSelectNative name="categoryId" label={t('Category')} options={selectCategoriesOptions} />

        <AccountField name="accountId" label={t('Account')} />

        <div className={styles.dateFields}>
          <DateField name="debtItemDate" label={t('Date')} dateFormat="date.formats.fullDateWithDayOfWeek" />

          <DateField
            name="reportPeriod"
            label={t('Period')}
            dateFormat="date.formats.month"
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
    </Form>
  );
}
