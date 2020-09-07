import { observable, action, computed, runInAction } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import { StorageKey } from '~/constants/key';
import { CookieInfo, AuthResult, AuthToken } from '~/bilibiliApi/typings';

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
  @observable authCookie?: CookieInfo;

  public constructor() {}

  @computed
  get loading() {
    return this._loading;
  }

  @computed
  get cookies() {
    if (this.authCookie) {
      return this.authCookie.cookies
        .map((x) => `${x.name}=${x.value}`)
        .join('&');
    }
    return undefined;
  }

  @action.bound
  public async ready() {
    const authTokenJson = await AsyncStorage.getItem(StorageKey.AuthToken);
    const cookieInfoJson = await AsyncStorage.getItem(StorageKey.AuthCookie);
    if (authTokenJson && cookieInfoJson) {
      runInAction(() => {
        this.authToken = JSON.parse(authTokenJson);
        this.authCookie = JSON.parse(cookieInfoJson);
      });
    }
    await sleep(1000); // 在这里埋伏他一手
    runInAction(() => {
      this._loading = false;
    });
  }

  @action.bound
  async saveAuthResult(authResult: AuthResult) {
    runInAction(() => {
      this.authToken = authResult.token_info;
      this.authCookie = authResult.cookie_info;
    });
    await AsyncStorage.setItem(
      StorageKey.AuthToken,
      JSON.stringify(authResult.token_info),
    );
    await AsyncStorage.setItem(
      StorageKey.AuthCookie,
      JSON.stringify(authResult.cookie_info),
    );
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
