/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseService,
  Response,
  POST,
  ActionFilter,
  Filter,
  BasePath,
  FormUrlEncoded,
  Field,
  GET,
  Query,
} from 'ts-retrofit';
import { ApiEndponits, FieldMapW, QueryMapW, FixedParms } from '../extensions';
import {
  BiliBiliProtocol,
  RSAPublicKeyResult,
  AuthResult,
  SSOResult,
} from '../typings';
import { SignHelper } from '../util';
import { apiConfig } from '../contact';

@BasePath('')
export class AuthService extends BaseService {
  @POST(`${ApiEndponits.passport}api/v3/oauth2/login`)
  @FormUrlEncoded
  @FixedParms()
  async login(
    @FieldMapW()
    query: any,
  ): Promise<Response<BiliBiliProtocol<AuthResult>>> {
    return <Response<BiliBiliProtocol<AuthResult>>>{};
  }

  @GET(`${ApiEndponits.passport}login`)
  async getEncryptKey(
    @QueryMapW()
    query = { act: 'getkey', _: Date.now().toString().substr(0, 10) },
  ): Promise<Response<RSAPublicKeyResult>> {
    return <Response<RSAPublicKeyResult>>{};
  }

  @GET(`${ApiEndponits.kaaassNet}biliapi/user/sso`)
  async freshSSO(
    @Query('access_key')
    accessToken: string,
    @Query('appkey')
    appkey: string,
  ): Promise<Response<BiliBiliProtocol<SSOResult>>> {
    return <Response<BiliBiliProtocol<SSOResult>>>{};
  }

  @GET(`${ApiEndponits.api}login/sso`)
  async SSO(
    @Query('access_key')
    accessToken: string,
    @Query('appkey')
    appkey: string = apiConfig.appkey,
  ): Promise<Response<BiliBiliProtocol<SSOResult>>> {
    return <Response<BiliBiliProtocol<SSOResult>>>{};
  }
}
