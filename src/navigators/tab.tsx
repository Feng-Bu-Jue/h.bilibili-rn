import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '~/constants';
import { TabScreens } from '~/typings/screens';
import IconPicfill from '~/assets/iconfont/IconPicfill';
import IconPeople from '~/assets/iconfont/IconPeople';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { View } from 'react-native';
import { TouchableNative } from '~/components';
import { DrawListTabView } from '~/screens/draw/list';

const Tab = createBottomTabNavigator();
const TestScreen = () => {
  return <View />;
};

export const TabMenu = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.pink,
        inactiveTintColor: colors.black,
        iconStyle: { flex: 0, marginBottom: 10 },
        labelStyle: {
          marginBottom: 6,
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          switch (route.name) {
            case TabScreens.Home:
              return <IconPicfill color={color} />;
            case TabScreens.Me:
              return <IconPeople color={color} />;
          }
        },
        tabBarButton: ({
          children,
          onPress,
          accessibilityRole,
          ...rest
        }: BottomTabBarButtonProps) => {
          return (
            <TouchableNative
              {...rest}
              accessibilityRole={accessibilityRole}
              onPress={onPress}>
              {children}
            </TouchableNative>
          );
        },
      })}>
      <Tab.Screen name={TabScreens.Home} component={DrawListTabView} />
      <Tab.Screen name={TabScreens.Me} component={TestScreen} />
    </Tab.Navigator>
  );
};
