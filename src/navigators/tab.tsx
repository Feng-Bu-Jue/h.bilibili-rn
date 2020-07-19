import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  TouchableNativeFeedback,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import IconPicfill from '~/assets/iconfont/IconPicfill';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { TabView, SceneMap } from 'react-native-tab-view';
import Waterfall from '~/components/waterfall';
import { colors } from '~/utils/colors';

const Tab = createBottomTabNavigator();

export type Tab = {
  label: string;
  icon: string;
};

const TestScreen = () => {
  return <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />;
};

const FirstRoute = () => {
  return (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]}>
      <Waterfall
        columnWidth={150}
        columnGap={10}
        itemInfoData={Array(1000)
          .fill({ size: 100, item: { text: 'test' } })
          .map((x) =>
            Math.random() > 0.5
              ? { size: 61, item: x.item }
              : { size: 100, item: x.item },
          )}
        renderItem={({ item, size }, index) => {
          return (
            <View style={{ width: 150, height: size }}>
              <Text style={{ backgroundColor: colors.puerto, flex: 1 }}>
                {index}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const SecondRoute = () => {
  return <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />;
};

const initialLayout = { width: Dimensions.get('window').width };

export function TabViewExample() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
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
      <Tab.Screen name="home1" component={TabViewExample} />
      <Tab.Screen name="home" component={TestScreen} />
    </Tab.Navigator>
  );
};

export default TabMenu;
