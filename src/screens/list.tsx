import React from 'react';
import { observer } from 'mobx-react';
import FastImage from 'react-native-fast-image';
import {
  LinkDrawResult,
  BiliBiliProtocol,
  LinkDrawResultList,
} from '~/bilibiliApi/typings';
import { Waterfall, BaseComponent } from '~/components';
import { ItemInfo } from '~/components/waterfall';
import { LinkDrawApi } from '~/bilibiliApi/apis/linkDrawApi';
import { observable, runInAction } from 'mobx';
import { View, StyleSheet, Text } from 'react-native';
import { Response } from 'ts-retrofit';
import { layout } from '~/constants/layout';
import { colors } from '~/constants/colors';

@observer
export default class DrawList extends BaseComponent<{
  pageType: 'draw' | 'cos';
}> {
  pageNum = 1;
  columnCount = 2;
  columnGap = 10;

  @observable
  drawItems: ItemInfo<LinkDrawResult>[] = [];

  constructor(props: any) {
    super(props);
  }

  async fetchDrawItems(columnWidth: number) {
    try {
      let response: Response<BiliBiliProtocol<LinkDrawResultList>>;
      if (this.props.pageType === 'draw') {
        response = await LinkDrawApi.getDocs({
          page_num: this.pageNum,
          page_size: 20,
          type: 'hot',
          category: 'illustration',
        });
      } else {
        response = await LinkDrawApi.getPhotos({
          page_num: this.pageNum,
          page_size: 20,
          type: 'hot',
          category: 'all',
        });
      }
      if (response?.data?.data.total_count > 0) {
        this.pageNum++;
        runInAction(() => {
          this.drawItems = this.drawItems.concat(
            response.data.data.items.map((item) => {
              const ratio =
                item.item.pictures[0].img_height /
                item.item.pictures[0].img_width;
              return {
                size: ratio * columnWidth + 100,
                item: item,
              };
            }),
          );
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  render(): React.ReactNode {
    const { CardItem } = Styles;
    console.log(CardItem);
    return (
      <View style={[layout.flex(1)]}>
        <Waterfall
          initData={(w) => this.fetchDrawItems(w)}
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
                  { backgroundColor: colors.white, borderRadius: 10 },
                ]}>
                <FastImage
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    height: size - 100,
                    width: columnWidth,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                  source={{
                    uri: item.item.pictures[0].img_src + '@512w_384h_1e.webp',
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <View style={{ height: 90, ...layout.padding(8) }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 14, color: colors.black }}>
                    {item.item.title}{' '}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 5,
                    }}>
                    <FastImage
                      // eslint-disable-next-line react-native/no-inline-styles
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
                    <Text style={{ fontSize: 14, color: colors.charcoal }}>
                      {item.user.name}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
          onReachEnd={(w) => this.fetchDrawItems(w)}
        />
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  CardItem: {
    backgroundColor: colors.pink,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
});
