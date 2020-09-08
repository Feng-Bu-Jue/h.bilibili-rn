/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseService, GET, Response, POST } from 'ts-retrofit';
import {
  QueryMapW,
  ApiDescriptor,
  WebAuthorize,
  FieldMapW,
} from '../extensions';
import { BiliBiliProtocol, ReplyResult, AddReplyResult } from '../typings';

@ApiDescriptor('api')
export class ReplyService extends BaseService {
  @WebAuthorize()
  @GET('x/v2/reply')
  async getReplies(
    @QueryMapW()
    query: {
      oid: number;
      pn: number;
      sort: number;
      type: number;
    },
  ): Promise<Response<BiliBiliProtocol<ReplyResult>>> {
    return <Response<BiliBiliProtocol<ReplyResult>>>{};
  }

  @WebAuthorize()
  @POST('x/v2/reply/add')
  async addReply(
    @FieldMapW()
    fields: {
      oid: number;
      message: string;
      root: number;
      parent: number;
    },
  ): Promise<Response<BiliBiliProtocol<AddReplyResult>>> {
    return <Response<BiliBiliProtocol<AddReplyResult>>>{};
  }

  @WebAuthorize()
  @POST('x/v2/reply/action')
  async action(
    @FieldMapW()
    fields: {
      oid: number;
      rpid: number;
      action: number;
    },
  ): Promise<Response<BiliBiliProtocol<void>>> {
    return <Response<BiliBiliProtocol<void>>>{};
  }
}
