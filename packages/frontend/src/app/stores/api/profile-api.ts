import { ApiRepository } from '../../core/other-stores/api-repository';
import {
  DeleteProfileParams,
  GetProfileResponse,
  IProfileApi,
  UpdateProfileChanges,
  UpdateProfileResponse,
} from '../../types/profile';

export class ProfileApi extends ApiRepository implements IProfileApi {
  static override storeName = 'ProfileApi';

  getProfile(): Promise<GetProfileResponse> {
    return this.fetch<GetProfileResponse>({
      method: 'GET',
      url: `/v2/profile`,
    });
  }

  update(changes: UpdateProfileChanges): Promise<UpdateProfileResponse> {
    return this.fetch<UpdateProfileResponse>({
      method: 'POST',
      url: `/v2/profile`,
      body: changes,
    });
  }

  remove(params: DeleteProfileParams): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/profile`,
      body: params,
    });
  }
}
