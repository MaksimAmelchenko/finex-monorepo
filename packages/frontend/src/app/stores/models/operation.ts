import { DebtItem } from './debt-item';
import { Exchange } from './exchange';
import { IOperationDebtItem, IOperationExchange, IOperationTransaction, IOperationTransfer, } from '../../types/operation';
import { TDate } from '../../types';
import { Transaction } from './transaction';
import { Transfer } from './transfer';

export class OperationTransaction extends Transaction implements IOperationTransaction {
  constructor(entity: Omit<IOperationTransaction, 'operationDate'>) {
    super(entity);
  }

  get operationDate(): TDate {
    return this.transactionDate;
  }
}

export class OperationDebtItem extends DebtItem implements IOperationDebtItem {
  constructor(entity: Omit<IOperationDebtItem, 'operationDate'>) {
    super(entity);
  }

  get operationDate(): TDate {
    return this.debtItemDate;
  }
}

export class OperationTransfer extends Transfer implements IOperationTransfer {
  constructor(entity: Omit<IOperationTransfer, 'operationDate'>) {
    super(entity);
  }

  get operationDate(): TDate {
    return this.transferDate;
  }
}

export class OperationExchange extends Exchange implements IOperationExchange {
  constructor(entity: Omit<IOperationExchange, 'operationDate'>) {
    super(entity);
  }

  get operationDate(): TDate {
    return this.exchangeDate;
  }
}
