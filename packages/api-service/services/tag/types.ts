import { ITransaction, ITransactionDAO, ITransactionDTO } from '../../modules/transaction/types';

export interface ITagDAO {
  idProject: number;
  idTag: number;
  idUser: number;
  name: string;
}

export interface ITagEntity {
  id: string;
  userId: string;
  name: string;
}

export interface ITag extends ITagEntity {}

export interface ITagDTO {
  id: string;
  userId: string;
  name: string;
}

export type CreateTagGatewayData = {
  name: string;
};

export type CreateTagServiceData = CreateTagGatewayData;

export type UpdateTagGatewayChanges = Partial<{
  name: string;
}>;

export type UpdateTagServiceChanges = UpdateTagGatewayChanges;

export interface TagMapper {
  toDomain(tag: ITagDAO): ITag;
  toDTO(tag: ITag): ITagDTO;
}
