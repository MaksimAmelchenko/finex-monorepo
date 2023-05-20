import { action, makeObservable, observable, runInAction } from 'mobx';

import {
  CompleteRequisitionResponse,
  CreateRequisitionResponse,
  IAccount,
  IAccountDTO,
  IConnection,
  IConnectionsApi,
  ICountry,
  IInstitution,
  UpdateConnectionAccountChanges,
} from '../types/connections';
import { Account } from './models/account';
import { AccountsRepository } from './accounts-repository';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';

export class ConnectionsRepository extends ManageableStore {
  static storeName = 'ConnectionsRepository';

  connections: IConnection[] = [];
  countries: ICountry[] = [];
  institutions: IInstitution[] = [];

  institutionsLoadState: LoadState = LoadState.none();

  constructor(mainStore: MainStore, private api: IConnectionsApi) {
    super(mainStore);
    makeObservable<ConnectionsRepository, 'consumeConnectionAccount'>(this, {
      connections: observable,
      countries: observable,
      institutions: observable,
      institutionsLoadState: observable,
      consumeConnectionAccount: action,
      clear: action,
    });
  }

  getConnections(): Promise<void> {
    return this.api.getConnections().then(
      action(({ connections }) => {
        this.connections = connections.map(connection => {
          const { accounts, ...rest } = connection;

          return {
            ...rest,
            accounts: accounts.map(account => this.decodeConnectionAccount(account)),
          };
        });
      })
    );
  }

  deleteConnection(connectionId: string): Promise<void> {
    return this.api.deleteConnection(connectionId).then(
      action(() => {
        this.connections = this.connections.filter(({ id }) => id !== connectionId);
      })
    );
  }

  getCountries(): Promise<void> {
    return this.api.getCountries().then(
      action(({ countries }) => {
        this.countries = countries.sort((a, b) => a.name.localeCompare(b.name));
      })
    );
  }

  getInstitutions(country: string): Promise<void> {
    runInAction(() => {
      this.institutionsLoadState = LoadState.pending();
    });

    return this.api
      .getInstitutions(country)
      .then(
        action(({ institutions }) => {
          this.institutions = institutions.sort((a, b) => a.name.localeCompare(b.name));
        })
      )
      .finally(
        action(() => {
          this.institutionsLoadState = LoadState.done();
        })
      );
  }

  createNordigenRequisition(institutionId: string): Promise<CreateRequisitionResponse> {
    return this.api.createNordigenRequisition(institutionId);
  }

  completeNordigenRequisition(requisitionId: string): Promise<CompleteRequisitionResponse> {
    return this.api.completeNordigenRequisition(requisitionId);
  }

  updateConnectionAccount(
    connectionId: string,
    accountId: string,
    changes: UpdateConnectionAccountChanges
  ): Promise<void> {
    return this.api.updateConnectionAccount(connectionId, accountId, changes).then(({ account }) => {
      this.consumeConnectionAccount(connectionId, account);
    });
  }

  unlinkConnectionAccount(connectionId: string, accountId: string): Promise<void> {
    return this.api.unlinkConnectionAccount(connectionId, accountId).then(({ account }) => {
      this.consumeConnectionAccount(connectionId, account);
    });
  }

  private decodeConnectionAccount(connectionAccount: IAccountDTO): IAccount {
    const { accountId, ...rest } = connectionAccount;

    let account: Account | null = null;
    if (accountId) {
      const accountsRepository = this.getStore(AccountsRepository);
      account = accountsRepository.get(accountId) ?? null;
    }
    return {
      ...rest,
      account,
    };
  }

  private consumeConnectionAccount(connectionId: string, account: IAccountDTO): void {
    const connectionAccount = this.decodeConnectionAccount(account);
    const connection = this.connections.find(connection => connection.id === connectionId);
    if (connection) {
      const indexOf = connection.accounts.findIndex(({ id }) => id === connectionAccount.id);

      if (indexOf !== -1) {
        connection.accounts[indexOf] = connectionAccount;
      } else {
        throw new Error('Connection account is not found');
      }
    } else {
      throw new Error('Connection is not found');
    }
  }

  clear(): void {
    this.connections = [];
    this.countries = [];
    this.institutions = [];
  }
}
