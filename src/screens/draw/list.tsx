/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { observer } from 'mobx-react';
import {
  LinkDrawResult,
  BiliBiliProtocol,
  LinkDrawResultList,
  ListType,
  DrawCategory,
  PhotoCategory,
} from '~/bilibiliApi/typings';
import { BaseComponent, TouchableNative } from '~/components';
import Waterfall, { ItemInfo } from '~/components/waterfall';
import { observable, runInAction, computed } from 'mobx';
import { View, Text, Image } from 'react-native';
import { Response } from 'ts-retrofit';
import IconArrowUp from '~/assets/iconfont/IconArrowUp';
import { layout, colors } from '~/constants';
import { DrawListProps } from '~/typings/navigation';
import { StackScreens } from '~/typings/screens';
import { ScrollView } from 'react-native-gesture-handler';
import { LinkDrawApi } from '~/bilibiliApi';

type Props = {
  pageType: 'draw' | 'photo';
} & DrawListProps;

@observer
export default class DrawList extends BaseComponent<Props> {
  pageNum = 0;
  pageSize = 20;
  columnCount = 2;
  columnGap = 8;

  waterfallRef: Waterfall | null = null;

  @observable
  selectedListType: ListType = 'hot';
  @observable
  selectedCategory: DrawCategory | PhotoCategory;
  @observable
  drawItems: ItemInfo<LinkDrawResult>[] = [];

  constructor(props: Props) {
    super(props);
    if (props.pageType === 'draw') {
      this.selectedCategory = 'illustration';
    } else {
      this.selectedCategory = 'all';
    }
  }

  get listType(): Array<ListType> {
    return ['hot', 'new'];
  }

  @computed
  get categories(): Array<DrawCategory | PhotoCategory> {
    if (this.props.pageType === 'draw') {
      return ['all', 'illustration', 'comic', 'draw'];
    } else {
      return ['all', 'sifu', 'cos'];
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
          type: this.selectedListType,
          category: this.selectedCategory as any,
        });
      } else {
        response = await LinkDrawApi.getPhotos({
          page_num: this.pageNum,
          page_size: this.pageSize,
          type: this.selectedListType,
          category: this.selectedCategory as any,
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
          const mappingResult = response.data.data.items.map((item) => {
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

  renderCheckBox<T>(
    value: T,
    index: number,
    key: string,
    checked: boolean,
    onPress: (value: T) => void,
  ) {
    return (
      <View
        key={key}
        style={[
          index ? { marginLeft: 10 } : {},
          {
            borderRadius: 15,
            overflow: 'hidden',
            ...layout.border([1], colors.lightgray),
            ...(checked ? { backgroundColor: colors.pink } : {}),
          },
        ]}>
        <TouchableNative
          style={{
            minWidth: 60,
            alignItems: 'center',
            ...layout.padding(5, 10),
          }}
          onPress={() => onPress(value)}>
          <Text
            style={{
              ...(checked ? { color: colors.white } : { color: colors.black }),
            }}>
            {value}
          </Text>
        </TouchableNative>
      </View>
    );
  }

  render(): React.ReactNode {
    const headerComponent = (
      <View style={{ ...layout.padding(10, 0) }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: 'row', marginTop: 10 }}>
          {this.listType.map((type, i) => {
            const checked = this.selectedListType === type;
            return this.renderCheckBox(
              type,
              i,
              `type-${type}`,
              checked,
              (value) => {
                runInAction(() => {
                  this.selectedListType = value;
                  this.reloadDrawItems();
                });
              },
            );
          })}
        </ScrollView>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: 'row', marginTop: 10 }}>
          {this.categories.map((category, i) => {
            const checked = this.selectedCategory === category;
            return this.renderCheckBox(
              category,
              i,
              `category-${category}`,
              checked,
              (value) => {
                runInAction(() => {
                  this.selectedCategory = value;
                  this.reloadDrawItems();
                });
              },
            );
          })}
        </ScrollView>
      </View>
    );

    return (
      <View
        style={{
          flex: 1,
          position: 'relative',
        }}>
        <Waterfall
          ref={(r) => (this.waterfallRef = r)}
          onInitData={(columnWidth) => this.fetchDrawItems(columnWidth)}
          columnNum={2}
          columnGap={this.columnGap}
          itemInfoData={this.drawItems}
          bufferAmount={10}
          containerStyle={layout.padding(0, 10)}
          bounces={true}
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
                      borderTopLeftRadius={5}
                      borderTopRightRadius={5}
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
          refreshControlProps={{ colors: [colors.pink] }}
          onInfinite={(columnWidth) => this.fetchDrawItems(columnWidth)}
        />
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
      </View>
    );
  }
}
