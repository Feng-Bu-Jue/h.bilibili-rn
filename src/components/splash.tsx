import React from 'react';
import LottieView from 'lottie-react-native';
import {animations} from '~/assets/animations';
import {View} from 'react-native';

export const Splash = () => {
  return (
    <View>
      <LottieView source={animations.loading} autoPlay loop />
    </View>
  );
};
