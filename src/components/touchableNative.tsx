import React from 'react';
import {
  Platform,
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
} from 'react-native';

const LOLLIPOP = 21;
type Props = ViewProps &
  Partial<TouchableNativeFeedbackProps> &
  Partial<TouchableOpacityProps> & {
    borderless?: boolean;
    pressColor: string;
    pressOpacity?: number;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
  };

export default class TouchableNative extends React.Component<Props> {
  static defaultProps = {
    pressColor: 'rgba(255, 255, 255, .4)',
  };

  render() {
    const {
      style,
      pressOpacity,
      pressColor,
      borderless,
      children,
      ...rest
    } = this.props;

    if (Platform.OS === 'android' && Platform.Version >= LOLLIPOP) {
      return (
        <TouchableNativeFeedback
          {...rest}
          background={TouchableNativeFeedback.Ripple(pressColor, borderless)}>
          <View style={style}>{React.Children.only(children)}</View>
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableOpacity {...rest} style={style} activeOpacity={pressOpacity}>
          {children}
        </TouchableOpacity>
      );
    }
  }
}
