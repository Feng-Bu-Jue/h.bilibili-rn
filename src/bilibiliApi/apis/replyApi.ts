/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseService, GET, Response, POST, Queries } from 'ts-retrofit';
import { ApiDescriptor, buildApi, QueryMapW } from '..';
import { BiliBiliProtocol, ReplyResult, AddReplyResult } from '../typings';

@ApiDescriptor('api')
export class Reply extends BaseService {
  @GET('x/v2/reply')
  @Queries({
    type: 11,
    sort: 0,
    jsonp: 'jsonp',
  })
  async getReplies(
    @QueryMapW()
    query: {
      oid: number;
      pn: number;
      sort: number;
      type?: number;
    },
  ): Promise<Response<BiliBiliProtocol<ReplyResult>>> {
    return <Response<BiliBiliProtocol<ReplyResult>>>{};
  }

  @POST('x/v2/reply/add')
  async addReply(
    @QueryMapW()
    query: {
      todo: string;
    },
  ): Promise<Response<BiliBiliProtocol<AddReplyResult>>> {
    return <Response<BiliBiliProtocol<AddReplyResult>>>{};
  }
}

export const ReplyApi = buildApi(Reply);
