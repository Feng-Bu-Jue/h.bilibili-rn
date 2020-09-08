import {
  BaseService,
  QueryMap,
  ServiceBuilder,
  FieldMap,
  MethodContext,
  Response,
} from 'ts-retrofit';
import { appStore } from '~/stores/appStore';
import { AxiosRequestConfig } from 'axios';
import { apiConfig } from './contact';
import { SignHelper } from './util';

export const ApiEndponits = {
  apivc: 'http://api.vc.bilibili.com/',
  api: 'http://api.bilibili.com/',
  app: 'http://app.bilibili.com/',
  kaaassNet: 'http://api.kaaass.net/',
  apiLive: 'http://api.live.bilibili.com/',
  passport: 'http://passport.bilibili.com/',
};

export const ApiDescriptor = (descriptor: keyof typeof ApiEndponits) => {
  return (target: typeof BaseService) => {
    if (!target.prototype.__meta__) {
      target.prototype.__meta__ = {};
    }
    target.prototype.__meta__.ApiDescriptor = descriptor;
  };
};
export const WebAuthorize = () => {
  return (target: any, methodName: string) => {
    if (!target.__meta__[methodName]) {
      target.__meta__[methodName] = {};
    }
    target.__meta__[methodName].WebAuthorize = true;
  };
};
export const AppAuthorize = () => {
  return (target: any, methodName: string) => {
    if (!target.__meta__[methodName]) {
      target.__meta__[methodName] = {};
    }
    target.__meta__[methodName].AppAuthorize = true;
  };
};
//TODO 先wrap下 不清楚为啥不支持直接使用parameter decorator, 马萨卡 要去看babel的实现...
export const QueryMapW = () => {
  return QueryMap;
};

export const FieldMapW = () => {
  return FieldMap;
};

export const buildApi = <T>(service: new (builder: ServiceBuilder) => T) => {
  const endpoint = (ApiEndponits as any)[
    service.prototype.__meta__.ApiDescriptor
  ];
  const builder = new ServiceBuilder();
  if (endpoint) {
    builder.setEndpoint(endpoint);
  }
  return builder
    .setStandalone(true)
    .setRequestInterceptors((config) => {
      config.headers['User-Agent'] = 'Mozilla/5.0 BiliDroid/5.44.2';
      config.headers.Referer = 'https://www.bilibili.com/';
      config.headers.Cookie = appStore.cookies;
      return config;
    })
    .setResponseInterceptors((response) => {
      //handling 401
      return response;
    })
    .setFilters({
      invoke(
        methodContext: MethodContext,
        config: AxiosRequestConfig,
        next: () => Promise<Response>,
      ): Promise<Response> {
        const { meta, methodName } = methodContext;

        // handling WebAuthorize
        if (meta[methodName]?.WebAuthorize) {
          if (appStore.authCookie) {
            const { method } = config;
            const csrf_token = appStore.authCookie.cookies.find(
              (x) => x.name === 'bili_jct',
            );
            if (method === 'GET') {
              config.params.csrf_token = csrf_token;
            } else {
              config.data += '&csrf_token=' + csrf_token; // 和下面的情况一样 TODO
            }
          }
        }

        // handling AppAuthorize
        if (meta[methodName]?.AppAuthorize) {
          const { method } = config;
          const fixedParams = {
            appkey: apiConfig.appkey,
            build: 5520400,
            mobi_app: 'android',
            platform: 'android',
            ts: Date.now().toString().substr(0, 10),
          } as any;
          if (appStore.authToken?.access_token) {
            fixedParams.access_key = appStore.authToken?.access_token;
          }
          let params: any;
          if (method === 'GET') {
            params = Object.assign(config.params, fixedParams);
          } else {
            params = Object.assign({}, fixedParams, ...methodContext.args);
          }
          params.sign = SignHelper.md5Sign(params, (signString) =>
            signString.concat(apiConfig.appSecret),
          );
          // 还需要对ts-retrofit进行较大改造,
          // config.data 要在所有filter 执行完成后再 构建 (需要一个 requestBuilder 类 在context中可以访问)
          // todo contenttype dataresolver
          if (method !== 'GET') {
            config.data = Object.entries(params)
              .map(([k, v]) => `${k}=${encodeURIComponent(v as any)}`)
              .join('&');
          }
        }

        return next();
      },
    })
    .build(service);
};

// 以下代码 放弃中...
// !!! 写个泛型可把我累死了
/*
const RegisteredServices = {
  ['LinkDrawApi']: LinkDrawService,
};

const BuildToExports = <
  //TReturn,
  //TValue extends new (builder: ServiceBuilder) => TReturn,

  T extends { [P in keyof T]: T[P] }
>(
  exports: T,
): { [P in keyof T]: T[P] } => {
  const exportsObject: {
    [P in keyof T]: T[P];
  } = {} as any;
  for (let [key, value] of Object.entries(exports)) {
    (exportsObject as any)[key] = buildApi(value as any);
  }
  return exportsObject;
};

export default BuildToExports(RegisteredServices);
*/
