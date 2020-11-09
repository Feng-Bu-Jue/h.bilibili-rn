/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseService, GET, Response } from 'ts-retrofit';
import { QueryMapW, ApiDescriptor, AppAuthorize } from '../extensions';
import { BiliBiliProtocol, UserSpaceDetail } from '../typings';

@ApiDescriptor('app')
export class UserService extends BaseService {
  @AppAuthorize
  @GET('x/v2/space')
  async getUserDetail(
    @QueryMapW()
    query: {
      vmid: number;
    },
  ): Promise<Response<BiliBiliProtocol<UserSpaceDetail>>> {
    return <Response<BiliBiliProtocol<UserSpaceDetail>>>{};
  }
}
