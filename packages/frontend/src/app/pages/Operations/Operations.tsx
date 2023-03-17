import React, { Fragment, useEffect, useState } from 'react';
import PullToRefresh from 'pulltorefreshjs';
import { observer } from 'mobx-react-lite';

import { AppBar } from '../../components/AppBar/AppBar';
import { AppBarButton } from '../../components/AppBar/AppBarButton/AppBarButton';
import { Button, SearchMdIcon } from '@finex/ui-kit';
import { CreateDebtItemData, UpdateDebtItemChanges } from '../../types/debt';
import { DebtItemCard } from '../../components/DebtItemCard/DebtItemCard';
import { DebtItemWindowMobile } from '../../containers/DebtIItemWindowMobile/DebtItemWindowMobile';
import { ExchangeCard } from '../../components/ExchangeCard/ExchangeCard';
import { ExchangeWindowMobile } from '../../containers/ExchangeWindowMobile/ExchangeWindowMobile';
import { IOperation } from '../../types/operation';
import { LoadState } from '../../core/load-state';
import { Loader } from '../../components/Loader/Loader';
import {
  OperationDebtItem,
  OperationExchange,
  OperationTransaction,
  OperationTransfer,
} from '../../stores/models/operation';
import { OperationsRepository } from '../../stores/operations-repository';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { TransactionCard } from '../../components/TransactionCard/TransactionCard';
import { TransactionWindowMobile } from '../../containers/TransactionWindowMobile/TransactionWindowMobile';
import { TransferCard } from '../../components/TransferCard/TransferCard';
import { TransferWindowMobile } from '../../containers/TransferWindowMobile/TransferWindowMobile';
import { formatDate, getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Operations.module.scss';

const t = getT('Operations');

export const Operations = observer(() => {
  const operationsRepository = useStore(OperationsRepository);

  const [operation, setOperation] = useState<IOperation | null>(null);

  useEffect(() => {
    operationsRepository.refresh();
  }, []);

  const handleCardClick = (operationId: string) => {
    const operation = operationsRepository.getOperation(operationId);
    if (operation) {
      setOperation(operation);
    }
  };

  const handleClose = () => {
    setOperation(null);
  };

  const handleCreateDebtItem = (debtId: string, data: CreateDebtItemData) => {
    return Promise.reject('Not implemented');
  };

  const handleUpdateDebtItem = (debtId: string, debtItemId: string, changes: UpdateDebtItemChanges) => {
    return operationsRepository.updateDebtItem(debtId, debtItemId, changes);
  };

  const handleDeleteDebtItem = (debtId: string, debtItemId: string) => {
    return operationsRepository.deleteDebtItem(debtId, debtItemId);
  };

  useEffect(() => {
    PullToRefresh.init({
      mainElement: `.${styles.layout}`,
      triggerElement: `.${styles.layout}`,
      instructionsReleaseToRefresh: ' ',
      instructionsRefreshing: ' ',
      instructionsPullToRefresh: ' ',
      onRefresh() {
        operationsRepository.refresh();
      },
      shouldPullToRefresh() {
        // @ts-ignore
        return !this.mainElement.scrollTop;
      },
      refreshTimeout: 0,
    });

    return () => {
      PullToRefresh.destroyAll();
    };
  }, []);

  if (!operationsRepository.operationsByDates.length && operationsRepository.loadState.isPending()) {
    return (
      <div className={styles.layout}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <AppBar
        title={t('Operations')}
        endAdornment={
          <AppBarButton
            icon={<SearchMdIcon />}
            onClick={() => {
              alert('Search');
            }}
          />
        }
      />

      <div className={styles.layout}>
        {operationsRepository.operationsByDates.map(operationsByDate => {
          return (
            <Fragment key={operationsByDate.date}>
              <div className={styles.section__header}>
                {formatDate(operationsByDate.date, 'date.formats.fullDateWithDayOfWeek')}
              </div>
              <div className={styles.section__content}>
                {operationsByDate.operations.map(operation => {
                  if (operation instanceof OperationTransaction) {
                    return <TransactionCard transaction={operation} onClick={handleCardClick} key={operation.id} />;
                  }

                  if (operation instanceof OperationDebtItem) {
                    return <DebtItemCard debtItem={operation} onClick={handleCardClick} key={operation.id} />;
                  }

                  if (operation instanceof OperationTransfer) {
                    return <TransferCard transfer={operation} onClick={handleCardClick} key={operation.id} />;
                  }

                  if (operation instanceof OperationExchange) {
                    return <ExchangeCard exchange={operation} onClick={handleCardClick} key={operation.id} />;
                  }

                  return null;
                })}
              </div>
            </Fragment>
          );
        })}

        {operationsRepository.loadState !== LoadState.none() && operationsRepository.operations.length > 0 && (
          <div className={styles.loadMorePanel}>
            <Button
              fullSize
              onClick={() => operationsRepository.fetchNextPage()}
              loading={operationsRepository.loadState.isPending()}
            >
              {t('Load more')}
            </Button>
          </div>
        )}

        <SideSheetMobile open={operation instanceof OperationTransaction}>
          {operation && <TransactionWindowMobile transaction={operation} onClose={handleClose} />}
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
    </>
  );
});

export default Operations;
