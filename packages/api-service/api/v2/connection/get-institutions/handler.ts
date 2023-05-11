import { ConnectionProvider, IInstitutionDTO } from '../../../../modules/connection/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { nordigenMapper } from '../../../../modules/connection-nordigen/mordigen.mapper';
import { nordigenService } from '../../../../modules/connection-nordigen/nordigen.service';

interface IRequestParams {
  country: string;
}

export async function handler(
  ctx: IRequestContext<IRequestParams, true>
): Promise<IResponse<{ institutions: IInstitutionDTO[] }>> {
  const { country } = ctx.params;

  // collect all institutions from all gateways
  const institutions: IInstitutionDTO[] = await nordigenService.getInstitutions(ctx, country).then(institutions => {
    return institutions.map(institution => {
      return {
        ...nordigenMapper.toInstitutionDTO(institution),
        provider: ConnectionProvider.Nordigen,
      };
    });
  });

  return {
    body: {
      institutions,
    },
  };
}
