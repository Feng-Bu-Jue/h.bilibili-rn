/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseService, GET, Response } from 'ts-retrofit';
import { ApiDescriptor, buildApi, QueryMapW } from '..';
import {
  BiliBiliProtocol,
  LinkDrawResultList,
  DrawCategory,
  ListType,
} from '../typings';

@ApiDescriptor('apivc')
export class LinkDraw extends BaseService {
  @GET('link_draw/v2/doc/list')
  async getDocs(
    @QueryMapW()
    query: {
      page_num: number;
      page_size: number;
      category: DrawCategory;
      type: ListType;
    },
  ): Promise<Response<BiliBiliProtocol<LinkDrawResultList>>> {
    return <Response<BiliBiliProtocol<LinkDrawResultList>>>{};
  }
}

export const LinkDrawApi = buildApi(LinkDraw);
