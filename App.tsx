import React from 'react';
import { enableScreens } from 'react-native-screens';
import { Router } from '~/navigators';
import { Splash } from '~/components/splash';
import { observer } from 'mobx-react';
import { appStore } from '~/stores/appStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  StatusBar,
  Platform,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { colors } from '~/constants/colors';
import Popover from 'react-native-popover-view';

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
    await sleep(10000);
    appStore.ready();
  }

  render() {
    return (
      <SafeAreaProvider>
        {Platform.OS === 'android' && (
          <StatusBar
            barStyle={Platform.Version >= 23 ? 'dark-content' : 'light-content'}
            translucent
            backgroundColor={colors.transparent}
          />
        )}
        {appStore.loading ? (
          <Popover
            from={
              <View style={{ marginTop: 100 }}>
                <TouchableOpacity>
                  <Text>Press here to open popover!</Text>
                </TouchableOpacity>
              </View>
            }>
            <Text>This is the contents of the popover</Text>
          </Popover>
        ) : (
          <Router />
        )}
      </SafeAreaProvider>
    );
  }
}

export default App;
