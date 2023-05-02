import React, { Fragment, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Accordion, ChevronRightIcon } from '@finex/ui-kit';
import { BackButton, DeleteButton, Header } from '../../components/Header/Header';
import { CashFlow, ICashFlowItemsByDate } from '../../stores/models/cash-flow';
import { CashFlowItem } from '../../stores/models/cash-flow-item';
import { CashFlowsRepository } from '../../stores/cash-flows-repository';
import { ContractorField } from '../ContractorFieldMobile/ContractorField';
import { CreateCashFlowData, ICashFlow, ICashFlowItem, UpdateCashFlowChanges } from '../../types/cash-flow';
import { CreateTransactionData, UpdateTransactionChanges } from '../../types/transaction';
import { Form, FormBody, FormButton } from '../../components/Form';
import { FormTextAreaField } from '../../components/Form/FormTextArea2/FormTextArea';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { TagsField } from '../TagsFieldMobile/TagsField';
import { TransactionCard } from '../../components/TransactionCard/TransactionCard';
import { TransactionWindowMobile } from '../TransactionWindowMobile/TransactionWindowMobile';
import { analytics } from '../../lib/analytics';
import { formatDate, getT } from '../../lib/core/i18n';
import { getPatch } from '../../lib/core/get-patch';
import { useStore } from '../../core/hooks/use-store';

import styles from './CashFlowWindowMobile.module.scss';

interface CashFlowFormValues {
  contractorId: string | null;
  note: string;
  tagIds: string[];
}

interface CashFlowWindowMobileProps {
  cashFlow: Partial<Omit<ICashFlow, 'items'>> | CashFlow;
  onClose: () => unknown;
}

const t = getT('CashFlowWindowMobile');

function mapValuesToCreatePayload({ contractorId, note, tagIds }: CashFlowFormValues): CreateCashFlowData {
  return {
    contractorId,
    note,
    tags: tagIds,
  };
}

function mapValuesToUpdatePayload({ contractorId, note, tagIds }: CashFlowFormValues): UpdateCashFlowChanges {
  return {
    contractorId: contractorId ?? undefined,
    note,
    tags: tagIds,
  };
}

export const CashFlowWindowMobile = observer<CashFlowWindowMobileProps>(props => {
  const { onClose } = props;
  const cashFlowsRepository = useStore(CashFlowsRepository);

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(
    Boolean(props.cashFlow.note || props.cashFlow.tags?.length)
  );
  const [cashFlow, setCashFlow] = useState<Partial<ICashFlow> | CashFlow>(props.cashFlow);
  const [cashFlowItem, setCashFlowItem] = useState<Partial<ICashFlowItem> | CashFlowItem | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    analytics.view({
      page_title: 'cash-flow-mobile',
    });
  }, []);

  const isNew = !(cashFlow instanceof CashFlow);

  /*
  useEffect(() => {
    // if we've just created a new cashFlow, and it is still empty, then open a window to create a new cashFlow item
    if (!(props.cashFlow instanceof CashFlow) && cashFlow instanceof CashFlow && !cashFlow.items.length) {
      handleOpenAddCashFlowItem();
    }
  }, [cashFlow]);
  */

  const handleDeleteClick = () => {
    if (!window.confirm(t('Are you sure you want to delete Cash Flow?'))) {
      return;
    }
    cashFlowsRepository
      .removeCashFlow(cashFlow as CashFlow)
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

  const onSubmit = useCallback(
    (values: CashFlowFormValues, _: FormikHelpers<CashFlowFormValues>, initialValues: CashFlowFormValues) => {
      let result: Promise<CashFlow>;
      if (isNew) {
        const data: CreateCashFlowData = mapValuesToCreatePayload(values);
        result = cashFlowsRepository.createCashFlow(data);
      } else {
        const changes: UpdateCashFlowChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = cashFlowsRepository.updateCashFlow(cashFlow as CashFlow, changes);
      }

      return result
        .then(cashFlow => setCashFlow(cashFlow))
        .catch(err => {
          let message = '';
          switch (err.code) {
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [cashFlow, cashFlowsRepository, enqueueSnackbar, isNew]
  );

  const handleShowAdditionalFieldsClick = () => {
    setIsShowAdditionalFields(isShow => !isShow);
  };

  const handleOpenAddCashFlowItem = () => {
    if (!cashFlow.id) {
      return;
    }

    setCashFlowItem({
      cashFlowId: cashFlow.id,
      sign: -1,
    });
  };

  const handleCloseCashFlowItemWindow = () => {
    setCashFlowItem(null);
  };

  const handleClickOnCashFlow = useCallback(
    (cashFlowItemId: string) => {
      const cashFlowItem = cashFlow.items!.find(({ id }) => id === cashFlowItemId);
      if (cashFlowItem) {
        setCashFlowItem(cashFlowItem);
      }
    },
    [cashFlow.items]
  );

  const handleCreateTransaction = (data: CreateTransactionData) => {
    const { cashFlowId, transactionDate, planId, contractorId, ...rest } = data;
    if (!cashFlowId) {
      throw new Error('CashFlow ID is not set');
    }
    return cashFlowsRepository.createCashFlowItem(cashFlowId, { ...rest, cashFlowItemDate: transactionDate });
  };

  const handleUpdateTransaction = (cashFlowId: string, transactionId: string, changes: UpdateTransactionChanges) => {
    const { transactionDate: cashFlowItemDate, ...rest } = changes;
    return cashFlowsRepository.updateCashFlowItem(cashFlowId, transactionId, { ...rest, cashFlowItemDate });
  };

  const handleDeleteTransaction = (cashFlowId: string, transactionId: string) => {
    return cashFlowsRepository.removeCashFlowItem(cashFlowId, transactionId);
  };

  const { contractor, note, tags } = cashFlow;

  let cashFlowItemsByDates: ICashFlowItemsByDate[] = [];
  if (cashFlow instanceof CashFlow) {
    cashFlowItemsByDates = cashFlow.cashFlowItemsByDates;
  }

  return (
    <div className={styles.root}>
      <Header
        title={isNew ? t('Create new Cash Flow') : t('Edit Cash Flow')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={!isNew && <DeleteButton onClick={handleDeleteClick} />}
      />

      <main className={clsx(styles.root__main)}>
        <section className={styles.cashFlow}>
          <Form<CashFlowFormValues>
            onSubmit={onSubmit}
            initialValues={{
              contractorId: contractor?.id || null,
              note: note ?? '',
              tagIds: tags ? tags.map(tag => tag.id) : [],
            }}
            enableReinitialize
            className={styles.cashFlow__form}
            name="cash-flow-mobile"
          >
            {({ dirty }) => (
              <>
                <FormBody>
                  <ContractorField name="contractorId" label={t('Contractor')} />
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
                      <FormTextAreaField name="note" label={t('Note')} minRows={1} />
                      <TagsField name="tagIds" label={t('Tags')} />
                    </Accordion>
                  </div>
                </FormBody>

                <footer className={styles.cashFlow__footer}>
                  {(isNew || dirty) && (
                    <FormButton type="submit" variant="secondaryGray" isIgnoreValidation>
                      {isNew ? t('Create Cash Flow') : t('Save')}
                    </FormButton>
                  )}

                  {cashFlow.id && (
                    <FormButton type="button" variant="primary" isIgnoreValidation onClick={handleOpenAddCashFlowItem}>
                      {t('Add record')}
                    </FormButton>
                  )}
                </footer>
              </>
            )}
          </Form>
        </section>

        <section className={styles.cashFlowItems}>
          {cashFlowItemsByDates.map(cashFlowItemsByDate => {
            return (
              <Fragment key={cashFlowItemsByDate.date}>
                <div className={styles.section__header}>
                  {formatDate(cashFlowItemsByDate.date, 'date.format.fullDateWithDayOfWeek')}
                </div>
                <div className={styles.section__content}>
                  {cashFlowItemsByDate.cashFlowItems.map(cashFlowItem => (
                    <TransactionCard transaction={cashFlowItem} onClick={handleClickOnCashFlow} key={cashFlowItem.id} />
                  ))}
                </div>
              </Fragment>
            );
          })}
        </section>
      </main>

      <SideSheetMobile open={Boolean(cashFlowItem)}>
        {cashFlowItem && (
          <TransactionWindowMobile
            transaction={cashFlowItem}
            onClose={handleCloseCashFlowItemWindow}
            onCreate={handleCreateTransaction}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        )}
      </SideSheetMobile>
    </div>
  );
});
