import React, { useCallback, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { FormikHelpers, useFormikContext } from 'formik';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { AccountsRepository } from '../../../stores/accounts-repository';
import { AmountField } from '../../AmountField/AmountField';
import { CashFlowItem } from '../../../stores/models/cash-flow-item';
import { CashFlowsRepository } from '../../../stores/cash-flows-repository';
import { CategoriesRepository } from '../../../stores/categories-repository';
import { CreateCashFlowItemData, ICashFlowItem, UpdateCashFlowItemChanges } from '../../../types/cash-flow';
import {
  Form,
  FormBody,
  FormButton,
  FormCheckbox,
  FormDateField,
  FormFooter,
  FormHeader,
  FormSelect,
  FormTabs,
  FormTextAreaField,
  IFormButton,
} from '../../../components/Form';
import { HtmlTooltip } from '../../../components/HtmlTooltip/HtmlTooltip';
import { ITabOption } from '../../../components/Tabs/Tabs';
import { IconButton, ISelectOption, QuestionIcon, Target } from '@finex/ui-kit';
import { Link } from '../../../components/Link/Link';
import { MoneysRepository } from '../../../stores/moneys-repository';
import { QuantityField } from '../../QuantityField/QuantityField';
import { Shape, Sign } from '../../../types';
import { TagsRepository } from '../../../stores/tags-repository';
import { getFormat, getT } from '../../../lib/core/i18n';
import { getPatch } from '../../../lib/core/get-patch';
import { noop } from '../../../lib/noop';
import { useStore } from '../../../core/hooks/use-store';

import styles from './CashFlowItemWindow.module.scss';

interface CashFlowItemFormValues {
  sign: '1' | '-1';
  amount: string;
  moneyId: string;
  categoryId: string | null;
  accountId: string;
  cashFlowItemDate: Date;
  reportPeriod: Date;
  quantity: string;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tagIds: string[];
  isOnlySave: boolean;
}

interface CashFlowItemWindowProps {
  cashFlowItem: ({ cashFlowId: string } & Partial<ICashFlowItem>) | CashFlowItem;
  onClose: () => unknown;
}

const t = getT('CashFlowItem');

function mapValuesToCreatePayload({
  sign,
  amount,
  moneyId,
  categoryId,
  accountId,
  cashFlowItemDate,
  reportPeriod,
  quantity,
  unitId,
  isNotConfirmed,
  note,
  tagIds,
}: CashFlowItemFormValues): CreateCashFlowItemData {
  return {
    sign: Number(sign) as Sign,
    amount: Number(amount),
    moneyId,
    categoryId: categoryId!,
    accountId,
    cashFlowItemDate: format(cashFlowItemDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    quantity: quantity ? Number(quantity) : null,
    unitId: unitId || null,
    isNotConfirmed,
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
  cashFlowItemDate,
  reportPeriod,
  quantity,
  unitId,
  isNotConfirmed,
  note,
  tagIds,
}: CashFlowItemFormValues): UpdateCashFlowItemChanges {
  return {
    sign: Number(sign) as Sign,
    amount: Number(amount),
    moneyId,
    categoryId: categoryId!,
    accountId,
    cashFlowItemDate: format(cashFlowItemDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    quantity: quantity ? Number(quantity) : null,
    unitId: unitId || null,
    isNotConfirmed,
    note,
    tags: tagIds,
  };
}

export function CashFlowItemWindow({ cashFlowItem, onClose }: CashFlowItemWindowProps): JSX.Element {
  const signOptions: ITabOption[] = useMemo(
    () => [
      { value: '1', label: t('Income') },
      { value: '-1', label: t('Expense') },
    ],
    []
  );

  const accountsRepository = useStore(AccountsRepository);
  const categoriesRepository = useStore(CategoriesRepository);
  const debtsRepository = useStore(CashFlowsRepository);
  const moneysRepository = useStore(MoneysRepository);
  const tagsRepository = useStore(TagsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(!(cashFlowItem instanceof CashFlowItem));

  const amountFieldRef = useRef<HTMLInputElement | null>(null);

  const amountFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      amountFieldRef.current = node;
      amountFieldRef.current.focus();
    }
  }, []);

  const onSubmit = useCallback(
    (
      values: CashFlowItemFormValues,
      { resetForm }: FormikHelpers<CashFlowItemFormValues>,
      initialValues: CashFlowItemFormValues
    ) => {
      let result: Promise<unknown>;
      if (isNew) {
        const data: CreateCashFlowItemData = mapValuesToCreatePayload(values);
        result = debtsRepository.createCashFlowItem(cashFlowItem.cashFlowId, data);
      } else {
        const changes: UpdateCashFlowItemChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = debtsRepository.updateCashFlowItem(cashFlowItem as CashFlowItem, changes);
      }

      return result
        .then(() => {
          if (values.isOnlySave) {
            onClose();
          } else {
            const { sign, moneyId, categoryId, accountId, cashFlowItemDate, reportPeriod, isNotConfirmed } = values;
            resetForm({
              values: {
                sign,
                amount: '',
                moneyId,
                categoryId,
                accountId,
                cashFlowItemDate,
                reportPeriod,
                unitId: null,
                quantity: '',
                isNotConfirmed,
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
    [enqueueSnackbar, debtsRepository, onClose, cashFlowItem, isNew]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<CashFlowItemFormValues>>({
        cashFlowItemDate: Yup.date().required('Please select date'),
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
    // TODO Implement an empty screen
    return (
      <div>
        {t('At first,')} <Link href="/accounts">{t('create')}</Link> {t('at least one account.')}
      </div>
    );
  }

  const {
    sign,
    amount,
    money,
    category,
    account,
    cashFlowItemDate,
    reportPeriod,
    quantity,
    unit,
    isNotConfirmed,
    note,
    tags,
  } = cashFlowItem;

  return (
    <Form<CashFlowItemFormValues>
      onSubmit={onSubmit}
      initialValues={{
        sign: String(sign) as any,
        amount: amount ? String(amount) : '',
        moneyId: money?.id ?? moneysRepository.moneys[0].id,
        categoryId: category?.id ?? null,
        accountId: account?.id ?? accountsRepository.accounts[0].id,
        cashFlowItemDate: cashFlowItemDate ? parseISO(cashFlowItemDate) : new Date(),
        reportPeriod: reportPeriod ? parseISO(reportPeriod) : new Date(),
        quantity: quantity ? String(quantity) : '',
        unitId: unit?.id ?? null,
        isNotConfirmed: isNotConfirmed ?? false,
        note: note ?? '',
        tagIds: tags ? tags.map(tag => tag.id) : [],
        isOnlySave: false,
      }}
      validationSchema={validationSchema}
    >
      <FormHeader title={isNew ? t('Add new transaction') : t('Edit transaction')} onClose={onClose} />

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
            name="cashFlowItemDate"
            label={t('Date')}
            dateFormat={getFormat('date.formats.default')}
            className={styles.dateFields__date}
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

          <div className={clsx(styles.additional__fields, !isShowAdditionalFields && styles.additional__fields_hidden)}>
            <QuantityField />
            <div className={styles.notConfirmedField}>
              <FormCheckbox name="isNotConfirmed" label={t('Not confirmed operation')} />
              <HtmlTooltip
                title={
                  <div>
                    <p>
                      {t(
                        'A not confirmed transaction will be marked in a journal yellow color. The overdue and not confirmed operation will be marked red.'
                      )}
                    </p>
                    <p>{t('Otherwise, they are no different from ordinary operations.')}</p>
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
      </FormBody>

      <FormFooter>
        <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
          {t('Cancel')}
        </FormButton>
        <div className={styles.footer__rightButtons}>
          <SaveButton variant="outlined" isIgnoreValidation>
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

function SaveButton(props: IFormButton): JSX.Element {
  const { setFieldValue, handleSubmit } = useFormikContext();
  const handleClick = () => {
    setFieldValue('isOnlySave', true);
    handleSubmit();
  };

  return <FormButton {...props} onClick={handleClick} />;
}