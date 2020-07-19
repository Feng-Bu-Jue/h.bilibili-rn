import { observable, action, computed } from 'mobx';

class AppStore {
  @observable private _loading = true;
  public constructor() {}

  @action.bound
  public ready() {
    this._loading = false;
  }

  @computed
  get loading() {
    return this._loading;
  }
}

export const appStore = new AppStore();
