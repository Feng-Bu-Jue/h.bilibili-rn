/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseService, GET, Response, POST, Queries } from 'ts-retrofit';
import { QueryMapW, ApiDescriptor, Authorize, FixedParms } from '../extensions';
import { BiliBiliProtocol } from '../typings';

@ApiDescriptor('app')
export class UserService extends BaseService {
  @FixedParms()
  @GET('x/v2/space')
  async userDetail(
    @QueryMapW()
    query: {
      vmid: number;
    },
  ): Promise<Response<BiliBiliProtocol<any>>> {
    return <Response<BiliBiliProtocol<any>>>{};
  }
}
