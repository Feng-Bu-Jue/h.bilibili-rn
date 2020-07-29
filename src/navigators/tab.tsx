/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '~/constants';
import { TabScreens } from '~/typings/screens';
import IconPicfill from '~/assets/iconfont/IconPicfill';
import IconPeople from '~/assets/iconfont/IconPeople';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { View, Dimensions, StyleSheet } from 'react-native';
import { TouchableNative } from '~/components';
import DrawList from '~/screens/draw/list';
import { TabView } from 'react-native-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabBarItem from '~/components/tabView/tabBarItem';
import TabBar from '~/components/tabView/tabBar';
import { DrawListProps } from '~/typings/navigation';

const Tab = createBottomTabNavigator();
const initialLayout = { width: Dimensions.get('window').width };
const TestScreen = () => {
  return <View />;
};

function DrawListTabView(props: DrawListProps) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Draw' },
    { key: 'second', title: 'Photo' },
  ]);

  const renderScene = ({
    route,
  }: {
    route: {
      key: string;
      title: string;
    };
  }) => {
    switch (route.key) {
      case 'first':
        return <DrawList pageType={'draw'} {...props} />;
      case 'second':
        return <DrawList pageType={'photo'} {...props} />;
      default:
        return null;
    }
  };

  const insets = useSafeAreaInsets();
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      lazy={true}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={(tabBarProps) => {
        return (
          <View
            style={[
              {
                alignItems: 'center',
                backgroundColor: colors.white,
                paddingTop: insets.top,
                paddingBottom: 10,
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
              {...tabBarProps}
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
                  <TabBarItem
                    {...itemProps}
                    containerStyle={{ flex: 1 }}
                    labelStyle={{
                      width: 50,
                      textAlign: 'center',
                    }}
                  />
                );
              }}
            />
          </View>
        );
      }}
    />
  );
}

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
