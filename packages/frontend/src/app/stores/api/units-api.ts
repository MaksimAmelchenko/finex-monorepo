import { ApiRepository } from '../../core/other-stores/api-repository';
import { IUnitsApi } from '../units-repository';
import {
  CreateUnitData,
  CreateUnitResponse,
  GetUnitsResponse,
  UpdateUnitChanges,
  UpdateUnitResponse,
} from '../../types/unit';

export class UnitsApi extends ApiRepository implements IUnitsApi {
  static override storeName = 'UnitsApi';

  getUnits(): Promise<GetUnitsResponse> {
    return this.fetch<GetUnitsResponse>({
      method: 'GET',
      url: '/v2/units',
    });
  }

  createUnit(data: CreateUnitData): Promise<CreateUnitResponse> {
    return this.fetch<CreateUnitResponse>({
      method: 'POST',
      url: '/v2/units',
      body: data,
    });
  }

  updateUnit(unitId: string, changes: UpdateUnitChanges): Promise<UpdateUnitResponse> {
    return this.fetch<CreateUnitResponse>({
      method: 'PATCH',
      url: `/v2/units/${unitId}`,
      body: changes,
    });
  }

  deleteUnit(unitId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/units/${unitId}`,
    });
  }
}
