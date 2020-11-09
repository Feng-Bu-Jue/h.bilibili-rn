import { observable, action, computed, runInAction } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import { StorageKey } from '~/constants/key';
import { AuthResult, AuthToken } from '~/bilibiliApi/typings';
import CookieManager from '@react-native-community/cookies';
import { toDatetime } from '~/utils/date';

const sleep = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

class AppStore {
  @observable private _loading = true;
  @observable public tabBarVisible = true;
  @observable authToken?: AuthToken;
  @observable csrf_token?: string;

  public constructor() {}

  @computed
  get loading() {
    return this._loading;
  }

  @action.bound
  public async ready() {
    const authTokenJson = await AsyncStorage.getItem(StorageKey.AuthToken);
    const csrf_token = await AsyncStorage.getItem(StorageKey.AuthCookie);
    if (authTokenJson && csrf_token) {
      runInAction(() => {
        this.authToken = JSON.parse(authTokenJson);
        this.csrf_token = csrf_token;
      });
    }
    await sleep(1000); // 在这里埋伏他一手
    runInAction(() => {
      this._loading = false;
    });
  }

  @action.bound
  async saveAuthResult(authResult: AuthResult) {
    const csrf_token = authResult.cookie_info.cookies.find(
      (x) => x.name === 'bili_jct',
    )!.value;
    runInAction(() => {
      this.authToken = authResult.token_info;
      this.csrf_token = csrf_token;
    });
    await AsyncStorage.setItem(
      StorageKey.AuthToken,
      JSON.stringify(authResult.token_info),
    );
    await AsyncStorage.setItem(StorageKey.AuthCookie, csrf_token);
    for (let i = 0; i < authResult.cookie_info.cookies.length; i++) {
      const cookie = authResult.cookie_info.cookies[i];
      for (let n = 0; n < authResult.cookie_info.domains.length; n++) {
        const domain = authResult.cookie_info.domains[n];
        await CookieManager.set(`http://www.${domain}`, {
          name: cookie.name,
          value: cookie.value,
          domain: domain,
          path: '/',
          version: '1',
          expires: toDatetime(new Date(Date.now() + cookie.expires * 1000)),
        });
      }
    }
  }

  @action.bound
  showTabBar() {
    this.tabBarVisible = true;
  }

  @action.bound
  hideTabBar() {
    this.tabBarVisible = false;
  }
}

export const appStore = new AppStore();
