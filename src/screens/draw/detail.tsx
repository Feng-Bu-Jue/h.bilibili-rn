import React from 'react';
import { observer } from 'mobx-react';
import { View, ScrollView, Animated, Text } from 'react-native';
import { DrawDetailProps } from '~/typings/navigation';
import { LinkDrawApi } from '~/bilibiliApi/apis/linkDrawApi';
import { observable, runInAction } from 'mobx';
import { LinkDrawResult } from '~/bilibiliApi/typings';
import { BaseComponentWithAnimatedHeader } from '~/components/baseComponent';
import { AutoHeightImageHOC } from '~/components';
import FastImage from 'react-native-fast-image';
//@ts-ignore
import { createImageProgress } from 'react-native-image-progress';

const AutoHeightImage = AutoHeightImageHOC(createImageProgress(FastImage));

@observer
export default class DrawDetail extends BaseComponentWithAnimatedHeader<
  DrawDetailProps
> {
  @observable
  detail: LinkDrawResult | undefined;

  constructor(props: DrawDetailProps) {
    super(props);
    this.loadDetail(props.route.params.docId);
  }

  componentDidMount() {
    this.$useAnimatedHeadaer('Detail');
  }

  async loadDetail(docId: number) {
    try {
      const response = await LinkDrawApi.getDocDetail({ doc_id: docId });
      runInAction(() => {
        this.detail = response.data.data;
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.detail) {
      return (
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ flex: 1 }}>
          {this.$renderStatusBar()}
          <ScrollView
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: this.$scolloffsetY,
                    },
                  },
                },
              ],
              { useNativeDriver: false },
            )}>
            <AutoHeightImage
              height={this.detail.item.pictures[0].img_height}
              width={this.detail.item.pictures[0].img_width}
              source={{
                uri: this.detail.item.pictures[0].img_src,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={{ height: 600 }}>
              <ScrollView>
                <View style={{ height: 2000 }}>
                  <Text>{'M'}</Text>
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      );
    }
    return <></>;
  }
}
