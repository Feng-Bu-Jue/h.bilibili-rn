import React, { useEffect, useState } from 'react';
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
import Waterfall from '~/components/waterfall';
import { colors } from '~/utils/colors';
import { LinkDrawApi } from '~/bilibiliApi/apis/linkDrawApi';
import { LinkDrawResult } from '~/bilibiliApi/typings';
import FastImage from 'react-native-fast-image';

const Tab = createBottomTabNavigator();

export type Tab = {
  label: string;
  icon: string;
};

const TestScreen = () => {
  return <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />;
};

const FirstRoute = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    LinkDrawApi.getDocs({
      page_num: 6,
      page_size: 20,
      type: 'hot',
      category: 'illustration',
    })
      .then((respnose) => {
        console.log(respnose.data.data.items[0].item);
        setItems([
          ...items,
          ...respnose.data.data.items.map((item) => {
            const ratio =
              item.item.pictures[0].img_height /
              item.item.pictures[0].img_width;
            return {
              size: ratio * 180,
              item: item,
            };
          }),
          ...respnose.data.data.items.map((item) => {
            const ratio =
              item.item.pictures[0].img_height /
              item.item.pictures[0].img_width;
            return {
              size: ratio * 180,
              item: item,
            };
          }),
        ]);
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }, []);

  return (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]}>
      <Waterfall
        columnWidth={180}
        columnGap={10}
        itemInfoData={items}
        bufferAmount={10}
        renderItem={({
          item,
          size,
        }: {
          item: LinkDrawResult;
          size: number;
        }) => {
          return (
            <View style={{ backgroundColor: '#000' }}>
              <FastImage
                style={{ height: size, width: 180 }}
                source={{
                  uri: item.item.pictures[0].img_src + '@512w_384h_1e.webp',
                  priority: FastImage.priority.high,
                }}
                onLoadStart={() => {
                  console.log(
                    item.item.pictures[0].img_src + '@512w_384h_1e.webp',
                  );
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          );
        }}
        onReachEnd={() => {
          LinkDrawApi.getDocs({
            page_num: 7,
            page_size: 20,
            type: 'hot',
            category: 'illustration',
          }).then((respnose) => {
              console.log(respnose.data.data.items[0].item);
              setItems([
                ...items,
                ...respnose.data.data.items.map((item) => {
                  const ratio =
                    item.item.pictures[0].img_height /
                    item.item.pictures[0].img_width;
                  return {
                    size: ratio * 180,
                    item: item,
                  };
                }),
              ]);
            })
            .catch((error) => {
              console.log(JSON.stringify(error));
            });
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
