import React from 'react';
import {enableScreens} from 'react-native-screens';
import {Router} from '~/navigators';
import {Splash} from '~/components/splash';
import {observer} from 'mobx-react';
import {appStore} from '~/stores/appStore';
enableScreens();

const sleep = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

type AppProps = {};

@observer
class App extends React.Component<AppProps> {
  constructor(props: AppProps) {
    super(props);
    this.ready();
  }

  async ready() {
    await sleep(1000);
    appStore.ready();
  }

  render() {
    return appStore.loading ? <Splash /> : <Router />;
  }
}

export default App;
