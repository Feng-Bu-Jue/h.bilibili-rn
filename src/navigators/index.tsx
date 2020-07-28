import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '~/constants';
import { TabScreens } from '~/typings/screens';
import IconPicfill from '~/assets/iconfont/IconPicfill';
import IconPeople from '~/assets/iconfont/IconPeople';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { HomeStackScreen } from './home';

const Tab = createBottomTabNavigator();
const TestScreen = () => {
  return <View />;
};

const TabMenu = () => {
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
          style,
          onPress,
          accessibilityRole,
          ...rest
        }: BottomTabBarButtonProps) => {
          return (
            <TouchableNativeFeedback
              {...rest}
              accessibilityRole={accessibilityRole}
              onPress={onPress}>
              <View style={style}>{children}</View>
            </TouchableNativeFeedback>
          );
        },
      })}>
      <Tab.Screen name={TabScreens.Home} component={HomeStackScreen} />
      <Tab.Screen name={TabScreens.Me} component={TestScreen} />
    </Tab.Navigator>
  );
};

export const Router = () => {
  return (
    <NavigationContainer>
      <TabMenu />
    </NavigationContainer>
  );
};
