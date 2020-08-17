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
    pressOpacity?: number;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
  };

export default class TouchableNative extends React.Component<Props> {
  render() {
    const { style, pressOpacity, children, ...rest } = this.props;

    if (Platform.OS === 'android' && Platform.Version >= LOLLIPOP) {
      return (
        <TouchableNativeFeedback {...rest}>
          <View style={style}>{children}</View>
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
