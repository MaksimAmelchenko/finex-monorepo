import React, { useCallback, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { FormikHelpers, useFormikContext } from 'formik';
import { format, isDate, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { Account } from '../../stores/models/account';
import { AccountsRepository } from '../../stores/accounts-repository';
import { AmountField } from '../AmountField/AmountField';
import { CategoriesRepository } from '../../stores/categories-repository';
import { Category } from '../../stores/models/category';
import { ContractorsRepository } from '../../stores/contractors-repository';
import {
  CreatePlanTransactionData,
  IPlanTransaction,
  UpdatePlanTransactionChanges,
} from '../../types/plan-transaction';
import {
  Form,
  FormBody,
  FormButton,
  FormColorPickerField,
  FormDateField,
  FormFooter,
  FormHeader,
  FormSelect,
  FormTabs,
  FormTextAreaField,
  FormTextField,
  IFormButton,
} from '../../components/Form';
import { HtmlTooltip } from '../../components/HtmlTooltip/HtmlTooltip';
import { ITabOption } from '../../components/Tabs/Tabs';
import { IconButton, ISelectOption, CircleQuestionIcon, Target } from '@finex/ui-kit';
import { MoneysRepository } from '../../stores/moneys-repository';
import { PlanTransaction } from '../../stores/models/plan-transaction';
import { PlanTransactionsRepository } from '../../stores/plan-transactions-repository';
import { QuantityField } from '../QuantityField/QuantityField';
import { RepetitionType, TerminationType } from '../../types/plan';
import { Shape, Sign, TDate } from '../../types';
import { TagsRepository } from '../../stores/tags-repository';
import { getFormat, getT } from '../../lib/core/i18n';
import { getPatch } from '../../lib/core/get-patch';
import { noop } from '../../lib/noop';
import { useStore } from '../../core/hooks/use-store';

import styles from './PlanTransactionWindow.module.scss';

interface PlanTransactionFormValues {
  sign: '1' | '-1';
  amount: string;
  moneyId: string;
  categoryId: string | null;
  accountId: string;
  contractorId: string | null;
  quantity: string;
  unitId: string | null;
  startDate: Date;
  reportPeriod: Date;
  repetitionType: string;
  repetitionDaysOfWeek: string[];
  repetitionDaysOfMonth: string[];
  terminationType: string | null;
  repetitionCount: string;
  endDate: Date | null;
  note: string;
  operationNote: string;
  operationTagIds: string[];
  markerColor: string;
  isOnlySave: boolean;
}

interface PlanTransactionWindowProps {
  planTransaction: Partial<IPlanTransaction> | PlanTransaction;
  onClose: () => unknown;
}

const t = getT('PlanTransactionWindow');

interface MapValuesParams {
  repetitionType: string;
  repetitionDaysOfWeek: string[];
  repetitionDaysOfMonth: string[];
  terminationType: string | null;
  repetitionCount: string;
  endDate: Date | null;
}

interface MapValuesResponse {
  repetitionType: number;
  repetitionDays: number[] | null;
  terminationType: number | null;
  repetitionCount: number | null;
  endDate: TDate | null;
}

function mapValues(values: MapValuesParams): MapValuesResponse {
  const { repetitionDaysOfWeek, repetitionDaysOfMonth } = values;
  let repetitionType = Number(values.repetitionType);
  let repetitionDays: number[] | null = null;
  let terminationType: number | null = values.terminationType ? Number(values.terminationType) : null;
  let repetitionCount: number | null = null;
  let endDate: TDate | null = null;

  switch (repetitionType) {
    case RepetitionType.No: {
      terminationType = null;
      break;
    }
    case RepetitionType.Daily: {
      repetitionDays = repetitionDaysOfWeek.map(Number);
      break;
    }
    case RepetitionType.Monthly: {
      repetitionDays = repetitionDaysOfMonth.map(Number);
      break;
    }
  }

  switch (terminationType) {
    case TerminationType.After: {
      repetitionCount = Number(values.repetitionCount);
      break;
    }
    case TerminationType.EndDate: {
      endDate = values.endDate ? format(values.endDate, 'yyyy-MM-dd') : null;
      break;
    }
  }
  return {
    repetitionType,
    repetitionDays,
    terminationType,
    repetitionCount,
    endDate,
  };
}

function mapValuesToCreatePayload(values: PlanTransactionFormValues): CreatePlanTransactionData {
  const {
    sign,
    amount,
    moneyId,
    categoryId,
    accountId,
    contractorId,
    quantity,
    unitId,
    startDate,
    reportPeriod,
    repetitionDaysOfWeek,
    repetitionDaysOfMonth,
    note,
    operationNote,
    operationTagIds,
    markerColor,
  } = values;

  const { repetitionType, repetitionDays, terminationType, repetitionCount, endDate } = mapValues({
    repetitionType: values.repetitionType,
    repetitionDaysOfWeek,
    repetitionDaysOfMonth,
    terminationType: values.terminationType,
    repetitionCount: values.repetitionCount,
    endDate: values.endDate,
  });

  return {
    sign: Number(sign) as Sign,
    amount: Number(amount),
    moneyId,
    categoryId: categoryId!,
    accountId,
    contractorId,
    quantity: quantity ? Number(quantity) : null,
    unitId: unitId || null,
    startDate: format(startDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    repetitionType,
    repetitionDays,
    terminationType,
    repetitionCount,
    endDate,
    note,
    operationNote,
    operationTags: operationTagIds,
    markerColor: markerColor ? markerColor : null,
  };
}

function mapValuesToUpdatePayload(values: PlanTransactionFormValues): UpdatePlanTransactionChanges {
  const {
    sign,
    amount,
    moneyId,
    categoryId,
    accountId,
    contractorId,
    quantity,
    unitId,
    startDate,
    reportPeriod,
    repetitionDaysOfWeek,
    repetitionDaysOfMonth,
    note,
    operationNote,
    operationTagIds,
    markerColor,
  } = values;

  const { repetitionType, repetitionDays, terminationType, repetitionCount, endDate } = mapValues({
    repetitionType: values.repetitionType,
    repetitionDaysOfWeek,
    repetitionDaysOfMonth,
    terminationType: values.terminationType,
    repetitionCount: values.repetitionCount,
    endDate: values.endDate,
  });
  return {
    sign: Number(sign) as Sign,
    amount: Number(amount),
    moneyId,
    categoryId: categoryId!,
    accountId,
    contractorId,
    quantity: quantity ? Number(quantity) : null,
    unitId: unitId || null,
    startDate: format(startDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    repetitionType,
    repetitionDays,
    terminationType,
    repetitionCount,
    endDate,
    note,
    operationNote,
    operationTags: operationTagIds,
    markerColor: markerColor ? markerColor : null,
  };
}

const markerColors: string[] = [
  '',
  'bg-color-blue',
  'bg-color-blueLight',
  'bg-color-green',
  'bg-color-greenLight',
  'bg-color-yellow',
  'bg-color-orangeDark',
  'bg-color-pink',
  'bg-color-pinkDark',
  'bg-color-purple',
  'bg-color-magenta',
  'bg-color-redLight',
];

export function PlanTransactionWindow({ planTransaction, onClose }: PlanTransactionWindowProps): JSX.Element {
  const { sign, amount, money, category, account, contractor, quantity, unit } = planTransaction;
  const {
    startDate,
    reportPeriod,
    repetitionType = RepetitionType.No,
    repetitionDays,
    terminationType,
    repetitionCount,
    endDate,
    note,
    operationNote,
    operationTags,
    markerColor,
  } = planTransaction.plan || {};

  const accountsRepository = useStore(AccountsRepository);
  const contractorsRepository = useStore(ContractorsRepository);
  const categoriesRepository = useStore(CategoriesRepository);
  const moneysRepository = useStore(MoneysRepository);
  const planTransactionsRepository = useStore(PlanTransactionsRepository);
  const tagsRepository = useStore(TagsRepository);

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(
    Boolean(quantity || contractor || operationTags?.length || operationNote || note)
  );
  const { enqueueSnackbar } = useSnackbar();

  const amountFieldRef = useRef<HTMLInputElement | null>(null);
  const amountFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      amountFieldRef.current = node;
      amountFieldRef.current.focus();
    }
  }, []);

  const signOptions: ITabOption[] = useMemo(
    () => [
      { value: '1', label: t('Income') },
      { value: '-1', label: t('Expense') },
    ],
    []
  );

  const selectAccountsOptions = useMemo<ISelectOption[]>(
    () =>
      accountsRepository.accounts
        .filter(({ isEnabled }) => isEnabled)
        .map(({ id: value, name: label }) => ({ value, label })),
    [accountsRepository.accounts]
  );

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

  const selectRepetitionTypeOptions = useMemo<ISelectOption[]>(() => {
    return [
      { value: String(RepetitionType.No), label: t('No') },
      { value: String(RepetitionType.Daily), label: t('Daily') },
      { value: String(RepetitionType.Monthly), label: t('Monthly') },
      { value: String(RepetitionType.Quarterly), label: t('Quarterly') },
      { value: String(RepetitionType.Annually), label: t('Annually') },
    ];
  }, []);

  const selectRepetitionDaysOfWeekOptions = useMemo<ISelectOption[]>(() => {
    return [
      { value: '1', label: t('Mon') },
      { value: '2', label: t('Tue') },
      { value: '3', label: t('Wed') },
      { value: '4', label: t('Thu') },
      { value: '5', label: t('Fri') },
      { value: '6', label: t('Sat') },
      { value: '7', label: t('Sun') },
    ];
  }, []);

  const selectRepetitionDaysOfMonthOptions = useMemo<ISelectOption[]>(() => {
    return [...Array(31).keys()].map(index => ({ value: String(index + 1), label: String(index + 1) }));
  }, []);

  const selectTerminationTypeOptions = useMemo<ISelectOption[]>(() => {
    return [
      { value: String(TerminationType.Never), label: t('Never') },
      { value: String(TerminationType.After), label: t('After') },
      { value: String(TerminationType.EndDate), label: t('End date') },
    ];
  }, []);

  const selectContractorsOptions = useMemo<ISelectOption[]>(
    () => contractorsRepository.contractors.map(({ id: value, name: label }) => ({ value, label })),
    [contractorsRepository.contractors]
  );

  const selectTagsOptions = useMemo<ISelectOption[]>(
    () => tagsRepository.tags.map(({ id: value, name: label }) => ({ value, label })),
    [tagsRepository.tags]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<PlanTransactionFormValues>>({
        amount: Yup.mixed()
          .required(t('Please fill amount'))
          .test('amount', t('Please enter a number'), value => !isNaN(value)),
        categoryId: Yup.mixed().test('categoryId', t('Please select category'), value => Boolean(value)),
        startDate: Yup.date().required('Please select date'),
        reportPeriod: Yup.mixed()
          .test('reportPeriod', t('Please select date'), function (value) {
            return !(!value || !isDate(value));
          })
          .required('Please select date'),
        repetitionDaysOfWeek: Yup.mixed().test(
          'repetitionDaysOfWeek',
          t('Please enter the days of the week'),
          function (value) {
            return !(this.parent.repetitionType === String(RepetitionType.Daily) && value.length === 0);
          }
        ),
        repetitionDaysOfMonth: Yup.mixed().test(
          'repetitionDaysOfMonth',
          t('Please enter the days of the month'),
          function (value) {
            return !(this.parent.repetitionType === String(RepetitionType.Monthly) && value.length === 0);
          }
        ),
        terminationType: Yup.mixed().test('terminationType', t('Please select termination type'), function (value) {
          return !(this.parent.repetitionType !== String(RepetitionType.No) && !value);
        }),
        repetitionCount: Yup.mixed()
          .test('repetitionCount', t('Please enter the number of repetitions'), function (value) {
            return !(this.parent.terminationType === String(TerminationType.After) && !value);
          })
          .test('repetitionCount', t('Please enter a number'), function (value) {
            return !(this.parent.terminationType === String(TerminationType.After) && isNaN(Number(value)));
          })
          .test('repetitionCount', t('Please enter a number more then 1'), function (value) {
            return !(this.parent.terminationType === String(TerminationType.After) && Number(value) < 2);
          }),
        endDate: Yup.mixed()
          .test('endDate', t('Please enter the date'), function (value) {
            return !(this.parent.terminationType === String(TerminationType.EndDate) && (!value || !isDate(value)));
          })
          .test('endDate', t('Please enter an end date greater than the start date'), function (value) {
            return !(this.parent.terminationType === String(TerminationType.EndDate) && this.parent.startDate >= value);
          }),
        quantity: Yup.mixed().test('quantity', t('Please enter a number'), value => !value || (value && !isNaN(value))),
      }),
    []
  );

  const onSubmit = useCallback(
    (
      values: PlanTransactionFormValues,
      { resetForm }: FormikHelpers<PlanTransactionFormValues>,
      initialValues: PlanTransactionFormValues
    ) => {
      let result: Promise<unknown>;
      if (planTransaction instanceof PlanTransaction) {
        const changes: UpdatePlanTransactionChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = planTransactionsRepository.updatePlanTransaction(planTransaction, changes);
      } else {
        // create transaction
        const data: CreatePlanTransactionData = mapValuesToCreatePayload(values);
        result = planTransactionsRepository.createPlanTransaction(planTransaction, data);
      }

      return result
        .then(() => {
          if (values.isOnlySave) {
            onClose();
          } else {
            const {
              sign,
              moneyId,
              categoryId,
              accountId,
              contractorId,
              startDate,
              reportPeriod,
              repetitionType,
              repetitionDaysOfWeek,
              repetitionDaysOfMonth,
              terminationType,
              repetitionCount,
              endDate,
              markerColor,
            } = values;
            resetForm({
              values: {
                sign,
                amount: '',
                moneyId,
                categoryId,
                accountId,
                contractorId,
                unitId: null,
                quantity: '',
                startDate,
                reportPeriod,
                repetitionType,
                repetitionDaysOfWeek,
                repetitionDaysOfMonth,
                terminationType,
                repetitionCount,
                endDate,
                note: '',
                operationNote: '',
                operationTagIds: [],
                markerColor,
                isOnlySave: false,
              },
            });

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
    [enqueueSnackbar, planTransactionsRepository, onClose, planTransaction]
  );

  const handleShowAdditionalFieldsClick = () => setIsShowAdditionalFields(isShow => !isShow);

  return (
    <Form<PlanTransactionFormValues>
      onSubmit={onSubmit}
      initialValues={{
        sign: sign ? (String(sign) as any) : '-1',
        amount: amount ? String(amount) : '',
        moneyId: money?.id ?? moneysRepository.moneys[0].id,
        categoryId: category?.id ?? null,
        accountId: account?.id ?? accountsRepository.accounts[0].id,
        contractorId: contractor?.id ?? null,
        startDate: startDate ? parseISO(startDate) : new Date(),
        reportPeriod: reportPeriod ? parseISO(reportPeriod) : new Date(),
        quantity: quantity ? String(quantity) : '',
        unitId: unit?.id ?? null,
        repetitionType: String(repetitionType),
        repetitionDaysOfWeek:
          repetitionType === RepetitionType.Daily ? (repetitionDays ? repetitionDays.map(String) : []) : [],
        repetitionDaysOfMonth:
          repetitionType === RepetitionType.Monthly ? (repetitionDays ? repetitionDays.map(String) : []) : [],
        terminationType: terminationType !== null && terminationType !== undefined ? String(terminationType) : null,
        repetitionCount: repetitionCount ? String(repetitionCount) : '',
        endDate: endDate ? parseISO(endDate) : null,
        note: note ?? '',
        operationNote: operationNote ?? '',
        operationTagIds: operationTags ? operationTags.map(tag => tag.id) : [],
        markerColor: markerColor ?? '',
        isOnlySave: false,
      }}
      validationSchema={validationSchema}
    >
      {({ values }) => (
        <>
          <FormHeader
            title={
              planTransaction instanceof PlanTransaction ? t('Edit plan transaction') : t('Add new plan transaction')
            }
            onClose={onClose}
          />

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
                name="startDate"
                label={t('Start date')}
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
                    <CircleQuestionIcon />
                  </IconButton>
                </HtmlTooltip>
              </div>
            </div>

            <FormSelect name="repetitionType" label={t('Repetition type')} options={selectRepetitionTypeOptions} />

            {values.repetitionType === '1' && (
              <FormSelect
                isMulti
                name="repetitionDaysOfWeek"
                label={t('Repetition days')}
                options={selectRepetitionDaysOfWeekOptions}
              />
            )}

            {values.repetitionType === '2' && (
              <FormSelect
                isMulti
                name="repetitionDaysOfMonth"
                label={t('Repetition days')}
                options={selectRepetitionDaysOfMonthOptions}
              />
            )}

            {values.repetitionType !== '0' && (
              <div className={styles.terminationFields}>
                <FormSelect
                  className={styles.terminationFields__terminationType}
                  name="terminationType"
                  label={t('Termination type')}
                  options={selectTerminationTypeOptions}
                />

                {values.terminationType === '1' && (
                  <FormTextField name="repetitionCount" label={t('Repetition count')} />
                )}

                {values.terminationType === '2' && (
                  <FormDateField
                    name="endDate"
                    label={t('End date')}
                    dateFormat={getFormat('date.formats.default')}
                    className={styles.dateFields__dTransaction}
                  />
                )}
              </div>
            )}

            <div className={styles.additional}>
              <div>
                <Target
                  label={isShowAdditionalFields ? t('Hide additional fields') : t('Show additional fields')}
                  onClick={handleShowAdditionalFieldsClick}
                />
                <div className={styles.additional__description}>{t('Quantity, Counterparty, Note, Tags')}</div>
              </div>

              <div
                className={clsx(styles.additional__fields, !isShowAdditionalFields && styles.additional__fields_hidden)}
              >
                <QuantityField />

                <FormSelect
                  name="contractorId"
                  label={t('Counterparty')}
                  options={selectContractorsOptions}
                  isClearable
                />

                <FormTextAreaField name="operationNote" label={t('Transaction note')} minRows={1} />

                <FormSelect isMulti name="operationTagIds" label={t('Transaction tags')} options={selectTagsOptions} />

                <FormTextAreaField name="note" label={t('Note')} minRows={1} />

                <FormColorPickerField name="markerColor" colors={markerColors} />
              </div>
            </div>
          </FormBody>

          <FormFooter className={styles.footer}>
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
        </>
      )}
    </Form>
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
