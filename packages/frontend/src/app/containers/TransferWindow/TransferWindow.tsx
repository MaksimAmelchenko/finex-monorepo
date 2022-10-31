import React, { useCallback, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { FormikHelpers, useFormikContext } from 'formik';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { AccountsRepository } from '../../stores/accounts-repository';
import { AmountField } from '../AmountField/AmountField';
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
  FormTextAreaField,
  IFormButton,
} from '../../components/Form';
import { HtmlTooltip } from '../../components/HtmlTooltip/HtmlTooltip';
import { IconButton, ISelectOption, QuestionIcon, Target } from '@finex/ui-kit';
import { Link } from '../../components/Link/Link';
import { MoneysRepository } from '../../stores/moneys-repository';
import { Shape } from '../../types';
import { TagsRepository } from '../../stores/tags-repository';
import { Transfer } from '../../stores/models/transfer';
import { TransfersRepository } from '../../stores/transfers-repository';
import { getFormat, getT } from '../../lib/core/i18n';
import { getPatch } from '../../lib/core/get-patch';
import { noop } from '../../lib/noop';
import { useStore } from '../../core/hooks/use-store';

import styles from './TransferWindow.module.scss';

interface TransferFormValues {
  amount: string;
  moneyId: string;
  accountFromId: string;
  accountToId: string;
  transferDate: Date;
  reportPeriod: Date;
  isFee: boolean;
  fee: string;
  moneyFeeId: string | null;
  accountFeeId: string | null;
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
  accountFromId,
  accountToId,
  transferDate,
  reportPeriod,
  isFee,
  fee,
  moneyFeeId,
  accountFeeId,
  note,
  tagIds,
}: TransferFormValues): CreateTransferData {
  const data: CreateTransferData = {
    amount: Number(amount),
    moneyId,
    accountFromId,
    accountToId,
    transferDate: format(transferDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    note,
    tags: tagIds,
  };
  if (isFee) {
    if (!fee || !moneyFeeId || !accountFeeId) {
      throw new Error('Transfer form is corrupted');
    }

    data.fee = Number(fee);
    data.moneyFeeId = moneyFeeId;
    data.accountFeeId = accountFeeId;
  }
  return data;
}

function mapValuesToUpdatePayload({
  amount,
  moneyId,
  accountFromId,
  accountToId,
  transferDate,
  reportPeriod,
  isFee,
  fee,
  moneyFeeId,
  accountFeeId,
  note,
  tagIds,
}: TransferFormValues): UpdateTransferChanges {
  const changes: UpdateTransferChanges = {
    amount: Number(amount),
    moneyId,
    accountFromId,
    accountToId,
    transferDate: format(transferDate, 'yyyy-MM-dd'),
    reportPeriod: format(reportPeriod, 'yyyy-MM-01'),
    note,
    tags: tagIds,
  };

  if (isFee) {
    if (!moneyFeeId || !accountFeeId) {
      throw new Error('Transfer form is corrupted');
    }
    changes.fee = Number(fee);
    changes.moneyFeeId = moneyFeeId;
    changes.accountFeeId = accountFeeId;
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

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(!(transfer instanceof Transfer));

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
              accountFromId,
              accountToId,
              isFee,
              fee,
              moneyFeeId,
              accountFeeId,
              transferDate,
              reportPeriod,
            } = values;
            resetForm({
              values: {
                amount: '',
                moneyId,
                accountFromId,
                accountToId,
                transferDate,
                reportPeriod,
                isFee,
                fee: '',
                moneyFeeId,
                accountFeeId,
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
        transferDate: Yup.date().required('Please select date'),
        reportPeriod: Yup.date().required('Please select date'),
        fee: Yup.mixed().test('fee', t('Please fill fee'), function (value) {
          return !(this.parent.isFee && isNaN(value));
        }),
        accountFeeId: Yup.mixed().test('accountFeeId', t('Please select account'), function (value) {
          return !(this.parent.isFee && !value);
        }),
        accountToId: Yup.mixed().test(
          'accountToId',
          t('Please select an account other than the account you are transferring money from'),
          function (value) {
            return !(this.parent.accountFromId === value);
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

  const { amount, money, accountFrom, accountTo, transferDate, reportPeriod, fee, moneyFee, accountFee, note, tags } =
    transfer;

  const defaultMoney = moneysRepository.moneys[0];
  const defaultAccount = accountsRepository.accounts[0];
  return (
    <Form<TransferFormValues>
      onSubmit={onSubmit}
      initialValues={{
        amount: amount ? String(amount) : '',
        moneyId: money?.id ?? defaultMoney.id,
        accountFromId: accountFrom?.id ?? defaultAccount.id,
        accountToId: accountTo?.id ?? defaultAccount.id,
        transferDate: transferDate ? parseISO(transferDate) : new Date(),
        reportPeriod: reportPeriod ? parseISO(reportPeriod) : new Date(),
        isFee: Boolean(fee),
        fee: fee ? String(fee) : '',
        moneyFeeId: moneyFee?.id ?? defaultMoney.id,
        accountFeeId: accountFee?.id ?? null,
        note: note ?? '',
        tagIds: tags ? tags.map(tag => tag.id) : [],
        isOnlySave: false,
      }}
      validationSchema={validationSchema}
    >
      {({ values }) => (
        <>
          <FormHeader title={isNew ? t('Add new transfer record') : t('Edit transfer record')} onClose={onClose} />

          <FormBody className={styles.form__body}>
            <AmountField
              amountFieldName="amount"
              moneyFieldName="moneyId"
              label={t('Amount')}
              ref={amountFieldRefCallback}
              tabIndex={1}
            />
            <FormSelect name="accountFromId" label={t('From account')} options={selectAccountsOptions} />
            <FormSelect name="accountToId" label={t('To account')} options={selectAccountsOptions} />
            <div className={styles.dateFields}>
              <FormDateField
                name="transferDate"
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

            <FormCheckbox name="isFee">{t('Fee')}</FormCheckbox>

            <div className={clsx(styles.fee__fields, !values.isFee && styles.fee__fields_hidden)}>
              <AmountField amountFieldName="fee" moneyFieldName="moneyFeeId" label={t('Fee')} />
              <FormSelect name="accountFeeId" label={t('Fee account')} options={selectAccountsOptions} />
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
        </>
      )}
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
