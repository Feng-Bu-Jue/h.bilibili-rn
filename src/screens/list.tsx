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
import { View, StyleSheet } from 'react-native';
import { layout } from '~/utils/layout';
import { Response } from 'ts-retrofit';
import { colors } from '~/utils/colors';

@observer
export default class DrawList extends BaseComponent<{
  pageType: 'draw' | 'cos';
}> {
  pageNum = 1;
  columnCount = 2;
  columnGap = 10;
  waterfallRef: Waterfall | null = null;

  @observable
  drawItems: ItemInfo<LinkDrawResult>[] = [];

  constructor(props: any) {
    super(props);
  }

  async fetchDrawItems() {
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
                size: ratio * this.waterfallRef!.getColumnWidth() + 100,
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
          ref={(r) => {
            if (!this.waterfallRef) {
              this.waterfallRef = r;
              this.fetchDrawItems();
            }
          }}
          columnCount={2}
          columnGap={this.columnGap}
          itemInfoData={this.drawItems}
          bufferAmount={10}
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
              <FastImage
                style={{
                  height: size - 100,
                  width: columnWidth,
                  overflow: 'hidden',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                source={{
                  uri: item.item.pictures[0].img_src + '@512w_384h_1e.webp',
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.stretch}
              />
            );
          }}
          onReachEnd={() => {
            this.fetchDrawItems();
          }}
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
