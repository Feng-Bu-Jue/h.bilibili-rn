/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { observer } from 'mobx-react';
import FastImage from 'react-native-fast-image';
import {
  LinkDrawResult,
  BiliBiliProtocol,
  LinkDrawResultList,
} from '~/bilibiliApi/typings';
import { BaseComponent } from '~/components';
import Waterfall, { ItemInfo } from '~/components/waterfall';
import { LinkDrawApi } from '~/bilibiliApi/apis/linkDrawApi';
import { observable, runInAction } from 'mobx';
import {
  View,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';
import { Response } from 'ts-retrofit';
import IconArrowUp from '~/assets/iconfont/IconArrowUp';
import { layout, colors } from '~/constants';
import { DrawListProps } from '~/typings/navigation';
import { StackScreens } from '~/typings/screens';

type Props = {
  pageType: 'draw' | 'photo';
} & DrawListProps;

@observer
export default class DrawList extends BaseComponent<Props> {
  pageNum = 1;
  pageSize = 20;
  columnCount = 2;
  columnGap = 10;

  waterfallRef: Waterfall | null = null;

  @observable
  drawItems: ItemInfo<LinkDrawResult>[] = [];

  constructor(props: Props) {
    super(props);
  }

  async fetchDrawItems(columnWidth: number, reload: boolean = false) {
    try {
      let response: Response<BiliBiliProtocol<LinkDrawResultList>>;
      if (this.props.pageType === 'draw') {
        response = await LinkDrawApi.getDocs({
          page_num: this.pageNum,
          page_size: this.pageSize,
          type: 'hot',
          category: 'illustration',
        });
      } else {
        response = await LinkDrawApi.getPhotos({
          page_num: this.pageNum,
          page_size: this.pageSize,
          type: 'hot',
          category: 'all',
        });
      }
      if (this.pageSize * this.pageNum < response?.data?.data.total_count) {
        this.pageNum++;
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
          if (reload) {
            this.drawItems = mappingResult;
          } else {
            this.drawItems = this.drawItems.concat(mappingResult);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  render(): React.ReactNode {
    return (
      <View
        style={{
          flex: 1,
          position: 'relative',
        }}>
        <Waterfall
          ref={(r) => (this.waterfallRef = r)}
          onInitData={(columnWidth) => this.fetchDrawItems(columnWidth)}
          columnCount={2}
          columnGap={this.columnGap}
          itemInfoData={this.drawItems}
          bufferAmount={10}
          containerStyle={layout.padding(0, 10)}
          bounces={true}
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
                    borderRadius: 10,
                  },
                ]}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.props.navigation.push(StackScreens.DrawDetail, {
                      docId: item.item.doc_id,
                    });
                  }}>
                  <View>
                    <FastImage
                      style={{
                        height: size - 100,
                        width: columnWidth,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                      source={{
                        uri:
                          item.item.pictures[0].img_src + '@512w_384h_1e.webp',
                        priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
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
                        <FastImage
                          style={{
                            height: 24,
                            width: 24,
                            marginRight: 10,
                            borderRadius: 24,
                          }}
                          source={{
                            uri: `${item.user.head_url}@${24}w_${24}h_1e.webp`,
                            priority: FastImage.priority.high,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text
                          numberOfLines={1}
                          style={{ fontSize: 14, color: colors.charcoal }}>
                          {item.user.name}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
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
          <TouchableNativeFeedback
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
            <IconArrowUp size={30} />
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }
}
