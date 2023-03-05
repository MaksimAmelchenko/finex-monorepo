import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import { parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { Button, ISelectOption } from '@finex/ui-kit';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { CreateDebtData, IDebt, IDebtItem, UpdateDebtChanges } from '../../types/debt';
import { Debt } from '../../stores/models/debt';
import { DebtItem } from '../../stores/models/debt-item';
import { DebtItemRow } from './DebtItemRow/DebtItemRow';
import { DebtItemWindow } from './DebtItemWindow/DebtItemWindow';
import { DebtsRepository } from '../../stores/debts-repository';
import { Drawer } from '../../components/Drawer/Drawer';
import { Form, FormButton, FormSelect, FormTextAreaField } from '../../components/Form';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';
import { Shape } from '../../types';
import { TagsRepository } from '../../stores/tags-repository';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './DebtWindow.module.scss';

interface DebtFormValues {
  contractorId: string | null;
  note: string;
  tagIds: string[];
  items: any[];
}

interface DebtWindowProps {
  isOpened: boolean;
  debt: Partial<IDebt> | Debt;
  onClose: () => unknown;
}

const t = getT('DebtWindow');

function mapValuesToCreatePayload({ contractorId, note, tagIds, items }: DebtFormValues): CreateDebtData {
  return {
    contractorId: contractorId!,
    note,
    tags: tagIds,
    items,
  };
}

function mapValuesToUpdatePayload({ contractorId, note, tagIds, items }: DebtFormValues): UpdateDebtChanges {
  return {
    contractorId: contractorId ?? undefined,
    note,
    tags: tagIds,
    items,
  };
}

export const DebtWindow = observer<DebtWindowProps>(props => {
  const { onClose } = props;

  const contractorsRepository = useStore(ContractorsRepository);
  const debtsRepository = useStore(DebtsRepository);
  const tagsRepository = useStore(TagsRepository);

  const { enqueueSnackbar } = useSnackbar();
  const [debt, setDebt] = useState<Partial<IDebt> | Debt>(props.debt);

  useEffect(() => {
    analytics.view({
      page_title: 'debt',
    });
  }, []);

  const onSubmit = useCallback(
    (values: DebtFormValues, _: FormikHelpers<DebtFormValues>, initialValues: DebtFormValues) => {
      let result: Promise<Debt>;
      if (debt instanceof Debt) {
        const changes: UpdateDebtChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = debtsRepository.updateDebt(debt as Debt, changes);
      } else {
        const data: CreateDebtData = mapValuesToCreatePayload(values);
        result = debtsRepository.createDebt(data);
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
    [debt, debtsRepository, enqueueSnackbar, onClose]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<DebtFormValues>>({
        contractorId: Yup.mixed().test('contractorId', t('Please select contractor'), value => Boolean(value)),
      }),
    []
  );

  const selectContractorOptions = useMemo<ISelectOption[]>(() => {
    return contractorsRepository.contractors.map(({ id: value, name: label }) => ({ value, label }));
  }, [contractorsRepository.contractors]);

  const selectTagsOptions = useMemo<ISelectOption[]>(() => {
    return tagsRepository.tags.map(({ id: value, name: label }) => ({ value, label }));
  }, [tagsRepository.tags]);

  const [isOpenedDebtItemWindow, setIsOpenedDebtItemWindow] = useState<boolean>(false);

  const [debtItem, setDebtItem] = useState<({ debtId: string } & Partial<IDebtItem>) | DebtItem | null>(null);

  const handleOpenAddDebtItem = () => {
    if (!debt.id) {
      return;
    }
    setDebtItem({
      debtId: debt.id,
      sign: -1,
    });
    setIsOpenedDebtItemWindow(true);
  };

  const handleClickOnDebt = (debtItem: DebtItem) => {
    setDebtItem(debtItem);
    setIsOpenedDebtItemWindow(true);
  };

  const handleCloseDebtItemWindow = () => {
    setIsOpenedDebtItemWindow(false);
  };

  const { contractor, note, tags, items = [] } = debt;

  const debtItems = items
    .slice()
    .sort(
      (a, b) => parseISO(b.debtItemDate).getTime() - parseISO(a.debtItemDate).getTime() || Number(b.id) - Number(a.id)
    );

  const selectedDebtItems = items.filter(({ isSelected }) => isSelected);

  const handleDeleteClick = () => {
    if (selectedDebtItems.length > 1) {
      if (!window.confirm(t('Are you sure you want to delete several debts?'))) {
        return;
      }
    }

    selectedDebtItems.forEach(debtItem => {
      debtsRepository.removeDebtItem(debtItem).catch(err => {
        enqueueSnackbar(err.message, { variant: 'error' });
      });
    });
  };

  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('Debt')} />
      <main className={clsx(styles.layout__content, styles.content)}>
        <section className={styles.debt}>
          <Form<DebtFormValues>
            onSubmit={onSubmit}
            initialValues={{
              contractorId: contractor?.id || null,
              note: note ?? '',
              tagIds: tags ? tags.map(tag => tag.id) : [],
              items: [],
            }}
            validationSchema={validationSchema}
            className={styles.debt__form}
            name="debt"
          >
            <div className={styles.debt__container}>
              <div className={styles.debt__left}>
                <FormSelect name="contractorId" label={t('Contractor')} options={selectContractorOptions} />
                <FormSelect isMulti name="tagIds" label={t('Tags')} options={selectTagsOptions} />
              </div>
              <div className={styles.debt__right}>
                <FormTextAreaField name="note" label={t('Note')} minRows={4} />
              </div>
            </div>

            <div className={styles.debt__footer}>
              <FormButton variant="secondaryGray" isIgnoreValidation onClick={onClose}>
                {t('Close')}
              </FormButton>
              <FormButton type="submit" color="primary" isIgnoreValidation>
                {t('Save')}
              </FormButton>
            </div>
          </Form>
        </section>

        <section className={styles.debtItems}>
          <div className={clsx(styles.panel)}>
            <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
              <div className={styles.toolbar__buttons}>
                <Button variant="secondaryGray" disabled={!Boolean(debt.id)} onClick={handleOpenAddDebtItem}>
                  {t('New')}
                </Button>
                <Button variant="secondaryGray" disabled={!selectedDebtItems.length} onClick={handleDeleteClick}>
                  {t('Delete')}
                </Button>
              </div>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={clsx('table table-hover table-sm', styles.table)}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '1.6rem' }}>{t('Date')}</th>
                  <th>{t('Account')}</th>
                  <th>{t('Category')}</th>
                  <th colSpan={2}>{t('Amount')}</th>
                  <th className="hidden-sm">{t('Note')}</th>
                  <th className="hidden-sm">{t('Tags')}</th>
                </tr>
              </thead>
              <tbody>
                {debtItems.map(debtItem => (
                  <DebtItemRow debtItem={debtItem} onClick={handleClickOnDebt} key={debtItem.id} />
                ))}
              </tbody>
              <tfoot></tfoot>
            </table>
          </div>
        </section>
      </main>

      <Drawer isOpened={isOpenedDebtItemWindow}>
        {debtItem && <DebtItemWindow debtItem={debtItem} onClose={handleCloseDebtItemWindow} />}
      </Drawer>
    </div>
  );
});
