import React from 'react';
import { observer } from 'mobx-react';
import { View, Animated, Text } from 'react-native';
import { DrawDetailProps } from '~/typings/navigation';
import { LinkDrawApi } from '~/bilibiliApi/apis/linkDrawApi';
import { observable, runInAction, computed } from 'mobx';
import { LinkDrawResult, Reply, ReplyResult } from '~/bilibiliApi/typings';
import { BaseComponentWithAnimatedHeader } from '~/components/baseComponent';
import {
  AutoHeightImageHOC,
  Panel,
  TouchableNative,
  LoadingView,
} from '~/components';
import FastImage from 'react-native-fast-image';
import { colors, layout, sizes } from '~/constants';
import {
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { ReplyApi } from '~/bilibiliApi/apis/replyApi';

const AutoHeightImage = AutoHeightImageHOC(FastImage);

const sortType = {
  Latest: 0,
  Hotest: 2,
};

@observer
export default class DrawDetail extends BaseComponentWithAnimatedHeader<
  DrawDetailProps
> {
  replyPageNum = 1;

  @observable
  detail: LinkDrawResult | undefined;
  @observable
  replyResult: ReplyResult | undefined;
  @observable
  replies: Array<Reply> = [];
  @observable
  selectedSortCode = 2;

  constructor(props: DrawDetailProps) {
    super(props);
    this.loadDetail();
    this.loadReply();
  }

  @computed
  get extraData() {
    return {
      replyKey: this.replies.map((x) => x.rpid).join(''),
    };
  }

  componentDidMount() {
    this.$useAnimatedHeadaer('Detail');
  }

  async loadDetail() {
    const { docId } = this.props.route.params;

    try {
      const response = await LinkDrawApi.getDocDetail({ doc_id: docId });
      runInAction(() => {
        this.detail = response.data.data;
      });
    } catch (e) {
      console.log(e);
    }
  }

  async loadReply(reload: boolean = false) {
    const { docId } = this.props.route.params;
    if (reload) {
      runInAction(() => {
        this.replies = [];
        this.replyPageNum = 0;
      });
    }
    try {
      const response = await ReplyApi.getReplies({
        oid: docId,
        pn: this.replyPageNum,
        sort: this.selectedSortCode,
      });
      runInAction(() => {
        this.replyResult = response.data.data;
        this.replies = this.replies.concat(response.data.data.replies);
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.detail) {
      const listHeaderComponent = (
        <>
          <AutoHeightImage
            width={sizes.screenWidth}
            imageSize={{
              height: this.detail.item.pictures[0].img_height,
              width: this.detail.item.pictures[0].img_width,
            }}
            source={{
              uri: this.detail.item.pictures[0].img_src,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Panel style={layout.padding(20, 15)}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <FastImage
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  backgroundColor: colors.gray,
                }}
                source={{
                  uri: this.detail.user.head_url,
                }}
              />
              <View
                style={{
                  marginLeft: 15,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: colors.pink,
                  }}>
                  {this.detail.user.name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.gray,
                  }}>
                  {this.detail.item.upload_time}
                </Text>
              </View>
            </View>
            <Text selectable style={{ marginTop: 15 }}>
              {this.detail.item.title}
            </Text>
            {!!this.detail.item.description && (
              <Text selectable>{this.detail.item.description}</Text>
            )}
          </Panel>
          <Panel style={[layout.margin(10, 0, 0, 0)]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                ...layout.padding(15),
                ...layout.border([0, 0, 0.5, 0], colors.lightgray),
              }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                {'Comment' +
                  (this.replyResult?.page?.count
                    ? `(${this.replyResult?.page.count})`
                    : '')}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                {Object.entries(sortType).map(([name, code], i) => {
                  return (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        runInAction(() => {
                          this.selectedSortCode = code;
                          this.loadReply(true);
                        });
                      }}>
                      <Text
                        key={i}
                        style={[
                          { fontSize: 14 },
                          i ? { marginLeft: 15 } : {},
                          this.selectedSortCode === code
                            ? { fontWeight: 'bold' }
                            : {},
                        ]}>
                        {name}
                      </Text>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            </View>
          </Panel>
        </>
      );

      const listFooterComponent = (
        <>
          <Panel>
            {!this.replies?.length && (
              <LoadingView loading={true} style={{ height: 200 }} />
            )}
          </Panel>
        </>
      );

      return (
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ flex: 1 }}>
          {this.$renderStatusBar()}
          <FlatList
            onScroll={(e) => {
              Animated.event(
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
              )(e);
            }}
            ListHeaderComponent={listHeaderComponent}
            ListFooterComponent={listFooterComponent}
            data={this.replies}
            keyExtractor={(item, i) => {
              return item.rpid.toString() + '-' + i;
            }}
            extraData={this.extraData}
            renderItem={({ item }) => {
              return (
                <TouchableNative
                  style={{ backgroundColor: '#000' }}
                  onPress={() => {}}>
                  <Panel
                    style={{
                      flexDirection: 'row',
                      ...layout.padding(15),
                      ...layout.border([0, 0, 0.5, 0], colors.lightgray),
                    }}>
                    <FastImage
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        backgroundColor: colors.gray,
                      }}
                      source={{
                        uri: item.member.avatar,
                      }}
                    />
                    <View
                      style={{
                        marginLeft: 15,
                        justifyContent: 'flex-start',
                        flex: 1,
                      }}>
                      <Text
                        selectable
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          marginBottom: 5,
                        }}>
                        {item.member.uname}
                      </Text>
                      <Text
                        selectable
                        style={{
                          fontSize: 14,
                        }}>
                        {item.content.message}
                      </Text>
                      <Text
                        style={{
                          marginTop: 10,
                          fontSize: 12,
                          color: colors.gray,
                        }}>
                        {new Date(item.ctime * 1000).toLocaleString()}
                      </Text>
                    </View>
                  </Panel>
                </TouchableNative>
              );
            }}
          />
        </View>
      );
    }
    return <></>;
  }
}
