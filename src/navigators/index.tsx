import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabScreens, StackScreens } from '~/typings/screens';
import { createStackNavigator } from '@react-navigation/stack';
import DrawDetail from '~/screens/draw/detail';
import { TabMenu } from './tab';

const Stack = createStackNavigator();

export const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ route }) => {
          if (route.name === TabScreens.Home.toString()) {
            return { headerShown: false };
          }
          return {};
        }}>
        <Stack.Screen name={TabScreens.Home} component={TabMenu} />
        <Stack.Screen name={StackScreens.DrawDetail} component={DrawDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
