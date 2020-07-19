/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseService, GET, QueryMap, Response, BasePath } from 'ts-retrofit';
import { ApiDescriptor, buildApi } from '..';
import {
  BiliBiliProtocol,
  LinkDrawResultList,
  DrawCategory,
  ListType,
} from '../typings';

@ApiDescriptor('apivc')
@BasePath('https://api.vc.bilibili.com')
export class LinkDraw extends BaseService {
  @GET('link_draw/v2/doc/list')
  async getDocs(
    @QueryMap
    query: any,
  ): Promise<Response<BiliBiliProtocol<LinkDrawResultList>>> {
    return <Response<BiliBiliProtocol<LinkDrawResultList>>>{};
  }
}

export const LinkDrawApi = buildApi(LinkDraw);
