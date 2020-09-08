/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseService, GET, Response, POST } from 'ts-retrofit';
import {
  BiliBiliProtocol,
  LinkDrawResultList,
  DrawCategory,
  ListType,
  PhotoCategory,
  LinkDrawResult,
  Enum_Biz,
} from '../typings';
import { QueryMapW, ApiDescriptor, WebAuthorize } from '../extensions';

@ApiDescriptor('apivc')
export class LinkDrawService extends BaseService {
  @WebAuthorize()
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

  @WebAuthorize()
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

  @WebAuthorize()
  @GET('link_draw/v1/doc/detail')
  async getDocDetail(
    @QueryMapW()
    query: {
      doc_id: number;
    },
  ): Promise<Response<BiliBiliProtocol<LinkDrawResult>>> {
    return <Response<BiliBiliProtocol<LinkDrawResult>>>{};
  }

  @WebAuthorize()
  @GET('link_draw/v1/doc/others')
  async getOthers(
    @QueryMapW()
    query: {
      poster_uid: number;
      page_num: number;
      page_size: number;
    },
  ): Promise<Response<BiliBiliProtocol<LinkDrawResult>>> {
    return <Response<BiliBiliProtocol<LinkDrawResult>>>{};
  }

  @WebAuthorize()
  @POST('user_plus/v1/Fav/add')
  async favorite(
    @QueryMapW()
    query: {
      fav_id: number;
      biz: Enum_Biz;
    },
  ): Promise<Response<void>> {
    return <Response<void>>{};
  }

  @WebAuthorize()
  @POST('user_plus/v1/Fav/delete')
  async unfvorite(
    @QueryMapW()
    query: {
      fav_id: number;
      biz: Enum_Biz;
    },
  ): Promise<Response<void>> {
    return <Response<void>>{};
  }
}
