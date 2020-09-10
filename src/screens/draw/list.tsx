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
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import { Response } from 'ts-retrofit';
import IconArrowUp from '~/assets/iconfont/IconArrowUp';
import { layout, colors } from '~/constants';
import { DrawListProps } from '~/typings/navigation';
import { StackScreens } from '~/typings/screens';
import { LinkDrawApi } from '~/bilibiliApi';
import { Option } from '~/components/dropdownMenu';
import { appStore } from '~/stores/appStore';
import { downloadFile } from '~/utils/download';

type Props = {
  pageType: 'draw' | 'photo';
} & DrawListProps;

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const requestCameraPermissionWrite = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can write to storage');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

@observer
export default class DrawList extends BaseComponent<Props> {
  pageNum = 0;
  pageSize = 20;
  columnCount = 2;
  columnGap = 8;
  cardContentHeight = 70;

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

  getVoteStatus(doc_id: number) {
    return this.drawItems.some(
      (x) => x.item.item.doc_id === doc_id && x.item.item.already_voted === 0,
    );
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
                size: ratio * columnWidth + this.cardContentHeight,
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

  onSavePress = async (url: string) => {
    await requestCameraPermission();
    await requestCameraPermissionWrite();
    downloadFile(url);
  };

  onItemActionPress = async (doc_id: number, voteStatus: boolean) => {
    const item = this.drawItems.find((x) => x.item.item.doc_id === doc_id)!.item
      .item;
    if (voteStatus) {
      await LinkDrawApi.favorite({ fav_id: doc_id, biz_type: 2 });
      await LinkDrawApi.vote({ doc_id, type: 1 });
    } else {
      await LinkDrawApi.unfavorite({ fav_id: doc_id, biz_type: 2 });
      await LinkDrawApi.vote({ doc_id, type: 2 });
    }
    runInAction(() => {
      item.already_voted = voteStatus ? 1 : 0;
    });
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
            const voteStatus = this.getVoteStatus(item.item.doc_id);

            return (
              <View style={[styles.cardItem]}>
                <TouchableNative
                  onPress={() => {
                    this.props.navigation.push(StackScreens.DrawDetail, {
                      docId: item.item.doc_id,
                    });
                  }}>
                  <View
                    style={{
                      height: size - this.cardContentHeight,
                      width: columnWidth,
                    }}>
                    <Image
                      style={{
                        height: size - this.cardContentHeight,
                        width: columnWidth,
                      }}
                      source={{
                        uri:
                          item.item.pictures[0].img_src + '@512w_384h_1e.webp',
                      }}
                      resizeMode={'contain'}
                    />
                  </View>
                  <View
                    style={{
                      height: this.cardContentHeight - 10,
                      ...layout.padding(8),
                    }}>
                    <Text numberOfLines={1} style={styles.itemTitle}>
                      {item.item.title}
                    </Text>
                    <View
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{ flexDirection: 'row' }}>
                      <TouchableNative
                        style={styles.itemAction}
                        onPress={() =>
                          this.onSavePress(item.item.pictures[0].img_src)
                        }>
                        <Text style={{ color: colors.pink }}>{'Save'}</Text>
                      </TouchableNative>
                      <TouchableNative
                        style={styles.itemAction}
                        onPress={() =>
                          this.onItemActionPress(item.item.doc_id, voteStatus)
                        }>
                        <Text style={{ color: colors.pink }}>
                          {voteStatus ? 'Like' : 'Unlike'}
                        </Text>
                      </TouchableNative>
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
          refreshControlProps={{ colors: [colors.pink] }}
          onInfinite={(columnWidth) => this.fetchDrawItems(columnWidth)}
        />
        <Portal>
          <View style={styles.arrowUpWrapBox}>
            <TouchableNative
              onPress={() => {
                this.waterfallRef?.scrollTo({
                  y: 0,
                  animated: true,
                });
              }}
              style={styles.arrowUpBox}>
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

const styles = StyleSheet.create({
  cardItem: {
    ...layout.margin(10, 0),
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  itemTitle: {
    fontSize: 14,
    color: colors.black,
  },
  itemAction: {
    flex: 1,
    alignItems: 'center',
    ...layout.padding(3, 0),
  },
  arrowUpWrapBox: {
    position: 'absolute',
    elevation: 4,
    right: 20,
    bottom: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  arrowUpBox: {
    height: 40,
    width: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
