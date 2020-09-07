/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseService, GET, Response } from 'ts-retrofit';
import {
  BiliBiliProtocol,
  LinkDrawResultList,
  DrawCategory,
  ListType,
  PhotoCategory,
  LinkDrawResult,
} from '../typings';
import { QueryMapW, ApiDescriptor, Authorize } from '../extensions';

@ApiDescriptor('apivc')
export class LinkDrawService extends BaseService {
  @Authorize()
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

  @Authorize()
  @GET('link_draw/v2/photo/list')
  async getPhotos(
    @QueryMapW()
    query: {
      page_num: number;
      page_size: number;
      category: PhotoCategory;
      type: ListType;
    },
  ): Promise<Response<BiliBiliProtocol<LinkDrawResultList>>> {
    return <Response<BiliBiliProtocol<LinkDrawResultList>>>{};
  }

  @Authorize()
  @GET('link_draw/v1/doc/detail')
  async getDocDetail(
    @QueryMapW()
    query: {
      doc_id: number;
    },
  ): Promise<Response<BiliBiliProtocol<LinkDrawResult>>> {
    return <Response<BiliBiliProtocol<LinkDrawResult>>>{};
  }
}
