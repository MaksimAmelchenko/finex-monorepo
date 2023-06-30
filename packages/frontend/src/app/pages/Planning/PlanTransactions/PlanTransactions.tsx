import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Button, CoinsStacked01Icon, PlusIcon, RefreshCW01Icon } from '@finex/ui-kit';
import { Drawer } from '../../../components/Drawer/Drawer';
import { EmptyState } from '../../../components/EmptyState/EmptyState';
import { HeaderLayout } from '../../../components/HeaderLayout/HeaderLayout';
import { IPlanTransaction } from '../../../types/plan-transaction';
import { LoadState } from '../../../core/load-state';
import { Loader } from '../../../components/Loader/Loader';
import { PlanTransaction } from '../../../stores/models/plan-transaction';
import { PlanTransactionRow } from './PlanTransactionRow/PlanTransactionRow';
import { PlanTransactionWindow } from '../../../containers/PlanTransactionWindow/PlanTransactionWindow';
import { PlanTransactionsRepository } from '../../../stores/plan-transactions-repository';
import { ProjectsRepository } from '../../../stores/projects-repository';
import { TrashIcon } from '../../../components/TrashIcon/TrashIcon';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './PlanTransactions.module.scss';

const t = getT('PlanTransaction');

export const PlanTransactions = observer(() => {
  const planTransactionsRepository = useStore(PlanTransactionsRepository);
  const projectsRepository = useStore(ProjectsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const [isOpenedPlanTransactionWindow, setIsOpenedPlanTransactionWindow] = useState<boolean>(false);
  const [isFirstRendering, setIsFirstRendering] = useState<boolean>(true);

  const [planTransaction, setPlanTransaction] = useState<Partial<IPlanTransaction> | PlanTransaction | null>(null);

  useEffect(() => {
    setIsFirstRendering(false);
  }, []);

  useEffect(() => {
    planTransactionsRepository.fetch().catch(err => {
      let message = '';
      switch (err.code) {
        default:
          message = err.message;
      }

      enqueueSnackbar(message, { variant: 'error' });
    });
  }, [enqueueSnackbar, planTransactionsRepository, projectsRepository.currentProject]);

  const handleOpenAddPlanTransaction = () => {
    setPlanTransaction({});
    setIsOpenedPlanTransactionWindow(true);
  };

  const handleClickOnPlanTransaction = (planTransaction: PlanTransaction) => {
    setPlanTransaction(planTransaction);
    setIsOpenedPlanTransactionWindow(true);
  };

  const handleClosePlanTransactionWindow = () => {
    setIsOpenedPlanTransactionWindow(false);
  };

  const { planTransactions, loadState } = planTransactionsRepository;

  const handleRefreshClick = () => {
    planTransactionsRepository.refresh();
  };

  const selectedPlans = planTransactions.filter(({ isSelected }) => isSelected);

  const handleDeleteClick = () => {
    if (selectedPlans.length > 1) {
      if (!window.confirm(t('Are you sure you want to delete several plan transactions?'))) {
        return;
      }
    }

    selectedPlans.forEach(planTransaction => {
      planTransactionsRepository.removePlanTransaction(planTransaction).catch(err => console.error({ err }));
    });
  };

  const isDeleteButtonDisabled = Boolean(!selectedPlans.length);
  const isLoading = loadState === LoadState.pending() || isFirstRendering;
  const isNoData = !planTransactions.length && loadState === LoadState.done();

  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('Planning - Incomes & Expenses')} />
      <main className={styles.content}>
        <div className={clsx(styles.content__panel, styles.panel)}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button size="md" startIcon={<PlusIcon />} onClick={handleOpenAddPlanTransaction}>
                {t('New')}
              </Button>
              <Button
                variant="secondaryGray"
                size="md"
                startIcon={<TrashIcon disabled={isDeleteButtonDisabled} />}
                disabled={isDeleteButtonDisabled}
                onClick={handleDeleteClick}
              >
                {t('Delete')}
              </Button>
              <Button variant="secondaryGray" size="md" startIcon={<RefreshCW01Icon />} onClick={handleRefreshClick}>
                {t('Refresh')}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          {isLoading ? (
            <Loader />
          ) : isNoData ? (
            <div className={styles.tableWrapper__emptyState}>
              <EmptyState
                illustration={<CoinsStacked01Icon className={styles.emptyState__illustration} />}
                text={t('Start by creating a Plan Transaction')}
                supportingText={t(
                  'Plan Transactions are used to plan your incomes and expenses. You can create a Plan Transaction by clicking the button below.'
                )}
              >
                <Button size="lg" startIcon={<PlusIcon />} onClick={handleOpenAddPlanTransaction}>
                  {t('Create a Plan Transaction')}
                </Button>
              </EmptyState>
            </div>
          ) : (
            <table className={clsx('table table-hover table-sm', styles.table)}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '0.8rem' }}>{t('Date')}</th>
                  <th>
                    {t('Account')}
                    <br />
                    {t('Counterparty')}
                  </th>
                  <th>{t('Category')}</th>
                  <th>{t('Amount')}</th>
                  <th>{t('Schedule')}</th>
                  <th>{t('Note')}</th>
                </tr>
              </thead>

              <tbody>
                {planTransactions.map(planTransaction => (
                  <PlanTransactionRow
                    planTransaction={planTransaction}
                    onClick={handleClickOnPlanTransaction}
                    key={planTransaction.planId}
                  />
                ))}
              </tbody>
              <tfoot></tfoot>
            </table>
          )}
        </div>
      </main>

      <Drawer open={isOpenedPlanTransactionWindow}>
        {planTransaction && (
          <PlanTransactionWindow planTransaction={planTransaction} onClose={handleClosePlanTransactionWindow} />
        )}
      </Drawer>
    </div>
  );
});
