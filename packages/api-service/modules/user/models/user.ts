import { IUser, IUserEntity } from '../types';
import { TDateTime } from '../../../types/app';

export class User implements IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  timeout: string;
  householdId: string;
  projectId: string | null;
  currencyRateSourceId: string;
  accessUntil: TDateTime;
  createdAt: TDateTime;
  updatedAt: TDateTime;

  constructor({
    id,
    name,
    email,
    password,
    timeout,
    householdId,
    projectId,
    currencyRateSourceId,
    accessUntil,
    createdAt,
    updatedAt,
  }: IUserEntity) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.timeout = timeout;
    this.householdId = householdId;
    this.projectId = projectId;
    this.currencyRateSourceId = currencyRateSourceId;
    this.accessUntil = accessUntil;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
