import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { FormikHelpers } from 'formik';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { AccountsRepository } from '../../../stores/accounts-repository';
import { AmountField } from '../../AmountField/AmountField';
import { CategoriesRepository } from '../../../stores/categories-repository';
import { CircleQuestionIcon, IconButton, ISelectOption, Target } from '@finex/ui-kit';
import { CreateDebtItemData, IDebtItem, UpdateDebtItemChanges } from '../../../types/debt';
import { DebtItem } from '../../../stores/models/debt-item';
import { DebtsRepository } from '../../../stores/debts-repository';
import {
  Form,
  FormBody,
  FormButton,
  FormDateField,
  FormFooter,
  FormHeader,
  FormSelect,
  FormTabs,
  FormTextAreaField,
} from '../../../components/Form';
import { HtmlTooltip } from '../../../components/HtmlTooltip/HtmlTooltip';
import { ITabOption } from '../../../components/Tabs/Tabs';
import { Link } from '../../../components/Link/Link';
import { MoneysRepository } from '../../../stores/moneys-repository';
import { SaveButton } from '../../../components/FormSaveButton/FormSaveButton';
import { Shape, Sign } from '../../../types';
import { TagsRepository } from '../../../stores/tags-repository';
import { analytics } from '../../../lib/analytics';
import { getFormat, getT } from '../../../lib/core/i18n';
import { getPatch } from '../../../lib/core/get-patch';
import { noop } from '../../../lib/noop';
import { useCloseOnEscape } from '../../../hooks/use-close-on-escape';
import { useStore } from '../../../core/hooks/use-store';

import styles from './DebtItemWindow.module.scss';

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

interface DebtItemWindowProps {
  debtItem: ({ debtId: string } & Partial<IDebtItem>) | DebtItem;
  onClose: () => unknown;
}

const t = getT('DebtItem');

function mapValuesToCreatePayload({
  sign,
  amount,
  moneyId,
  categoryId,
  accountId,
  debtItemDate,
  reportPeriod,
  note,
  tagIds,
}: DebtItemFormValues): CreateDebtItemData {
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

function mapValuesToUpdatePayload({
  sign,
  amount,
  moneyId,
  categoryId,
  accountId,
  debtItemDate,
  reportPeriod,
  note,
  tagIds,
}: DebtItemFormValues): UpdateDebtItemChanges {
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

export function DebtItemWindow({ debtItem, onClose }: DebtItemWindowProps): JSX.Element {
  const signOptions: ITabOption[] = useMemo(
    () => [
      { value: '1', label: t('Income') },
      { value: '-1', label: t('Expense') },
    ],
    []
  );

  const accountsRepository = useStore(AccountsRepository);
  const categoriesRepository = useStore(CategoriesRepository);
  const debtsRepository = useStore(DebtsRepository);
  const moneysRepository = useStore(MoneysRepository);
  const tagsRepository = useStore(TagsRepository);

  const { enqueueSnackbar } = useSnackbar();
  const { onCanCloseChange } = useCloseOnEscape({ onClose });

  useEffect(() => {
    analytics.view({
      page_title: 'debt-item',
    });
  }, []);

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(!(debtItem instanceof DebtItem));

  const amountFieldRef = useRef<HTMLInputElement | null>(null);

  const amountFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      amountFieldRef.current = node;
      amountFieldRef.current.focus();
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
        const data: CreateDebtItemData = mapValuesToCreatePayload(values);
        result = debtsRepository.createDebtItem(debtItem.debtId, data);
      } else {
        const changes: UpdateDebtItemChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        const { debtId, id } = debtItem as DebtItem;
        result = debtsRepository.updateDebtItem(debtId, id, changes);
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
    [enqueueSnackbar, debtsRepository, onClose, debtItem, isNew]
  );

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

  const selectAccountsOptions = useMemo<ISelectOption[]>(() => {
    return accountsRepository.accounts
      .filter(({ isEnabled }) => isEnabled)
      .map(({ id: value, name: label }) => ({ value, label }));
  }, [accountsRepository.accounts]);

  const selectCategoriesOptions = useMemo<ISelectOption[]>(() => {
    const { debtCategory } = categoriesRepository;
    return categoriesRepository.categories
      .filter(({ isEnabled, parent }) => isEnabled && parent === debtCategory)
      .map(({ id: value, name: label }) => ({ value, label }));
  }, [categoriesRepository]);

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

  const { sign, amount, money, category, account, debtItemDate, reportPeriod, note, tags } = debtItem;

  return (
    <Form<DebtItemFormValues>
      onSubmit={onSubmit}
      initialValues={{
        sign: String(sign) as any,
        amount: amount ? String(amount) : '',
        moneyId: money?.id ?? moneysRepository.moneys[0].id,
        categoryId: category?.id ?? selectCategoriesOptions[0].value,
        accountId: account?.id ?? accountsRepository.accounts[0].id,
        debtItemDate: debtItemDate ? parseISO(debtItemDate) : new Date(),
        reportPeriod: reportPeriod ? parseISO(reportPeriod) : new Date(),
        note: note ?? '',
        tagIds: tags ? tags.map(tag => tag.id) : [],
        isOnlySave: false,
      }}
      validationSchema={validationSchema}
      onDirtyChange={dirty => onCanCloseChange(!dirty)}
      name="debt-item"
    >
      <FormHeader title={isNew ? t('Add new debt record') : t('Edit debt record')} onClose={onClose} />

      <FormBody className={styles.form__body}>
        <FormTabs name="sign" options={signOptions} />
        <AmountField
          amountFieldName="amount"
          moneyFieldName="moneyId"
          label={t('Amount')}
          ref={amountFieldRefCallback}
          tabIndex={1}
        />
        <div className={styles.categoryField}>
          <FormSelect name="categoryId" label={t('Category')} options={selectCategoriesOptions} tabIndex={2} />
          {/*<IconButton onClick={noop} tabIndex={-1}>*/}
          {/*  <PlusIcon />*/}
          {/*</IconButton>*/}
        </div>
        <FormSelect name="accountId" label={t('Account')} options={selectAccountsOptions} />
        <div className={styles.dateFields}>
          <FormDateField
            name="debtItemDate"
            label={t('Date')}
            dateFormat={getFormat('date.format.default')}
            className={styles.dateFields__dTransaction}
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

        <div className={styles.additional}>
          <div>
            <Target
              label={isShowAdditionalFields ? t('Hide additional fields') : t('Show additional fields')}
              onClick={handleShowAdditionalFieldsClick}
            />
            <div className={styles.additional__description}>{t('Note, Tags')}</div>
          </div>

          <div className={clsx(styles.additional__fields, !isShowAdditionalFields && styles.additional__fields_hidden)}>
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
    </Form>
  );
}
