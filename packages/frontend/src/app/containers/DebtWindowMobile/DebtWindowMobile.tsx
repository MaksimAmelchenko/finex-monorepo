import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Accordion, ChevronRightIcon } from '@finex/ui-kit';
import { BackButton, DeleteButton, Header } from '../../components/Header/Header';
import { CategoriesRepository } from '../../stores/categories-repository';
import { Category } from '../../stores/models/category';
import { ContractorField } from '../ContractorFieldMobile/ContractorField';
import {
  CreateDebtData,
  CreateDebtItemData,
  IDebt,
  IDebtItem,
  UpdateDebtChanges,
  UpdateDebtItemChanges,
} from '../../types/debt';
import { Debt, IDebtItemsByDate } from '../../stores/models/debt';
import { DebtItem } from '../../stores/models/debt-item';
import { DebtItemCard } from '../../components/DebtItemCard/DebtItemCard';
import { DebtItemWindowMobile } from '../DebtIItemWindowMobile/DebtItemWindowMobile';
import { DebtsRepository } from '../../stores/debts-repository';
import { Form, FormBody, FormButton } from '../../components/Form';
import { FormTextAreaField } from '../../components/Form/FormTextArea2/FormTextArea';
import { Shape } from '../../types';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { TagsField } from '../TagsFieldMobile/TagsField';
import { analytics } from '../../lib/analytics';
import { formatDate, getT } from '../../lib/core/i18n';
import { getPatch } from '../../lib/core/get-patch';
import { useStore } from '../../core/hooks/use-store';

import styles from './DebtWindowMobile.module.scss';

interface DebtFormValues {
  contractorId: string | null;
  note: string;
  tagIds: string[];
}

interface DebtWindowMobileProps {
  debt: Partial<Omit<IDebt, 'items'>> | Debt;
  onClose: () => unknown;
}

const t = getT('DebtWindowMobile');

function mapValuesToCreatePayload({ contractorId, note, tagIds }: DebtFormValues): CreateDebtData {
  return {
    contractorId: contractorId!,
    note,
    tags: tagIds,
  };
}

function mapValuesToUpdatePayload({ contractorId, note, tagIds }: DebtFormValues): UpdateDebtChanges {
  return {
    contractorId: contractorId ?? undefined,
    note,
    tags: tagIds,
  };
}

export const DebtWindowMobile = observer<DebtWindowMobileProps>(props => {
  const { onClose } = props;
  const debtsRepository = useStore(DebtsRepository);
  const categoriesRepository = useStore(CategoriesRepository);

  const [isShowAdditionalFields, setIsShowAdditionalFields] = useState<boolean>(
    Boolean(props.debt.note || props.debt.tags?.length)
  );
  const [debt, setDebt] = useState<Partial<IDebt> | Debt>(props.debt);
  const [debtItem, setDebtItem] = useState<({ debtId: string } & Partial<IDebtItem>) | DebtItem | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    analytics.view({
      page_title: 'debt-mobile',
    });
  }, []);

  const isNew = !(debt instanceof Debt);

  /*
  useEffect(() => {
    // if we've just created a new debt, and it is still empty, then open a window to create a new debt item
    if (!(props.debt instanceof Debt) && debt instanceof Debt && !debt.items.length) {
      handleOpenAddDebtItem();
    }
  }, [debt]);
  */

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<DebtFormValues>>({
        contractorId: Yup.mixed().test('contractorId', t('Please select contractor'), value => Boolean(value)),
      }),
    []
  );

  const handleDeleteClick = () => {
    if (!window.confirm(t('Are you sure you want to delete debt?'))) {
      return;
    }
    debtsRepository
      .removeDebt(debt as Debt)
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
    (values: DebtFormValues, _: FormikHelpers<DebtFormValues>, initialValues: DebtFormValues) => {
      let result: Promise<Debt>;
      if (isNew) {
        const data: CreateDebtData = mapValuesToCreatePayload(values);
        result = debtsRepository.createDebt(data);
      } else {
        const changes: UpdateDebtChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = debtsRepository.updateDebt(debt as Debt, changes);
      }

      return result
        .then(debt => setDebt(debt))
        .catch(err => {
          let message = '';
          switch (err.code) {
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [debt, debtsRepository, enqueueSnackbar, isNew]
  );

  const handleShowAdditionalFieldsClick = () => {
    setIsShowAdditionalFields(isShow => !isShow);
  };

  const handleOpenAddDebtItem = () => {
    if (!debt.id) {
      return;
    }

    let category: Category | undefined;
    if (debt.items?.length) {
      // there are records, most likely we want to return the debt
      category = categoriesRepository.getCategoryByPrototype('3');
    } else {
      // it is a new debt
      category = categoriesRepository.getCategoryByPrototype('2');
    }

    setDebtItem({
      debtId: debt.id,
      category,
      sign: -1,
    });
  };

  const handleCloseDebtItemWindow = () => {
    setDebtItem(null);
  };

  const handleClickOnDebt = useCallback(
    (debtItemId: string) => {
      const debtItem = debt.items!.find(({ id }) => id === debtItemId);
      if (debtItem) {
        setDebtItem(debtItem);
      }
    },
    [debt.items]
  );

  const handleCreateDebtItem = (debtId: string, data: CreateDebtItemData) => {
    return debtsRepository.createDebtItem(debtId, data);
  };

  const handleUpdateDebtItem = (debtId: string, debtItemId: string, changes: UpdateDebtItemChanges) => {
    return debtsRepository.updateDebtItem(debtId, debtItemId, changes);
  };

  const handleDeleteDebtItem = (debtId: string, debtItemId: string) => {
    return debtsRepository.removeDebtItem(debtId, debtItemId);
  };

  const { contractor, note, tags } = debt;

  let debtItemsByDates: IDebtItemsByDate[] = [];
  if (debt instanceof Debt) {
    debtItemsByDates = debt.debtItemsByDates;
  }

  return (
    <div className={styles.root}>
      <Header
        title={isNew ? t('Add new debt') : t('Edit debt')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={!isNew && <DeleteButton onClick={handleDeleteClick} />}
      />

      <main className={clsx(styles.root__main)}>
        <section className={styles.debt}>
          <Form<DebtFormValues>
            onSubmit={onSubmit}
            initialValues={{
              contractorId: contractor?.id || null,
              note: note ?? '',
              tagIds: tags ? tags.map(tag => tag.id) : [],
            }}
            enableReinitialize
            validationSchema={validationSchema}
            className={styles.debt__form}
            name="debt-mobile"
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

                <footer className={styles.debt__footer}>
                  {(isNew || dirty) && (
                    <FormButton type="submit" variant="secondaryGray" isIgnoreValidation>
                      {isNew ? t('Create debt') : t('Save')}
                    </FormButton>
                  )}

                  {debt.id && (
                    <FormButton type="button" variant="primary" isIgnoreValidation onClick={handleOpenAddDebtItem}>
                      {t('Add debt record')}
                    </FormButton>
                  )}
                </footer>
              </>
            )}
          </Form>
        </section>

        <section className={styles.debtItems}>
          {debtItemsByDates.map(debtItemsByDate => {
            return (
              <Fragment key={debtItemsByDate.date}>
                <div className={styles.section__header}>
                  {formatDate(debtItemsByDate.date, 'date.formats.fullDateWithDayOfWeek')}
                </div>
                <div className={styles.section__content}>
                  {debtItemsByDate.debtItems.map(debtItem => (
                    <DebtItemCard debtItem={debtItem} onClick={handleClickOnDebt} key={debtItem.id} />
                  ))}
                </div>
              </Fragment>
            );
          })}
        </section>
      </main>

      <SideSheetMobile open={Boolean(debtItem)}>
        {debtItem && (
          <DebtItemWindowMobile
            debtItem={debtItem}
            onClose={handleCloseDebtItemWindow}
            onCreate={handleCreateDebtItem}
            onUpdate={handleUpdateDebtItem}
            onDelete={handleDeleteDebtItem}
          />
        )}
      </SideSheetMobile>
    </div>
  );
});
