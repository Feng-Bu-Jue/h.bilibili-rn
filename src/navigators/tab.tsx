/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  TouchableNativeFeedback,
  Dimensions,
  StyleSheet,
} from 'react-native';
import IconPicfill from '~/assets/iconfont/IconPicfill';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { TabView, SceneMap } from 'react-native-tab-view';
import DrawList from '~/screens/list';
import TabBarItem from '~/components/tabView/tabBarItem';
import TabBar from '~/components/tabView/tabBar';
import { colors } from '~/utils/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export type Tab = {
  label: string;
  icon: string;
};

const TestScreen = () => {
  return <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />;
};

const initialLayout = { width: Dimensions.get('window').width };

const renderScene = SceneMap({
  first: () => <DrawList pageType={'draw'} />,
  second: () => <DrawList pageType={'cos'} />,
});

export function DrawListTabView() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Draw' },
    { key: 'second', title: 'Cosplay' },
  ]);

  const insets = useSafeAreaInsets();

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={(props) => {
        return (
          <View
            style={[
              {
                alignItems: 'center',
                backgroundColor: colors.white,
                paddingTop: insets.top,
                paddingBottom: 10,
                marginBottom: 10,
                elevation: 4,
                shadowColor: colors.black,
                shadowOpacity: 0.1,
                shadowRadius: StyleSheet.hairlineWidth,
                shadowOffset: {
                  height: StyleSheet.hairlineWidth,
                  width: 0,
                },
              },
            ]}>
            <TabBar
              {...props}
              activeColor={colors.pink}
              inactiveColor={'rgb(70,70,70)'}
              tabStyle={{ width: 'auto' }}
              style={{
                flex: 0,
                height: 50,
                elevation: 0,
                shadowColor: undefined,
                shadowOpacity: 0,
                shadowRadius: 0,
                shadowOffset: {
                  height: 0,
                  width: 0,
                },
                backgroundColor: colors.white,
              }}
              contentContainerStyle={{ flex: 0 }}
              indicatorStyle={{ backgroundColor: colors.pink, height: 3 }}
              renderTabBarItem={(itemProps) => {
                return (
                  <TabBarItem {...itemProps} containerStyle={{ flex: 0 }} />
                );
              }}
            />
          </View>
        );
      }}
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      screenOptions={({ route }) => ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tabBarIcon: ({ focused, color, size }) => {
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
      <Tab.Screen name="home1" component={DrawListTabView} />
      <Tab.Screen name="home" component={TestScreen} />
    </Tab.Navigator>
  );
};

export default TabMenu;
