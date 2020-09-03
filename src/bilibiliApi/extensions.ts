import { BaseService, QueryMap, ServiceBuilder, FieldMap } from 'ts-retrofit';
import { appStore } from '~/stores/appStore';

export const ApiEndponits = {
  apivc: 'http://api.vc.bilibili.com/',
  api: 'http://api.bilibili.com/',
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
      if (appStore.authCookie) {
        config.headers.useragent =
          'Mozilla/5.0 BiliDroid/5.44.2 (bbcallen@gmail.com)';
        config.headers.referer = 'https://www.bilibili.com/';
        config.headers.cookie = appStore.authCookie;
      }
      return config;
    })
    .setResponseInterceptors((response) => {
      //handling 401
      return response;
    })
    .build(service);
};

/*
以下代码 放弃中...
!!! 写个泛型可把我累死了
*/
/* const RegisteredServices = {
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

export default BuildToExports(RegisteredServices); */
