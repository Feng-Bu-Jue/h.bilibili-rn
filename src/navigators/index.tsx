import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabScreens, StackScreens } from '~/typings/screens';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackCardStyleInterpolator,
  StackCardInterpolationProps,
} from '@react-navigation/stack';
import DrawDetail from '~/screens/draw/detail';
import { TabMenu } from './tab';
import { sizes, colors } from '~/constants';
import { Platform, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

export const cardStyleInterpolator: StackCardStyleInterpolator = (
  props: StackCardInterpolationProps,
) => {
  const { current, layouts } = props;

  return {
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.25, 1],
      }),
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },

    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  };
};

const defaultScreenOptions: StackNavigationOptions = {
  ...StyleSheet.create({
    headerStyle: {
      height: sizes.headerHeight,
      backgroundColor: colors.pink,
    },
  }),
  headerStatusBarHeight: Platform.select({
    android: sizes.statuHeight,
  }),
  animationEnabled: true,
  cardStyleInterpolator: cardStyleInterpolator,
};

export const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ route }) => {
          if (route.name === TabScreens.Home.toString()) {
            return Object.assign({ headerShown: false }, defaultScreenOptions);
          }
          return defaultScreenOptions;
        }}>
        <Stack.Screen name={TabScreens.Home} component={TabMenu} />
        <Stack.Screen name={StackScreens.DrawDetail} component={DrawDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
