import React from 'react';
import {
  EmitterSubscription,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import { IReactionDisposer, observable, runInAction } from 'mobx';
import { colors } from '~/constants';
import { HeaderBackground, StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '~/typings/navigation';

export default class BaseComponent<
  P = {},
  S = {},
  SS = any
> extends React.Component<P, S, SS> {
  $listeners: EmitterSubscription[] = [];
  $reactionDisposers: Array<IReactionDisposer> = [];

  componentWillUnmount() {
    this.$reactionDisposers?.forEach((_) => _());
    this.$listeners.forEach((_) => _.remove());
    this.$onWillUnmount();
  }

  $onWillUnmount(): void {}
}

enum HeaderStatus {
  transparent,
  nonTransparent,
}

export class BaseComponentWithAnimatedHeader<
  P extends {
    navigation: StackNavigationProp<RootParamList, any>;
    route: any;
  },
  S = {},
  SS = any
> extends BaseComponent<P, S, SS> {
  @observable
  protected $isHeaderTransparent: boolean = true;
  protected $scolloffsetY: Animated.Value = new Animated.Value(0);
  protected $currentHeaderStatus?: HeaderStatus;

  constructor(props: P) {
    super(props);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.$scolloffsetY.removeAllListeners();
  }

  $useAnimatedHeadaer(
    headerTitle: string,
    headerBoxHeight: number = 160,
    defaultColor: string = colors.white,
  ) {
    this.$scolloffsetY.removeAllListeners();
    const backgroundColor: any = this.$scolloffsetY.interpolate({
      inputRange: [0, headerBoxHeight],
      outputRange: [colors.transparent, colors.white],
    });
    this.$scolloffsetY.addListener(({ value }: { value: number }) => {
      const status =
        value >= headerBoxHeight
          ? HeaderStatus.nonTransparent
          : HeaderStatus.transparent;

      if (this.$currentHeaderStatus !== status) {
        this.$currentHeaderStatus = status;
        const isTransparent = status === HeaderStatus.transparent;
        this.props.navigation.setOptions({
          headerTintColor: isTransparent ? defaultColor : colors.black,
          headerStyle: {
            backgroundColor,
            ...(isTransparent ? { shadowOpacity: 0, elevation: 0 } : {}),
          },
        });
        runInAction(() => {
          this.$isHeaderTransparent = isTransparent;
        });
      }
    });
    this.props.navigation.setOptions({
      title: headerTitle,
      headerTransparent: true,
      headerTitleStyle: {
        color: this.$scolloffsetY.interpolate({
          inputRange: [0, headerBoxHeight],
          outputRange: [colors.transparent, colors.black],
        }),
      },
      headerTintColor: defaultColor,
      headerStyle: {
        backgroundColor,
        shadowOpacity: 0,
        elevation: 0,
      },
      headerBackground: (p) => <HeaderBackground {...(p as any)} />,
    });
  }

  $renderStatusBar() {
    if (Platform.OS === 'android') {
      <StatusBar
        barStyle={
          !this.$isHeaderTransparent && Platform.Version >= 23
            ? 'dark-content'
            : 'light-content'
        }
        translucent
        backgroundColor={colors.transparent}
      />;
    }
    return <></>;
  }
}
