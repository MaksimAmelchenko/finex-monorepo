import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import { parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { Button, ISelectOption } from '@finex/ui-kit';
import { CashFlow } from '../../stores/models/cash-flow';
import { CashFlowItem } from '../../stores/models/cash-flow-item';
import { CashFlowItemRow } from './CashFlowItemRow/CashFlowItemRow';
import { CashFlowItemWindow } from './CashFlowItemWindow/CashFlowItemWindow';
import { CashFlowsRepository } from '../../stores/cash-flows-repository';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { CreateCashFlowData, ICashFlow, ICashFlowItem, UpdateCashFlowChanges } from '../../types/cash-flow';
import { Drawer } from '../../components/Drawer/Drawer';
import { Form, FormButton, FormSelect, FormTextAreaField } from '../../components/Form';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';
import { MoneysRepository } from '../../stores/moneys-repository';
import { TagsRepository } from '../../stores/tags-repository';
import { analytics } from '../../lib/analytics';
import { balanceByMoney } from '../../lib/balance-by-money';
import { getPatch } from '../../lib/core/get-patch';
import { getT, toCurrency } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './CashFlowWindow.module.scss';

interface CashFlowFormValues {
  contractorId: string | null;
  note: string;
  tagIds: string[];
  items: any[];
}

interface CashFlowWindowProps {
  isOpened: boolean;
  cashFlow: Partial<ICashFlow> | CashFlow;
  onClose: () => unknown;
}

const t = getT('CashFlowWindow');

function mapValuesToCreatePayload({ contractorId, note, tagIds, items }: CashFlowFormValues): CreateCashFlowData {
  return {
    contractorId: contractorId,
    note,
    tags: tagIds,
    items,
  };
}

function mapValuesToUpdatePayload({ contractorId, note, tagIds, items }: CashFlowFormValues): UpdateCashFlowChanges {
  return {
    contractorId: contractorId ?? undefined,
    note,
    tags: tagIds,
    items,
  };
}

export const CashFlowWindow = observer<CashFlowWindowProps>(props => {
  const { onClose } = props;

  const contractorsRepository = useStore(ContractorsRepository);
  const cashFlowsRepository = useStore(CashFlowsRepository);
  const moneysRepository = useStore(MoneysRepository);
  const tagsRepository = useStore(TagsRepository);

  const { enqueueSnackbar } = useSnackbar();
  const [cashFlow, setCashFlow] = useState<Partial<ICashFlow> | CashFlow>(props.cashFlow);

  useEffect(() => {
    analytics.view({
      page_title: 'cash-flow',
    });
  }, []);

  const onSubmit = useCallback(
    (values: CashFlowFormValues, _: FormikHelpers<CashFlowFormValues>, initialValues: CashFlowFormValues) => {
      let result: Promise<CashFlow>;
      if (cashFlow instanceof CashFlow) {
        const changes: UpdateCashFlowChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = cashFlowsRepository.updateCashFlow(cashFlow as CashFlow, changes);
      } else {
        const data: CreateCashFlowData = mapValuesToCreatePayload(values);
        result = cashFlowsRepository.createCashFlow(data);
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
    [cashFlow, cashFlowsRepository, enqueueSnackbar, onClose]
  );

  const validationSchema = useMemo(() => {}, []);

  const selectContractorOptions = useMemo<ISelectOption[]>(() => {
    return contractorsRepository.contractors.map(({ id: value, name: label }) => ({ value, label }));
  }, [contractorsRepository.contractors]);

  const selectTagsOptions = useMemo<ISelectOption[]>(() => {
    return tagsRepository.tags.map(({ id: value, name: label }) => ({ value, label }));
  }, [tagsRepository.tags]);

  const [isOpenedCashFlowItemWindow, setIsOpenedCashFlowItemWindow] = useState<boolean>(false);

  const [cashFlowItem, setCashFlowItem] = useState<
    ({ cashFlowId: string } & Partial<ICashFlowItem>) | CashFlowItem | null
  >(null);

  const handleOpenAddCashFlowItem = () => {
    if (!cashFlow.id) {
      return;
    }
    setCashFlowItem({
      cashFlowId: cashFlow.id,
      sign: -1,
    });
    setIsOpenedCashFlowItemWindow(true);
  };

  const handleClickOnCashFlow = (cashFlowItem: CashFlowItem) => {
    setCashFlowItem(cashFlowItem);
    setIsOpenedCashFlowItemWindow(true);
  };

  const handleCloseCashFlowItemWindow = () => {
    setIsOpenedCashFlowItemWindow(false);
  };

  const { contractor, note, tags, items = [] } = cashFlow;

  const cashFlowItems = items
    .slice()
    .sort(
      (a, b) =>
        parseISO(b.cashFlowItemDate).getTime() - parseISO(a.cashFlowItemDate).getTime() || Number(b.id) - Number(a.id)
    );

  const selectedCashFlowItems = items.filter(({ isSelected }) => isSelected);

  const balancesBySelectedCashFlowItems = balanceByMoney(selectedCashFlowItems).sort(
    (a, b) => moneysRepository.moneys.indexOf(a.money) - moneysRepository.moneys.indexOf(b.money)
  );

  const balances =
    cashFlow instanceof CashFlow
      ? cashFlow.balances.sort(
          (a, b) => moneysRepository.moneys.indexOf(a.money) - moneysRepository.moneys.indexOf(b.money)
        )
      : [];

  const handleDeleteClick = () => {
    if (selectedCashFlowItems.length > 1) {
      if (!window.confirm(t('Are you sure you want to delete several transactions?'))) {
        return;
      }
    }

    selectedCashFlowItems.forEach(cashFlowItem => {
      cashFlowsRepository.removeCashFlowItem(cashFlowItem).catch(err => {
        enqueueSnackbar(err.message, { variant: 'error' });
      });
    });
  };

  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('CashFlow')} />
      <main className={clsx(styles.layout__content, styles.content)}>
        <section className={styles.cashFlow}>
          <Form<CashFlowFormValues>
            onSubmit={onSubmit}
            initialValues={{
              contractorId: contractor?.id || null,
              note: note ?? '',
              tagIds: tags ? tags.map(tag => tag.id) : [],
              items: [],
            }}
            validationSchema={validationSchema}
            className={styles.cashFlow__form}
            name="cash-flow"
          >
            <div className={styles.cashFlow__container}>
              <div className={styles.cashFlow__left}>
                <FormSelect
                  name="contractorId"
                  label={t('Contractor')}
                  options={selectContractorOptions}
                  data-cy="cfw-contractor"
                />
                <FormSelect isMulti name="tagIds" label={t('Tags')} options={selectTagsOptions} data-cy="cfw-tags" />
              </div>
              <div className={styles.cashFlow__right}>
                <FormTextAreaField name="note" label={t('Note')} minRows={4} data-cy="cfw-note" />
              </div>
            </div>

            <div className={styles.cashFlow__footer}>
              <FormButton variant="secondaryGray" isIgnoreValidation onClick={onClose} data-cy="cfw-close-button">
                {t('Close')}
              </FormButton>
              <FormButton type="submit" color="primary" isIgnoreValidation data-cy="cfw-save-button">
                {t('Save')}
              </FormButton>
            </div>
          </Form>
        </section>

        <section className={styles.cashFlowItems}>
          <div className={clsx(styles.panel)}>
            <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
              <div className={styles.toolbar__buttons}>
                <Button
                  variant="secondaryGray"
                  disabled={!Boolean(cashFlow.id)}
                  onClick={handleOpenAddCashFlowItem}
                  data-cy="cfw-create-cash-flow-item-button"
                >
                  {t('New')}
                </Button>
                <Button
                  variant="secondaryGray"
                  disabled={!selectedCashFlowItems.length}
                  onClick={handleDeleteClick}
                  data-cy="cfw-delete-cash-flow-item-button"
                >
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
                  <th />
                  <th colSpan={2}>{t('Income')}</th>
                  <th colSpan={2}>{t('Expense')}</th>
                  <th className="hidden-sm">{t('Note')}</th>
                  <th className="hidden-sm">{t('Tags')}</th>
                </tr>
              </thead>
              <tbody>
                {cashFlowItems.map(cashFlowItem => (
                  <CashFlowItemRow cashFlowItem={cashFlowItem} onClick={handleClickOnCashFlow} key={cashFlowItem.id} />
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}>{t('Total for selected operations:')}</td>
                  <td className="text-end numeric">
                    {balancesBySelectedCashFlowItems.map(({ money, income }) => {
                      return income ? <div key={money.id}>{toCurrency(income, money.precision)}</div> : null;
                    })}
                  </td>

                  <td className="currency">
                    {balancesBySelectedCashFlowItems.map(({ money, income }) => {
                      return income ? <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} /> : null;
                    })}
                  </td>

                  <td className="text-end numeric">
                    {balancesBySelectedCashFlowItems.map(({ money, expense }) => {
                      return expense ? <div key={money.id}>{toCurrency(-expense, money.precision)}</div> : null;
                    })}
                  </td>

                  <td className="currency">
                    {balancesBySelectedCashFlowItems.map(({ money, expense }) => {
                      return expense ? <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} /> : null;
                    })}
                  </td>
                  <td />
                  <td />
                </tr>
                <tr>
                  <td colSpan={4}>{t('Total:')}</td>
                  <td className="text-end numeric">
                    {balances.map(({ money, income }) => {
                      return income ? <div key={money.id}>{toCurrency(income, money.precision)}</div> : null;
                    })}
                  </td>

                  <td className="currency">
                    {balances.map(({ money, income }) => {
                      return income ? <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} /> : null;
                    })}
                  </td>

                  <td className="text-end numeric">
                    {balances.map(({ money, expense }) => {
                      return expense ? <div key={money.id}>{toCurrency(-expense, money.precision)}</div> : null;
                    })}
                  </td>

                  <td className="currency">
                    {balances.map(({ money, expense }) => {
                      return expense ? <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} /> : null;
                    })}
                  </td>
                  <td />
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </main>

      <Drawer isOpened={isOpenedCashFlowItemWindow}>
        {cashFlowItem && <CashFlowItemWindow cashFlowItem={cashFlowItem} onClose={handleCloseCashFlowItemWindow} />}
      </Drawer>
    </div>
  );
});
