import { ICountryDTO } from '../../../../modules/connection/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { connectionMapper } from '../../../../modules/connection/connection.mapper';
import { connectionService } from '../../../../modules/connection/connection.service';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<IResponse<{ countries: ICountryDTO[] }>> {
  const { locale } = ctx.params;
  const countries = await connectionService.getCountries(ctx);

  return {
    body: {
      countries: countries.map(country => connectionMapper.toCountryDTO(country, locale)),
    },
  };
}
