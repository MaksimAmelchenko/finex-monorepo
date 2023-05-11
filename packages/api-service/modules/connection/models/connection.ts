import { ConnectionProvider, IConnection, IAccount, IConnectionEntity } from '../types';
import { TDateTime } from '../../../types/app';

export class Connection implements IConnection {
  projectId: string;
  userId: string;
  id: string;
  institutionName: string;
  institutionLogo: string;
  provider: ConnectionProvider;
  accounts: IAccount[];
  createdAt: TDateTime;
  updatedAt: TDateTime;

  constructor({
    projectId,
    userId,
    id,
    institutionName,
    institutionLogo,
    provider,
    accounts,
    createdAt,
    updatedAt,
  }: IConnectionEntity) {
    this.projectId = projectId;
    this.userId = userId;
    this.id = id;
    this.institutionName = institutionName;
    this.institutionLogo = institutionLogo;
    this.provider = provider;
    this.accounts = accounts;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
