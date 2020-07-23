import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabMenu from './tab';

export const Router = () => {
  return (
    <NavigationContainer>
      <TabMenu />
    </NavigationContainer>
  );
};
