import {
  FindOperationsServiceQuery,
  FindOperationsServiceResponse,
  OperationRepository,
  OperationService,
} from './types';
import { IRequestContext } from '../../types/app';
import { operationMapper } from './operation.mapper';
import { operationRepository } from './operation.repository';

class OperationServiceImpl implements OperationService {
  private operationRepository: OperationRepository;

  constructor({ operationRepository }: { operationRepository: OperationRepository }) {
    this.operationRepository = operationRepository;
  }

  async findOperations(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    query: FindOperationsServiceQuery
  ): Promise<FindOperationsServiceResponse> {
    const { operations, metadata } = await this.operationRepository.findOperations(ctx, projectId, userId, query);
    return {
      metadata,
      operations: operations.map(operation => operationMapper.toDTO(operation)),
    };
  }
}

export const operationService = new OperationServiceImpl({
  operationRepository,
});
