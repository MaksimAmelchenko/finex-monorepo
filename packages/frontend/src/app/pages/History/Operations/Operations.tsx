import React, { Fragment, useCallback, useEffect, useState } from 'react';
import PullToRefresh from 'pulltorefreshjs';
import { observer } from 'mobx-react-lite';

import { Button, SwitchHorizontal01Icon } from '@finex/ui-kit';
import { CreateDebtItemData, UpdateDebtItemChanges } from '../../../types/debt';
import { CreateTransactionData, UpdateTransactionChanges } from '../../../types/transaction';
import { DebtItemCard } from '../../../components/DebtItemCard/DebtItemCard';
import { DebtItemWindowMobile } from '../../../containers/DebtIItemWindowMobile/DebtItemWindowMobile';
import { EmptyState } from '../../../components/EmptyState/EmptyState';
import { ExchangeCard } from '../../../components/ExchangeCard/ExchangeCard';
import { ExchangeWindowMobile } from '../../../containers/ExchangeWindowMobile/ExchangeWindowMobile';
import { IOperation } from '../../../types/operation';
import { LoadState } from '../../../core/load-state';
import { Loader } from '../../../components/Loader/Loader';
import {
  OperationDebtItem,
  OperationExchange,
  OperationTransaction,
  OperationTransfer,
} from '../../../stores/models/operation';
import { OperationsRepository } from '../../../stores/operations-repository';
import { ProjectsRepository } from '../../../stores/projects-repository';
import { SideSheetMobile } from '../../../components/SideSheetMobile/SideSheetMobile';
import { TransactionCard } from '../../../components/TransactionCard/TransactionCard';
import { TransactionWindowMobile } from '../../../containers/TransactionWindowMobile/TransactionWindowMobile';
import { TransferCard } from '../../../components/TransferCard/TransferCard';
import { TransferWindowMobile } from '../../../containers/TransferWindowMobile/TransferWindowMobile';
import { formatDate, getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import { ReactComponent as HandDrawnArrowIllustration } from '../../../illustrations/hand-drawn-arrow-14.svg';

import styles from '../History.module.scss';

const t = getT('Operations');

export const Operations = observer(() => {
  const operationsRepository = useStore(OperationsRepository);
  const projectsRepository = useStore(ProjectsRepository);

  const [operation, setOperation] = useState<IOperation | null>(null);

  useEffect(() => {
    operationsRepository.refresh();
  }, [operationsRepository, projectsRepository.currentProject]);

  const handleCardClick = (operationId: string) => {
    operationsRepository.setLastOperationId(operationId);
    const operation = operationsRepository.getOperation(operationId);
    if (operation) {
      setOperation(operation);
    }
  };

  const handleClose = useCallback(() => {
    setOperation(null);
  }, []);

  const handleCreateDebtItem = (debtId: string, data: CreateDebtItemData) => {
    return Promise.reject('Not implemented');
  };

  const handleUpdateDebtItem = (debtId: string, debtItemId: string, changes: UpdateDebtItemChanges) => {
    return operationsRepository.updateDebtItem(debtId, debtItemId, changes);
  };

  const handleDeleteDebtItem = (debtId: string, debtItemId: string) => {
    return operationsRepository.deleteDebtItem(debtId, debtItemId);
  };

  const handleCreateTransaction = (data: CreateTransactionData) => {
    return operationsRepository.createTransaction(data).then(({ id }) => {
      operationsRepository.setLastOperationId(id);
    });
  };

  const handleUpdateTransaction = (cashFlowId: string, transactionId: string, changes: UpdateTransactionChanges) => {
    return operationsRepository.updateTransaction(transactionId, changes);
  };

  const handleDeleteTransaction = (cashFlowId: string, transactionId: string) => {
    return operationsRepository.deleteTransaction(transactionId);
  };

  useEffect(() => {
    PullToRefresh.init({
      mainElement: `.${styles.operations}`,
      triggerElement: `.${styles.operations}`,
      instructionsReleaseToRefresh: ' ',
      instructionsRefreshing: ' ',
      instructionsPullToRefresh: ' ',
      onRefresh() {
        operationsRepository.refresh();
      },
      shouldPullToRefresh() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return !this.mainElement.scrollTop;
      },
      refreshTimeout: 0,
    });

    return () => {
      PullToRefresh.destroyAll();
    };
  }, [operationsRepository]);

  const { operationsByDates, loadState, operations, lastOperationId } = operationsRepository;

  function renderContent(): JSX.Element {
    if (!operationsByDates.length && loadState.isPending()) {
      return <Loader />;
    }

    if (!operations.length && loadState.isDone()) {
      return (
        <div className={styles.root__emptyState}>
          <EmptyState
            illustration={<SwitchHorizontal01Icon className={styles.root__emptyStateIllustration} />}
            text={t('Transactions')}
            supportingText={t(
              'Here are your expenses, income, transfers between accounts and currency exchange. To add a transaction, tap on the "plus" button below and select "Expense", "Income", "Transfer" or "Exchange"'
            )}
          />
          <div className={styles.root__pointer}>
            <HandDrawnArrowIllustration />
          </div>
        </div>
      );
    }

    return (
      <>
        {operationsByDates.map(operationsByDate => {
          return (
            <Fragment key={operationsByDate.date}>
              <div className={styles.section__header}>
                {formatDate(operationsByDate.date, 'date.format.fullDateWithDayOfWeek')}
              </div>
              <div className={styles.section__content}>
                {operationsByDate.operations.map(operation => {
                  const isHighlighted = operation.id === lastOperationId;
                  if (operation instanceof OperationTransaction) {
                    return (
                      <TransactionCard
                        transaction={operation}
                        isHighlighted={isHighlighted}
                        onClick={handleCardClick}
                        key={operation.id}
                      />
                    );
                  }

                  if (operation instanceof OperationDebtItem) {
                    return (
                      <DebtItemCard
                        debtItem={operation}
                        onClick={handleCardClick}
                        isHighlighted={isHighlighted}
                        key={operation.id}
                      />
                    );
                  }

                  if (operation instanceof OperationTransfer) {
                    return (
                      <TransferCard
                        transfer={operation}
                        onClick={handleCardClick}
                        isHighlighted={isHighlighted}
                        key={operation.id}
                      />
                    );
                  }

                  if (operation instanceof OperationExchange) {
                    return (
                      <ExchangeCard
                        exchange={operation}
                        onClick={handleCardClick}
                        isHighlighted={isHighlighted}
                        key={operation.id}
                      />
                    );
                  }

                  return null;
                })}
              </div>
            </Fragment>
          );
        })}

        {loadState !== LoadState.none() && operations.length > 0 && operations.length < operationsRepository.total && (
          <div className={styles.loadMorePanel}>
            <Button fullSize onClick={() => operationsRepository.fetchNextPage()} loading={loadState.isPending()}>
              {t('Load more')}
            </Button>
          </div>
        )}
      </>
    );
  }
  return (
    <div className={styles.operations}>
      {renderContent()}

      <SideSheetMobile open={operation instanceof OperationTransaction}>
        {operation && (
          <TransactionWindowMobile
            transaction={operation}
            onClose={handleClose}
            onCreate={handleCreateTransaction}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        )}
      </SideSheetMobile>

      <SideSheetMobile open={operation instanceof OperationDebtItem}>
        {operation && (
          <DebtItemWindowMobile
            debtItem={operation as OperationDebtItem}
            onClose={handleClose}
            onCreate={handleCreateDebtItem}
            onUpdate={handleUpdateDebtItem}
            onDelete={handleDeleteDebtItem}
          />
        )}
      </SideSheetMobile>

      <SideSheetMobile open={operation instanceof OperationTransfer}>
        {operation && <TransferWindowMobile transfer={operation} onClose={handleClose} />}
      </SideSheetMobile>

      <SideSheetMobile open={operation instanceof OperationExchange}>
        {operation && <ExchangeWindowMobile exchange={operation} onClose={handleClose} />}
      </SideSheetMobile>
    </div>
  );
});
