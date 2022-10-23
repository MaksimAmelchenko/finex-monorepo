import { ApiRepository } from '../../core/other-stores/api-repository';
import { DeleteProfileParams, IProfileApi, UpdateProfileChanges, UpdateProfileResponse } from '../../types/profile';

export class ProfileApi extends ApiRepository implements IProfileApi {
  static override storeName = 'ProfileApi';

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
