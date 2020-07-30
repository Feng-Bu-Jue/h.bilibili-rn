import React from 'react';
import { observer } from 'mobx-react';
import { View, Animated, Text } from 'react-native';
import { DrawDetailProps } from '~/typings/navigation';
import { LinkDrawApi } from '~/bilibiliApi/apis/linkDrawApi';
import { observable, runInAction, computed } from 'mobx';
import { LinkDrawResult, Reply } from '~/bilibiliApi/typings';
import { BaseComponentWithAnimatedHeader } from '~/components/baseComponent';
import { AutoHeightImageHOC, Panel } from '~/components';
import FastImage from 'react-native-fast-image';
import { colors, layout } from '~/constants';
import { FlatList } from 'react-native-gesture-handler';
import { ReplyApi } from '~/bilibiliApi/apis/replyApi';

const AutoHeightImage = AutoHeightImageHOC(FastImage);

@observer
export default class DrawDetail extends BaseComponentWithAnimatedHeader<
  DrawDetailProps
> {
  private sortType = ['Hotlest', 'Latest'];
  replyPageNum = 1;

  @observable
  detail: LinkDrawResult | undefined;
  @observable
  replies: Array<Reply> = [];

  constructor(props: DrawDetailProps) {
    super(props);
    this.loadDetail(props.route.params.docId);
    this.loadReply(props.route.params.docId);
  }

  @computed
  get pageVisible() {
    return !!this.detail;
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

  async loadReply(docId: number) {
    try {
      const response = await ReplyApi.getReplies({
        oid: docId,
        pn: this.replyPageNum,
      });
      runInAction(() => {
        this.replies = this.replies.concat(response.data.data.replies);
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.detail) {
      const listHeaderComponen = (
        <>
          <AutoHeightImage
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
                style={{ height: 40, width: 40, borderRadius: 20 }}
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
            <Text style={{ marginTop: 15 }}>{this.detail.item.title}</Text>
            {!!this.detail.item.description && (
              <Text>{this.detail.item.description}</Text>
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
                {'Comment'}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                {this.sortType.map((t, i) => {
                  return (
                    <Text
                      key={i}
                      style={[{ fontSize: 14 }, i ? { marginLeft: 15 } : {}]}>
                      {t}
                    </Text>
                  );
                })}
              </View>
            </View>
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
            ListHeaderComponent={listHeaderComponen}
            data={this.replies}
            keyExtractor={(item) => {
              return item.mid.toString();
            }}
            renderItem={({ item }) => {
              return (
                <Panel
                  style={{
                    flexDirection: 'row',
                    ...layout.padding(15),
                    ...layout.border([0, 0, 0.5, 0], colors.lightgray),
                  }}>
                  <FastImage
                    style={{ height: 40, width: 40, borderRadius: 20 }}
                    source={{
                      uri: item.member.avatar,
                    }}
                  />
                  <View
                    style={{
                      marginLeft: 15,
                      justifyContent: 'flex-start',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        marginBottom: 5,
                      }}>
                      {item.member.uname}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                      }}>
                      {item.content.message}
                    </Text>
                  </View>
                </Panel>
              );
            }}
          />
        </View>
      );
    }
    return <></>;
  }
}
