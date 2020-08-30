import { observable, action, computed } from 'mobx';

class AppStore {
  @observable private _loading = true;
  @observable public tabBarVisible = true;
  @observable public tabBarLayout: any;

  public constructor() { }

  @action.bound
  public ready() {
    this._loading = false;
  }

  @computed
  get loading() {
    return this._loading;
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
