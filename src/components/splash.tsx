import React from 'react';
import LottieView from 'lottie-react-native';
import { animations } from '~/assets/animations';
import { View } from 'react-native';

export const Splash = () => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1 }}>
      <LottieView source={animations.loading} autoPlay loop />
    </View>
  );
};
