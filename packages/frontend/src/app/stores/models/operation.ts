import { DebtItem } from './debt-item';
import { Exchange } from './exchange';
import {
  IOperationDebtItem,
  IOperationExchange,
  IOperationTransaction,
  IOperationTransfer,
} from '../../types/operation';
import { TDate } from '../../types';
import { Transaction } from './transaction';
import { Transfer } from './transfer';

export class OperationTransaction extends Transaction implements IOperationTransaction {
  get operationDate(): TDate {
    return this.transactionDate;
  }
}

export class OperationDebtItem extends DebtItem implements IOperationDebtItem {
  get operationDate(): TDate {
    return this.debtItemDate;
  }
}

export class OperationTransfer extends Transfer implements IOperationTransfer {
  get operationDate(): TDate {
    return this.transferDate;
  }
}

export class OperationExchange extends Exchange implements IOperationExchange {
  get operationDate(): TDate {
    return this.exchangeDate;
  }
}
