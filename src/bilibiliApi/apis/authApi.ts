/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseService,
  Response,
  POST,
  Queries,
  ActionFilter,
  Filter,
  Query,
} from 'ts-retrofit';
import { QueryMapW, ApiEndponits } from '../extensions';
import { BiliBiliProtocol, ReplyResult, AddReplyResult } from '../typings';
import { SignHelper } from '../util';

const signatureFilter: Filter = {
  invoke: (methodContext, config, next) => {
    console.log(config.params);
    const appSecret = '560c52ccd288fed045859ed18bffd973';
    SignHelper.md5Sign(config.params, (signString) =>
      signString.concat(appSecret),
    );
    return next();
  },
};

export class AuthService extends BaseService {
  @POST(`${ApiEndponits.passport}api/v3/oauth2/login`)
  @ActionFilter(signatureFilter)
  async login(
    @QueryMapW()
    query: any,
  ): Promise<Response<BiliBiliProtocol<ReplyResult>>> {
    return <Response<BiliBiliProtocol<ReplyResult>>>{};
  }

  @POST(`${ApiEndponits.passport}login`)
  async encryptPassword(
    @QueryMapW()
    query = { act: 'getkey', _: Date.now().toString().substr(0, 10) },
  ): Promise<Response<BiliBiliProtocol<AddReplyResult>>> {
    return <Response<BiliBiliProtocol<AddReplyResult>>>{};
  }

  @POST(`${ApiEndponits.kaaassNet}biliapi/user/sso`)
  async freshSSO(
    @Query('access_key')
    accessToken: string,
  ): Promise<Response<BiliBiliProtocol<AddReplyResult>>> {
    return <Response<BiliBiliProtocol<AddReplyResult>>>{};
  }
}
