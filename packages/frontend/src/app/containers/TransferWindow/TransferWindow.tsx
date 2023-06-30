import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { FormikHelpers } from 'formik';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { AccountsRepository } from '../../stores/accounts-repository';
import { AmountField } from '../AmountField/AmountField';
import { CircleQuestionIcon, IconButton, ISelectOption, PlusIcon, Target, Wallet01Icon } from '@finex/ui-kit';
import { CreateTransferData, ITransfer, UpdateTransferChanges } from '../../types/transfer';
import {
  Form,
  FormBody,
  FormButton,
  FormCheckbox,
  FormDateField,
  FormFooter,
  FormHeader,
  FormSelect,
  FormTextArea,
} from '../../components/Form';
import { HtmlTooltip } from '../../components/HtmlTooltip/HtmlTooltip';
import { Link } from '../../components/Link/Link';
import { MoneysRepository } from '../../stores/moneys-repository';
import { SaveButton } from '../../components/FormSaveButton/FormSaveButton';
import { Shape } from '../../types';
import { TagsRepository } from '../../stores/tags-repository';
import { Transfer } from '../../stores/models/transfer';
import { TransfersRepository } from '../../stores/transfers-repository';
import { analytics } from '../../lib/analytics';
import { getFormat, getT } from '../../lib/core/i18n';
import { getPatch } from '../../lib/core/get-patch';
import { noop } from '../../lib/noop';
import { useCloseOnEscape } from '../../hooks/use-close-on-escape';
import { useStore } from '../../core/hooks/use-store';

import styles from './TransferWindow.module.scss';

interface TransferFormValues {
  amount: string;
  moneyId: string;
  fromAccountId: string;
  toAccountId: string;
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

interface TransferWindowProps {
  transfer: Partial<ITransfer> | Transfer;
  onClose: () => unknown;
}

const t = getT('TransferWindow');

function mapValuesToCreatePayload({
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
}: TransferFormValues): CreateTransferData {
  const data: CreateTransferData = {
    amount: Number(amount),
    moneyId,
    fromAccountId,
    toAccountId,
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

function mapValuesToUpdatePayload({
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
}: TransferFormValues): UpdateTransferChanges {
  const changes: UpdateTransferChanges = {
    amount: Number(amount),
    moneyId,
    fromAccountId,
    toAccountId,
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

export function TransferWindow({ transfer, onClose }: TransferWindowProps): JSX.Element {
  const accountsRepository = useStore(AccountsRepository);
  const moneysRepository = useStore(MoneysRepository);
  const tagsRepository = useStore(TagsRepository);
  const transfersRepository = useStore(TransfersRepository);

  const { enqueueSnackbar } = useSnackbar();
  const { onCanCloseChange } = useCloseOnEscape({ onClose });

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(!(transfer instanceof Transfer));

  useEffect(() => {
    analytics.view({
      page_title: 'transfer',
    });
  }, []);

  const amountFieldRef = useRef<HTMLInputElement | null>(null);

  const amountFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      amountFieldRef.current = node;
      amountFieldRef.current.focus();
    }
  }, []);

  const onSubmit = useCallback(
    (
      values: TransferFormValues,
      { resetForm }: FormikHelpers<TransferFormValues>,
      initialValues: TransferFormValues
    ) => {
      let result: Promise<unknown>;
      if (isNew) {
        const data: CreateTransferData = mapValuesToCreatePayload(values);
        result = transfersRepository.createTransfer(data);
      } else {
        const changes: UpdateTransferChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = transfersRepository.updateTransfer(transfer as Transfer, changes);
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
    [enqueueSnackbar, transfersRepository, onClose, transfer, isNew]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<TransferFormValues>>({
        amount: Yup.mixed()
          .required(t('Please fill amount'))
          .test('amount', t('Please enter a number'), value => !isNaN(value)),
        transferDate: Yup.date().required(t('Please select date')),
        reportPeriod: Yup.date().required(t('Please select date')),
        fee: Yup.mixed().test('fee', t('Please fill fee'), function (value) {
          return !(this.parent.isFee && isNaN(value));
        }),
        feeAccountId: Yup.mixed().test('feeAccountId', t('Please select account'), function (value) {
          return !(this.parent.isFee && !value);
        }),
        toAccountId: Yup.mixed().test(
          'toAccountId',
          t('Please select an account other than the account you are transferring money from'),
          function (value) {
            return !(this.parent.fromAccountId === value);
          }
        ),
      }),
    []
  );

  const selectAccountsOptions = useMemo<ISelectOption[]>(() => {
    return accountsRepository.accounts
      .filter(({ isEnabled }) => isEnabled)
      .map(({ id: value, name: label }) => ({ value, label }));
  }, [accountsRepository.accounts]);

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

  const { amount, money, fromAccount, toAccount, transferDate, reportPeriod, fee, feeMoney, feeAccount, note, tags } =
    transfer;

  const defaultMoney = moneysRepository.availableMoneys[0];
  const defaultAccount = accountsRepository.availableAccounts[0];
  return (
    <Form<TransferFormValues>
      onSubmit={onSubmit}
      initialValues={{
        amount: amount ? String(amount) : '',
        moneyId: money?.id ?? defaultMoney.id,
        fromAccountId: fromAccount?.id ?? defaultAccount.id,
        toAccountId: toAccount?.id ?? defaultAccount.id,
        transferDate: transferDate ? parseISO(transferDate) : new Date(),
        reportPeriod: reportPeriod ? parseISO(reportPeriod) : new Date(),
        isFee: Boolean(fee),
        fee: fee ? String(fee) : '',
        feeMoneyId: feeMoney?.id ?? defaultMoney.id,
        feeAccountId: feeAccount?.id ?? null,
        note: note ?? '',
        tagIds: tags ? tags.map(tag => tag.id) : [],
        isOnlySave: false,
      }}
      validationSchema={validationSchema}
      onDirtyChange={dirty => onCanCloseChange(!dirty)}
      name="transfer"
    >
      {({ values }) => (
        <>
          <FormHeader title={isNew ? t('Add new transfer record') : t('Edit transfer record')} onClose={onClose} />

          <FormBody>
            <AmountField
              amountFieldName="amount"
              moneyFieldName="moneyId"
              label={t('Amount')}
              ref={amountFieldRefCallback}
              tabIndex={1}
            />
            <FormSelect name="fromAccountId" label={t('From account')} options={selectAccountsOptions} />
            <FormSelect name="toAccountId" label={t('To account')} options={selectAccountsOptions} />
            <div className={styles.dateFields}>
              <FormDateField
                name="transferDate"
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

            <FormCheckbox name="isFee">{t('Fee')}</FormCheckbox>

            <div className={clsx(styles.fee__fields, !values.isFee && styles.fee__fields_hidden)}>
              <AmountField amountFieldName="fee" moneyFieldName="feeMoneyId" label={t('Fee')} />
              <FormSelect name="feeAccountId" label={t('Fee account')} options={selectAccountsOptions} />
            </div>

            <div className={styles.additional}>
              <div>
                <Target
                  label={isShowAdditionalFields ? t('Hide additional fields') : t('Show additional fields')}
                  onClick={handleShowAdditionalFieldsClick}
                />
                <div className={styles.additional__description}>{t('Note, Tags')}</div>
              </div>

              <div
                className={clsx(styles.additional__fields, !isShowAdditionalFields && styles.additional__fields_hidden)}
              >
                <FormTextArea name="note" label={t('Note')} />
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
              <FormButton type="submit" variant="primary" isIgnoreValidation>
                {t('Save and Create New')}
              </FormButton>
            </div>
          </FormFooter>
        </>
      )}
    </Form>
  );
}
