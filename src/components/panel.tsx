import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { colors } from '~/constants';

export default class Panel extends React.PureComponent<{
  style?: StyleProp<ViewStyle>;
}> {
  render() {
    const { children, style } = this.props;
    return <View style={[styles.pannel, style]}>{children}</View>;
  }
}

const styles = StyleSheet.create({
  pannel: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
