import React, { Fragment, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { Button } from '@finex/ui-kit';
import { DebtCard } from '../../components/DebtCard/DebtCard';
import { Drawer } from '../../components/Drawer/Drawer';
import { ExchangeCard } from '../../components/ExchangeCard/ExchangeCard';
import { IOperation } from '../../types/operation';
import { LoadState } from '../../core/load-state';
import {
  OperationDebt,
  OperationExchange,
  OperationTransaction,
  OperationTransfer,
} from '../../stores/models/operation';
import { OperationsRepository } from '../../stores/operations-repository';
import { TransactionCard } from '../../components/TransactionCard/TransactionCard';
import { TransactionWindowMobile } from '../../containers/TransactionWindowMobile/TransactionWindowMobile';
import { TransferCard } from '../../components/TransferCard/TransferCard';
import { formatDate, getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Operations.module.scss';

const t = getT('Operations');

export const Operations = observer(() => {
  const operationsRepository = useStore(OperationsRepository);
  const [open, setOpen] = useState(false);

  const [operation, setOperation] = useState<IOperation | null>(null);

  useEffect(() => {
    operationsRepository.refresh();
  }, []);

  const handleCardClick = (operationId: string) => {
    const operation = operationsRepository.getOperation(operationId);
    if (operation) {
      setOpen(true);
      setOperation(operation);
    }
  };

  return (
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

                if (operation instanceof OperationDebt) {
                  return <DebtCard debtItem={operation} onClick={handleCardClick} key={operation.id} />;
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

      <Drawer open={open}>
        {operation && <TransactionWindowMobile transaction={operation} onClose={() => setOpen(false)} />}
      </Drawer>
    </div>
  );
});

export default Operations;
