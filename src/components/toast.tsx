import React from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  ViewStyle,
  View,
  TextStyle,
} from 'react-native';
import { observer } from 'mobx-react';
import { observable, IReactionDisposer, reaction } from 'mobx';
import merge from 'lodash.merge';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { sizes, layout, colors } from '~/constants';

type ToastType = 'error' | 'none';

type ToastConfig = {
  content?: string;
  duration?: number;
  type?: ToastType;
};

type ToastProps = {
  content: string;
  duration?: number;
  type?: ToastType;
  showing: boolean;
  index?: number;
  toggleShowing: () => void;
  destory?: () => void;
};

type ToastsProps = {
  toasts: Map<number, ToastProps>;
};

@observer
export default class Toasts extends React.PureComponent<ToastsProps> {
  constructor(props: ToastsProps) {
    super(props);
  }

  render(): React.ReactNode {
    const { toasts } = this.props;
    return (
      toasts &&
      Array.from(toasts.values()).map((toast) => {
        return <Toast {...toast} key={toast.index} />;
      })
    );
  }
}

@observer
export class Toast extends React.PureComponent<ToastProps> {
  static contextType = SafeAreaInsetsContext;

  @observable toastOpacity = new Animated.Value(0);
  enterAnimation: Animated.CompositeAnimation; //入场动画
  leaveAnimation: Animated.CompositeAnimation; //退场动画

  private timer: number | undefined;
  private toastDisposer: IReactionDisposer;
  constructor(props: ToastProps) {
    super(props);

    this.enterAnimation = Animated.timing(this.toastOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    });
    this.leaveAnimation = Animated.timing(this.toastOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    });

    this.toastDisposer = reaction(
      () => this.props.showing,
      (showing) => {
        if (showing) {
          this.present();
        } else {
          this.dismiss();
        }
      },
      {
        fireImmediately: true,
      },
    );
  }

  protected present() {
    this.enterAnimation.start(() => {
      this.timer = setTimeout(() => {
        this.props.toggleShowing();
      }, this.props.duration);
    });
  }

  protected dismiss() {
    this.leaveAnimation.start(() => {
      this.props.destory?.call(null);
    });
  }

  destoryReaction() {
    this.toastDisposer && this.toastDisposer();
  }

  componentWillUnmount() {
    this.destoryReaction();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render(): React.ReactNode {
    const { content, type, index } = this.props;
    const { toastMask, toastBox, toastContent } = getToastStyles(type!);
    const insets = this.context;
    if (toastMask?.zIndex) {
      toastMask.zIndex = toastMask.zIndex + index!;
    }
    return (
      <View style={toastMask} pointerEvents={'none'}>
        <Animated.View
          style={{
            ...toastBox,
            paddingTop: insets?.top || 13,
            opacity: this.toastOpacity,
          }}>
          <Text style={toastContent}>{content}</Text>
        </Animated.View>
      </View>
    );
  }
}

const getToastStyles = (type: ToastType) => {
  const styleMatchingMap: {
    [key: string]: { [style: string]: ViewStyle };
  } = {
    error: {
      toastBox: { backgroundColor: colors.cinnabar },
    },
    none: {
      toastBox: { backgroundColor: colors.black70 },
    },
  };
  return merge({}, ToastBaseStyles, styleMatchingMap[type]);
};

const ToastBaseStyles = StyleSheet.create({
  toastMask: {
    position: 'absolute',
    width: '100%',
    zIndex: sizes.zIndexMax,
  },
  toastBox: {
    flexDirection: 'row',
    ...layout.padding(13, 15),
  },
  toastContent: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
  } as TextStyle,
});
