import { observable, action, computed, runInAction } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import { StorageKey } from '~/constants/key';
import { AuthInfo } from '~/typings/storage';

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
  @observable authInfo?: AuthInfo;
  @observable authCookie?: string;

  public constructor() {}

  @computed
  get loading() {
    return this._loading;
  }

  @action.bound
  public async ready() {
    const authInfoJson = await AsyncStorage.getItem(StorageKey.AuthInfo);
    const authCookie = await AsyncStorage.getItem(StorageKey.AuthCookie);
    if (authInfoJson && authCookie) {
      runInAction(() => {
        this.authInfo = JSON.parse(authInfoJson);
        this.authCookie = authCookie;
      });
    }
    await sleep(1000); // 在这里埋伏他一手(啊 这... 摸鱼是多么美妙呀 滑稽)
    runInAction(() => {
      this._loading = false;
    });
  }

  @action.bound
  async saveAuthResult(cookie: string) {
    let cookies = cookie.split('; ').filter((x) => x);
    let csrf_token = cookies!
      .find((x) => x.includes('bili_jct'))!
      .split('=')[1];
    let mid = parseInt(
      cookies!.find((x) => x.includes('DedeUserID'))!.split('=')[1],
      10,
    );
    runInAction(() => {
      this.authInfo = { csrf_token, mid };
      this.authCookie = cookie;
    });
    await AsyncStorage.setItem(
      StorageKey.AuthInfo,
      JSON.stringify({ csrf_token, mid }),
    );
    await AsyncStorage.setItem(StorageKey.AuthCookie, JSON.stringify(cookie));
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
