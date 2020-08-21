import React from 'react';
import { enableScreens } from 'react-native-screens';
import { Router } from '~/navigators';
import { Splash } from '~/components/splash';
import { observer } from 'mobx-react';
import { appStore } from '~/stores/appStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Platform, View, Text, FlatList } from 'react-native';
import { colors } from '~/constants/colors';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { layout } from '~/constants';
import { observable, runInAction } from 'mobx';

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
export default class App extends React.Component<AppProps> {
  constructor(props: AppProps) {
    super(props);
    this.ready();
  }

  async ready() {
    await sleep(1000);
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
        {appStore.loading ? <Splash /> : <Router />}
      </SafeAreaProvider>
    );
  }
}

/*
@observer
export default class Example extends React.Component {
  @observable
  enable = true;

  ref = React.createRef();
  scrollRef = React.createRef();

  flatListRef: FlatList<string> | null = null;

  onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    console.log(event.nativeEvent.translationY);
    if (event.nativeEvent.translationY <= -100 && this.enable === true) {
      runInAction(() => {
        this.enable = false;
      });
    }
  };

  render() {
    return (
      <PanGestureHandler
        ref={this.ref}
        enabled={this.enable}
        onGestureEvent={this.onGestureEvent}>
        <View>
          <View
            style={{
              ...layout.border([1], colors.pink),
              height: 100,
              backgroundColor: colors.gray,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{'header'}</Text>
          </View>
          <FlatList
            ref={this.scrollRef}
            waitFor={this.enable ? this.ref : this.scrollRef}
            //ref={(r) => (this.flatListRef = r)}
            data={Object.entries(Array(20).fill(null)).map(([key]) => key)}
            keyExtractor={(item) => String(item)}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    ...layout.border([1], colors.pink),
                    height: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>{item}</Text>
                </View>
              );
            }}
          />
        </View>
      </PanGestureHandler>
    );
  }
}
*/
