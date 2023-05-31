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
import { CreateTransferData, UpdateTransferChanges } from '../../types/transfer';
import { DateField } from '../../components/DateField/DateField';
import { Form, FormBody, FormCheckbox, FormTextArea } from '../../components/Form';
import { IOperationTransfer } from '../../types/operation';
import { MoneysRepository } from '../../stores/moneys-repository';
import { OperationTransfer } from '../../stores/models/operation';
import { OperationsRepository } from '../../stores/operations-repository';
import { SaveButton } from '../../components/FormSaveButton/FormSaveButton';
import { Shape } from '../../types';
import { TagsField } from '../TagsFieldMobile/TagsField';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from '../OperationWindowMobile/OperationWindowMobile.module.scss';

interface TransferFormValues {
  amount: string;
  moneyId: string | null;
  fromAccountId: string | null;
  toAccountId: string | null;
  transferDate: Date;
  reportPeriod: Date;
  isFee: boolean;
  fee: string;
  feeMoneyId: string | null;
  feeAccountId: string | null;
  note: string;
  tagIds: string[];
  isOnlySave: boolean;
}

interface TransferWindowMobileProps {
  transfer: Partial<IOperationTransfer> | OperationTransfer;
  onClose: () => unknown;
}

const t = getT('TransferWindowMobile');

function mapValuesToCreatePayload(values: TransferFormValues): CreateTransferData {
  const {
    amount,
    moneyId,
    fromAccountId,
    toAccountId,
    transferDate,
    reportPeriod,
    isFee,
    fee,
    feeMoneyId,
    feeAccountId,
    note,
    tagIds,
  } = values;
  const data: CreateTransferData = {
    amount: Number(amount),
    moneyId: moneyId!,
    fromAccountId: fromAccountId!,
    toAccountId: toAccountId!,
    transferDate: format(transferDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    note,
    tags: tagIds,
  };
  if (isFee) {
    if (!fee || !feeMoneyId || !feeAccountId) {
      throw new Error('Transfer form is corrupted');
    }

    data.fee = Number(fee);
    data.feeMoneyId = feeMoneyId;
    data.feeAccountId = feeAccountId;
  }
  return data;
}

function mapValuesToUpdatePayload(values: TransferFormValues): UpdateTransferChanges {
  const {
    amount,
    moneyId,
    fromAccountId,
    toAccountId,
    transferDate,
    reportPeriod,
    isFee,
    fee,
    feeMoneyId,
    feeAccountId,
    note,
    tagIds,
  } = values;
  const changes: UpdateTransferChanges = {
    amount: Number(amount),
    moneyId: moneyId!,
    fromAccountId: fromAccountId!,
    toAccountId: toAccountId!,
    transferDate: format(transferDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    note,
    tags: tagIds,
  };

  if (isFee) {
    if (!feeMoneyId || !feeAccountId) {
      throw new Error('Transfer form is corrupted');
    }
    changes.fee = Number(fee);
    changes.feeMoneyId = feeMoneyId;
    changes.feeAccountId = feeAccountId;
  } else {
    changes.isFee = false;
  }

  return changes;
}

export function TransferWindowMobile({ transfer, onClose }: TransferWindowMobileProps): JSX.Element {
  const {
    //
    amount,
    money,
    fromAccount,
    toAccount,
    transferDate,
    reportPeriod,
    fee,
    feeMoney,
    feeAccount,
    note,
    tags,
  } = transfer;

  const accountsRepository = useStore(AccountsRepository);
  const moneysRepository = useStore(MoneysRepository);
  const operationsRepository = useStore(OperationsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(Boolean(note || tags?.length));
  const [isNew, setIsNew] = useState<boolean>(!(transfer instanceof OperationTransfer));

  useEffect(() => {
    analytics.view({
      page_title: 'transfer-mobile',
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
      values: TransferFormValues,
      { resetForm }: FormikHelpers<TransferFormValues>,
      initialValues: TransferFormValues
    ) => {
      let result: Promise<OperationTransfer>;
      if (isNew) {
        // create transfer
        const data: CreateTransferData = mapValuesToCreatePayload(values);
        result = operationsRepository.createTransfer(data).then(transfer => {
          operationsRepository.setLastOperationId(transfer.id);
          return transfer;
        });
      } else {
        const changes: UpdateTransferChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = operationsRepository.updateTransfer(transfer as OperationTransfer, changes);
      }

      return result
        .then(() => {
          if (values.isOnlySave) {
            onClose();
          } else {
            const {
              amount,
              moneyId,
              fromAccountId,
              toAccountId,
              isFee,
              fee,
              feeMoneyId,
              feeAccountId,
              transferDate,
              reportPeriod,
            } = values;
            resetForm({
              values: {
                amount: '',
                moneyId,
                fromAccountId,
                toAccountId,
                transferDate,
                reportPeriod,
                isFee,
                fee: '',
                feeMoneyId,
                feeAccountId,
                note: '',
                tagIds: [],
                isOnlySave: false,
              },
            });
            setIsNew(true);
            amountFieldRef.current?.focus();
            enqueueSnackbar(t('Transfer has been saved'), { variant: 'success' });
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
    [enqueueSnackbar, operationsRepository, onClose, transfer, isNew]
  );

  const handleDeleteClick = () => {
    operationsRepository
      .deleteTransfer(transfer as OperationTransfer)
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
      Yup.object<Shape<TransferFormValues>>({
        amount: Yup.mixed()
          .required(t('Please fill amount'))
          .test('amount', t('Please enter a number'), value => !isNaN(value)),
        moneyId: Yup.mixed().test('moneyId', t('Please select money'), value => Boolean(value)),
        transferDate: Yup.date().required(t('Please select date')),
        reportPeriod: Yup.date().required(t('Please select date')),
        fee: Yup.mixed().test('fee', t('Please fill fee'), function (value) {
          return !(this.parent.isFee && isNaN(value));
        }),
        feeAccountId: Yup.mixed().test('feeAccountId', t('Please select account'), function (value) {
          return !(this.parent.isFee && !value);
        }),
        fromAccountId: Yup.mixed().test('fromAccountId', t('Please select account'), value => Boolean(value)),
        toAccountId: Yup.mixed()
          .test('toAccountId', t('Please select account'), value => Boolean(value))
          .test(
            'toAccountId',
            t('Please select an account other than the account you are transferring money from'),
            function (value) {
              return !(this.parent.fromAccountId === value);
            }
          ),
      }),
    []
  );

  const handleShowAdditionalFieldsClick = () => {
    setIsShowAdditionalFields(isShow => !isShow);
  };

  const defaultMoney = moneysRepository.availableMoneys[0];
  const defaultAccount = accountsRepository.availableAccounts[0];

  return (
    <Form<TransferFormValues>
      onSubmit={onSubmit}
      initialValues={{
        amount: amount ? String(amount) : '',
        moneyId: money?.id ?? defaultMoney?.id ?? null,
        fromAccountId: fromAccount?.id ?? defaultAccount?.id ?? null,
        toAccountId: toAccount?.id ?? null,
        transferDate: transferDate ? parseISO(transferDate) : new Date(),
        reportPeriod: reportPeriod ? parseISO(reportPeriod) : new Date(),
        isFee: Boolean(fee),
        fee: fee ? String(fee) : '',
        feeMoneyId: feeMoney?.id ?? defaultMoney?.id ?? null,
        feeAccountId: feeAccount?.id ?? null,
        note: note ?? '',
        tagIds: tags ? tags.map(tag => tag.id) : [],
        isOnlySave: false,
      }}
      validationSchema={validationSchema}
      name="transfer-mobile"
    >
      {({ values }) => (
        <>
          <Header
            title={isNew ? t('Add transfer') : t('Edit transfer')}
            startAdornment={<BackButton onClick={onClose} />}
            endAdornment={!isNew && <DeleteButton onClick={handleDeleteClick} />}
          />
          <FormBody className={styles.main}>
            <AmountField
              amountFieldName="amount"
              moneyFieldName="moneyId"
              label={t('Amount')}
              ref={amountFieldRefCallback}
            />

            <AccountField name="fromAccountId" label={t('From account')} />

            <AccountField name="toAccountId" label={t('To account')} />

            <div className={styles.dateFields}>
              <DateField name="transferDate" label={t('Date')} dateFormat="date.format.fullDateWithDayOfWeek" />

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
                <AmountField amountFieldName="fee" moneyFieldName="feeMoneyId" label={t('Fee')} />
                <AccountField name="feeAccountId" label={t('Fee account')} />
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
        </>
      )}
    </Form>
  );
}
