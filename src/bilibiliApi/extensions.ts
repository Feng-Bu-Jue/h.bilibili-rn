import { BaseService, QueryMap, ServiceBuilder } from 'ts-retrofit';

const ApiEndponits = {
  apivc: 'https://api.vc.bilibili.com/',
  api: 'https://api.bilibili.com/',
  kaaassNet: 'https://api.kaaass.net/',
  apiLive: 'https://api.live.bilibili.com/',
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

export const buildApi = <T>(service: new (builder: ServiceBuilder) => T) => {
  const endpoint = (ApiEndponits as any)[
    service.prototype.__meta__.ApiDescriptor
  ];
  return new ServiceBuilder()
    .setEndpoint(endpoint)
    .setStandalone(true)
    .setRequestInterceptors((config) => {
      // config.onDownloadProgress;
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
