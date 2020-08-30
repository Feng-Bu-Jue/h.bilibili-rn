/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { observer } from 'mobx-react';
import {
  LinkDrawResult,
  BiliBiliProtocol,
  LinkDrawResultList,
} from '~/bilibiliApi/typings';
import {
  BaseComponent,
  TouchableNative,
  DropdownMenu,
  Portal,
} from '~/components';
import Waterfall, { ItemInfo } from '~/components/waterfall';
import { observable, runInAction, computed, reaction } from 'mobx';
import {
  View,
  Text,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  LayoutRectangle,
} from 'react-native';
import { Response } from 'ts-retrofit';
import IconArrowUp from '~/assets/iconfont/IconArrowUp';
import { layout, colors } from '~/constants';
import { DrawListProps } from '~/typings/navigation';
import { StackScreens } from '~/typings/screens';
import { LinkDrawApi } from '~/bilibiliApi';
import { TabView } from 'react-native-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabBar from '~/components/tabView/tabBar';
import TabBarItem from '~/components/tabView/tabBarItem';
import { Option } from '~/components/dropdownMenu';
import { appStore } from '~/stores/appStore';

export function DrawListTabView(props: DrawListProps) {
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
      renderTabBar={(tabBarProps) => {
        return (
          <View
            style={[
              {
                alignItems: 'center',
                backgroundColor: colors.white,
                paddingTop: insets.top,
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

type Props = {
  pageType: 'draw' | 'photo';
} & DrawListProps;

@observer
export default class DrawList extends BaseComponent<Props> {
  pageNum = 0;
  pageSize = 20;
  columnCount = 2;
  columnGap = 8;

  lastRecordedOffetY = 0;
  menuTranslateY = new Animated.Value(0);

  waterfallRef: Waterfall | null = null;
  menuLayout?: LayoutRectangle;

  @observable
  stickyHeaderIndices = [0];

  @observable
  drawItems: ItemInfo<LinkDrawResult>[] = [];
  @observable
  menuActiveIndex = -1;
  @observable
  categoryVlaue: string = 'all';
  @observable
  listTypeValue: string = 'hot';

  constructor(props: Props) {
    super(props);

    this.$reactionDisposers.push(
      reaction(
        () => appStore.tabBarVisible,
        (visible) => {
          if (visible) {
            Animated.timing(this.menuTranslateY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.timing(this.menuTranslateY, {
              toValue: -this.menuLayout!.height,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }
        },
      ),
    );
  }

  get listTypeOptions(): Option<string>[] {
    return [
      { text: '最热', value: 'hot' },
      { text: '最新', value: 'new' },
    ];
  }

  @computed
  get categoryOptions(): Option<string>[] {
    if (this.props.pageType === 'draw') {
      return [
        { text: '全部类型', value: 'all' },
        { text: '插画', value: 'illustration' },
        { text: '漫画', value: 'comic' },
        { text: '其他', value: 'draw' },
      ];
    } else {
      return [
        { text: '全部类型', value: 'all' },
        { text: '私服', value: 'sifu' },
        { text: 'cos', value: 'cos' },
      ];
    }
  }

  async fetchDrawItems(columnWidth: number, reload: boolean = false) {
    if (reload) {
      runInAction(() => {
        this.pageNum = 0;
      });
    }
    try {
      let response: Response<BiliBiliProtocol<LinkDrawResultList>>;
      if (this.props.pageType === 'draw') {
        response = await LinkDrawApi.getDocs({
          page_num: this.pageNum,
          page_size: this.pageSize,
          type: this.listTypeValue as any,
          category: this.categoryVlaue as any,
        });
      } else {
        response = await LinkDrawApi.getPhotos({
          page_num: this.pageNum,
          page_size: this.pageSize,
          type: this.listTypeValue as any,
          category: this.categoryVlaue as any,
        });
      }
      // reset after api called, make sure the blank screen time of existence as an instant
      if (reload) {
        runInAction(() => {
          this.drawItems = [];
          this.waterfallRef!.reset();
        });
      }
      this.pageNum++;
      if (this.pageSize * this.pageNum < response?.data?.data.total_count) {
        runInAction(() => {
          const mappingResult = response.data.data.items
            // b站api 是放弃画册了吗 有的item height都不返回(阿B api bug不修复一直可以的)
            .filter((item) => !!item.item?.pictures[0]?.img_height)
            .map((item) => {
              const ratio =
                item.item.pictures[0].img_height /
                item.item.pictures[0].img_width;
              return {
                size: ratio * columnWidth + 100,
                item: item,
              };
            });
          this.drawItems = this.drawItems.concat(mappingResult);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  reloadDrawItems() {
    if (this.waterfallRef) {
      this.fetchDrawItems(this.waterfallRef.getColumnWidth(), true);
    }
  }

  /*-------------------------EventHandler------------------------- */

  onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {
      contentOffset: { y },
    } = event.nativeEvent;
    const movedDistance = y - this.lastRecordedOffetY;
    if (movedDistance < -40) {
      appStore.showTabBar();
    }
    if (movedDistance > 40) {
      appStore.hideTabBar();
    }
  };

  render(): React.ReactNode {
    const headerComponent = (
      <View
        onLayout={(e) => {
          this.menuLayout = e.nativeEvent.layout;
        }}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: this.menuTranslateY,
              },
            ],
          }}>
          <DropdownMenu.Box
            activeIndex={this.menuActiveIndex}
            onActiveIndexChange={(index) => {
              this.menuActiveIndex = index;
            }}>
            <DropdownMenu.Option
              value={this.categoryVlaue}
              options={this.categoryOptions}
              onValueChange={(value) => {
                runInAction(() => {
                  this.categoryVlaue = value;
                  this.reloadDrawItems();
                });
              }}
            />
            <DropdownMenu.Option
              value={this.listTypeValue}
              options={this.listTypeOptions}
              onValueChange={(value) => {
                runInAction(() => {
                  this.listTypeValue = value;
                  this.reloadDrawItems();
                });
              }}
            />
          </DropdownMenu.Box>
        </Animated.View>
      </View>
    );

    return (
      <Portal.Host>
        <Waterfall
          ref={(r) => (this.waterfallRef = r)}
          onInitData={(columnWidth) => this.fetchDrawItems(columnWidth)}
          columnNum={2}
          columnGap={this.columnGap}
          itemInfoData={this.drawItems}
          bufferAmount={10}
          infiniteThreshold={800}
          containerStyle={layout.padding(0, 10)}
          bounces={true}
          stickyHeaderIndices={this.stickyHeaderIndices.slice()}
          HeaderComponent={headerComponent}
          renderItem={(
            {
              item,
              size,
            }: {
              item: LinkDrawResult;
              size: number;
            },
            columnWidth: number,
          ) => {
            return (
              <View
                style={[
                  layout.margin(10, 0),
                  {
                    backgroundColor: colors.white,
                    borderRadius: 5,
                    overflow: 'hidden',
                  },
                ]}>
                <TouchableNative
                  onPress={() => {
                    this.props.navigation.push(StackScreens.DrawDetail, {
                      docId: item.item.doc_id,
                    });
                  }}>
                  <View style={{ height: size - 100, width: columnWidth }}>
                    <Image
                      style={{
                        height: size - 100,
                        width: columnWidth,
                      }}
                      source={{
                        uri:
                          item.item.pictures[0].img_src + '@512w_384h_1e.webp',
                      }}
                      resizeMode={'contain'}
                    />
                  </View>
                  <View style={{ height: 90, ...layout.padding(8) }}>
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 14, color: colors.black }}>
                      {item.item.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 5,
                      }}>
                      <Image
                        style={{
                          height: 24,
                          width: 24,
                          marginRight: 10,
                        }}
                        borderRadius={12}
                        source={{
                          uri: `${item.user.head_url}@${64}w_${64}h_1e.webp`,
                        }}
                        resizeMode={'contain'}
                      />
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 14, color: colors.charcoal }}>
                        {item.user.name}
                      </Text>
                    </View>
                  </View>
                </TouchableNative>
              </View>
            );
          }}
          onRefresh={(columnWidth) => {
            this.pageNum = 1;
            return this.fetchDrawItems(columnWidth, true);
          }}
          onScroll={this.onScroll}
          onScrollEndDrag={(e) => {
            this.lastRecordedOffetY = e.nativeEvent.contentOffset.y;
          }}
          onTouchMove={(e) => {
            console.log(e.nativeEvent.pageY);
          }}
          refreshControlProps={{ colors: [colors.pink] }}
          onInfinite={(columnWidth) => this.fetchDrawItems(columnWidth)}
        />
        <Portal>
          <View
            style={{
              position: 'absolute',
              elevation: 4,
              right: 20,
              bottom: 40,
              borderRadius: 20,
              overflow: 'hidden',
            }}>
            <TouchableNative
              onPress={() => {
                this.waterfallRef?.scrollTo({
                  y: 0,
                  animated: true,
                });
              }}
              style={{
                height: 40,
                width: 40,
                backgroundColor: colors.white,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View>
                <IconArrowUp size={30} />
              </View>
            </TouchableNative>
          </View>
        </Portal>
      </Portal.Host>
    );
  }
}
