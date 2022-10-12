import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Button } from '@finex/ui-kit';
import { Drawer } from '../../../components/Drawer/Drawer';
import { IPlanTransaction } from '../../../types/plan-transaction';
import { PlanTransaction } from '../../../stores/models/plan-transaction';
import { PlanTransactionRow } from './PlanTransactionRow/PlanTransactionRow';
import { PlanTransactionWindow } from '../../../containers/PlanTransactionWindow/PlanTransactionWindow';
import { PlanTransactionsRepository } from '../../../stores/plan-transactions-repository';
import { ProjectsRepository } from '../../../stores/projects-repository';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './PlanTransactions.module.scss';
import { HeaderLayout } from '../../../components/HeaderLayout/HeaderLayout';

const t = getT('PlanTransaction');

export const PlanTransactions = observer(() => {
  const planTransactionsRepository = useStore(PlanTransactionsRepository);
  const projectsRepository = useStore(ProjectsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const [isOpenedPlanTransactionWindow, setIsOpenedPlanTransactionWindow] = useState<boolean>(false);

  const [planTransaction, setPlanTransaction] = useState<Partial<IPlanTransaction> | PlanTransaction | null>(null);

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

  useEffect(() => {
    planTransactionsRepository.fetch().catch(err => {
      let message = '';
      switch (err.code) {
        default:
          message = err.message;
      }

      enqueueSnackbar(message, { variant: 'error' });
    });
  }, [planTransactionsRepository, projectsRepository.currentProject]);

  const handleRefreshClick = () => {
    planTransactionsRepository.refresh();
  };

  const selectedPlans = planTransactions.filter(({ isSelected }) => isSelected);

  const handleDeleteClick = () => {
    if (selectedPlans.length > 1) {
      if (!window.confirm(t('Are you sure you what to delete several plan transactions?'))) {
        return;
      }
    }

    selectedPlans.forEach(planTransaction => {
      planTransactionsRepository.removePlanTransaction(planTransaction).catch(err => console.error({ err }));
    });
  };

  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('Planning - Incomes & Expenses')} />
      <main className={styles.content}>
        <div className={clsx(styles.content__panel, styles.panel)}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button variant="contained" size="small" color="primary" onClick={handleOpenAddPlanTransaction}>
                {t('New')}
              </Button>
              <Button variant="outlined" size="small" disabled={!selectedPlans.length} onClick={handleDeleteClick}>
                {t('Delete')}
              </Button>
              <Button variant="outlined" size="small" onClick={handleRefreshClick}>
                {t('Refresh')}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.tableWrapper}>
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
                <th colSpan={2}>{t('Amount')}</th>
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
        </div>
      </main>

      <Drawer isOpened={isOpenedPlanTransactionWindow}>
        {planTransaction && (
          <PlanTransactionWindow planTransaction={planTransaction} onClose={handleClosePlanTransactionWindow} />
        )}
      </Drawer>
    </div>
  );
});
