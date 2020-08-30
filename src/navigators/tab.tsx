import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '~/constants';
import { TabScreens } from '~/typings/screens';
import IconPicfill from '~/assets/iconfont/IconPicfill';
import IconPeople from '~/assets/iconfont/IconPeople';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { TouchableNative, BottomTabBar } from '~/components';
import { DrawListTabView } from '~/screens/draw/list';
import Me from '~/screens/account/me';
import { StyleSheet } from 'react-native';
import { computed } from 'mobx';
import { appStore } from '~/stores/appStore';
import { observer } from 'mobx-react-lite';

const Tab = createBottomTabNavigator();

export const TabMenu = observer(() => {
  const tabBarVisible = computed(() => appStore.tabBarVisible);
  return (
    <Tab.Navigator
      tabBar={(props) => {
        return <BottomTabBar {...props} />;
      }}
      tabBarOptions={{
        activeTintColor: colors.pink,
        inactiveTintColor: colors.black,
        ...StyleSheet.create({
          style: tabBarVisible.get() ? {} : { overflow: 'hidden' }, //TODO: 超级大疑问: 不加这行无意义的代码 mobx就不会跟踪 tabBarVisible ,需要看看 screenOptions 是怎么调用的
          iconStyle: { flex: 0, marginBottom: 10 },
          labelStyle: {
            marginBottom: 6,
          },
        }),
      }}
      screenOptions={({ route }) => ({
        tabBarVisible: tabBarVisible.get(),
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
      <Tab.Screen name={TabScreens.Me} component={Me} />
    </Tab.Navigator>
  );
});
