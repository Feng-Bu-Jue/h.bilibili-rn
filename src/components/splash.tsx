import React from 'react';
import { View } from 'react-native';
import IconBilibili from '~/assets/iconfont/IconBilibili';
import { colors } from '~/constants';

export const Splash = () => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <IconBilibili size={150} color={colors.pink} />
    </View>
  );
};
