import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  TouchableNativeFeedback,
  Dimensions,
  StyleSheet,
} from 'react-native';
import IconPicfill from '~/assets/iconfont/IconPicfill';
import {BottomTabBarButtonProps} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {TabView, SceneMap} from 'react-native-tab-view';

const Tab = createBottomTabNavigator();

export type Tab = {
  label: string;
  icon: string;
};

const TestScreen = () => {
  return (
    <View>
      <Text style={{color: '#000'}}>{'test'}</Text>
    </View>
  );
};

const FirstRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#ff4081'}]} />
);

const SecondRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#673ab7'}]} />
);

const initialLayout = {width: Dimensions.get('window').width};

export function TabViewExample() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'First'},
    {key: 'second', title: 'Second'},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

const TabMenu = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          // You can return any component that you like here!
          return <IconPicfill />;
        },
        tabBarButton: ({
          children,
          style,
          onPress,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          to,
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
      <Tab.Screen name="home1" component={TabViewExample} />
      <Tab.Screen name="home" component={TestScreen} />
    </Tab.Navigator>
  );
};

export default TabMenu;
