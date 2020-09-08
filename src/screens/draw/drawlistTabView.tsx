import { TabView } from 'react-native-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabBar from '~/components/tabView/tabBar';
import TabBarItem from '~/components/tabView/tabBarItem';
import { DrawListProps } from '~/typings/navigation';
import React from 'react';
import DrawList from './list';
import { View, StyleSheet } from 'react-native';
import { colors } from '~/constants';

export function DrawListTabView(props: DrawListProps) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'Draw', title: '绘画' },
    { key: 'Photo', title: '相簿' },
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
      case 'Draw':
        return <DrawList pageType={'draw'} {...props} />;
      case 'Photo':
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
      renderTabBar={(tabBarProps) => {
        return (
          <View style={[styles.tabBarWrap, { paddingTop: insets.top }]}>
            <TabBar
              {...tabBarProps}
              activeColor={colors.pink}
              inactiveColor={'rgb(70,70,70)'}
              // eslint-disable-next-line react-native/no-inline-styles
              tabStyle={{ width: 'auto' }}
              style={styles.tabBar}
              // eslint-disable-next-line react-native/no-inline-styles
              contentContainerStyle={{ flex: 0 }}
              // eslint-disable-next-line react-native/no-inline-styles
              indicatorStyle={{ backgroundColor: colors.pink, height: 3 }}
              renderTabBarItem={(itemProps) => {
                return (
                  <TabBarItem
                    {...itemProps}
                    // eslint-disable-next-line react-native/no-inline-styles
                    containerStyle={{ flex: 1 }}
                    labelStyle={styles.itemLabel}
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

const styles = StyleSheet.create({
  tabBarWrap: {
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingBottom: 10,
    /*
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
      width: 0,
    },
    */
  },
  tabBar: {
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
  },
  itemLabel: {
    width: 50,
    textAlign: 'center',
  },
});
