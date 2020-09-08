import React from 'react';
import { observer } from 'mobx-react';
import {
  View,
  Animated,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { DrawDetailProps } from '~/typings/navigation';
import { observable, runInAction, computed } from 'mobx';
import { LinkDrawResult, Reply, ReplyResult } from '~/bilibiliApi/typings';
import { BaseComponentWithAnimatedHeader } from '~/components/baseComponent';
import { AutoHeightImageHOC, Panel, TouchableNative } from '~/components';
import { colors, layout, sizes } from '~/constants';
import ImageView from 'react-native-image-viewing';
import IconMultiple from '~/assets/iconfont/IconMultiple';
import { LinkDrawApi, ReplyApi } from '~/bilibiliApi';

const AutoHeightImage = AutoHeightImageHOC(Image);

const sortType = {
  Latest: 0,
  Hotest: 2,
};

@observer
export default class DrawDetail extends BaseComponentWithAnimatedHeader<
  DrawDetailProps
> {
  @observable
  replyPageNum = 1;
  @observable
  detail: LinkDrawResult | undefined;
  @observable
  replyResult: ReplyResult | undefined;
  @observable
  replies: Array<Reply> = [];
  @observable
  selectedSortCode = sortType.Hotest;
  @observable
  replyLoading = false;
  @observable
  imageViewerVisible = false;

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

  @computed
  get noMoreOfReply() {
    if (this.replyResult) {
      return (
        this.replyResult.page.count <
        this.replyResult.page.size * this.replyPageNum
      );
    }
    return false;
  }

  @computed
  get images() {
    return this.detail!.item.pictures.map((x) => {
      return {
        uri: x.img_src,
      };
    });
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
    if ((!this.noMoreOfReply || reload) && !this.replyLoading) {
      runInAction(() => {
        this.replyLoading = true;
      });
      await this._loadReplyWithoutLoading(reload);
      runInAction(() => {
        this.replyLoading = false;
      });
    }
  }

  private async _loadReplyWithoutLoading(reload: boolean = false) {
    const { docId } = this.props.route.params;
    if (reload) {
      runInAction(() => {
        this.replies = [];
        this.replyPageNum = 1;
      });
    }
    try {
      const response = await ReplyApi.getReplies({
        oid: docId,
        pn: this.replyPageNum,
        sort: this.selectedSortCode,
        type: 11,
      });
      runInAction(() => {
        this.replyPageNum++;
        this.replyResult = response.data.data;
        if (response.data.data?.replies?.length) {
          this.replies = this.replies.concat(response.data.data.replies);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.detail) {
      const listHeaderComponent = (
        <>
          <ImageView
            presentationStyle={'overFullScreen'}
            images={this.images}
            imageIndex={0}
            visible={this.imageViewerVisible}
            onRequestClose={() =>
              runInAction(() => {
                this.imageViewerVisible = false;
              })
            }
          />
          <TouchableWithoutFeedback
            onPress={() => runInAction(() => (this.imageViewerVisible = true))}>
            <View>
              <AutoHeightImage
                width={sizes.screenWidth}
                imageSize={{
                  height: this.detail.item.pictures[0].img_height,
                  width: this.detail.item.pictures[0].img_width,
                }}
                source={{
                  uri: this.detail.item.pictures[0].img_src,
                }}
                resizeMode={'contain'}
              />
              {this.detail.item.pictures.length > 1 && (
                <IconMultiple
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    right: 15,
                    top: 50,
                    position: 'absolute',
                  }}
                  size={30}
                  color={'rgba(160,160,160,0.6)'}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
          <Panel style={layout.padding(20, 15)}>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                flexDirection: 'row',
              }}>
              <Image
                style={styles.userAvatar}
                borderRadius={20}
                source={{
                  uri: this.detail.user.head_url,
                }}
              />
              <View style={styles.userInfoBox}>
                <Text style={styles.usernameText}>{this.detail.user.name}</Text>
                <Text style={styles.postUpTime}>
                  {this.detail.item.upload_time}
                </Text>
              </View>
            </View>
            <Text
              selectable
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ marginTop: 15 }}>
              {this.detail.item.title}
            </Text>
            {!!this.detail.item.description && (
              <Text selectable>{this.detail.item.description}</Text>
            )}
          </Panel>
          {!!this.detail.item?.tags?.length && (
            <Panel style={styles.tagsBox}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {this.detail.item?.tags.map((x, i) => {
                  return (
                    <Text
                      key={`${x.tag}-${i}`}
                      style={[
                        {
                          ...(i === 0 ? { marginLeft: 10 } : {}),
                        },
                        styles.tagText,
                      ]}>
                      {x.text}
                    </Text>
                  );
                })}
              </ScrollView>
            </Panel>
          )}
          <Panel style={[layout.margin(10, 0, 0, 0)]}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentTitleText}>
                {'Comment' +
                  (this.replyResult?.page?.count
                    ? `(${this.replyResult?.page.count})`
                    : '')}
              </Text>
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ flexDirection: 'row' }}>
                {Object.entries(sortType).map(([name, code], i) => {
                  return (
                    <TouchableWithoutFeedback
                      key={i}
                      onPress={() => {
                        runInAction(() => {
                          this.selectedSortCode = code;
                          this.loadReply(true);
                        });
                      }}>
                      <Text
                        style={[
                          // eslint-disable-next-line react-native/no-inline-styles
                          { fontSize: 14 },
                          // eslint-disable-next-line react-native/no-inline-styles
                          i ? { marginLeft: 15 } : {},
                          this.selectedSortCode === code
                            ? // eslint-disable-next-line react-native/no-inline-styles
                              { fontWeight: 'bold' }
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
          {this.noMoreOfReply ? (
            <Panel>
              <Text style={styles.replyNoMore}>{'No more replies'}</Text>
            </Panel>
          ) : (
            <Panel
              style={[
                styles.replyLoadingBox,
                // eslint-disable-next-line react-native/no-inline-styles
                this.replyLoading ? { opacity: 1 } : { opacity: 0 },
              ]}>
              <ActivityIndicator
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ marginRight: 10 }}
                size="small"
                color="black"
              />
              <Text style={{ color: colors.nobel }}>{'Loading...'}</Text>
            </Panel>
          )}
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
            onEndReached={() => {
              this.loadReply();
            }}
            data={this.replies}
            keyExtractor={(item, i) => {
              return item.rpid.toString() + '-' + i;
            }}
            extraData={this.extraData}
            renderItem={({ item }) => {
              return (
                <TouchableNative
                  style={styles.replyItem}
                  onPress={() => console.log('board')}>
                  <Image
                    style={styles.replyAvatar}
                    borderRadius={20}
                    source={{
                      uri: `${item.member.avatar}`,
                    }}
                    resizeMode={'cover'}
                  />
                  <View style={styles.replyItemContentBox}>
                    <Text selectable style={styles.replyUsername}>
                      {item.member.uname}
                    </Text>
                    <Text style={styles.replyTime}>
                      {new Date(item.ctime * 1000).toLocaleString()}
                    </Text>
                    <Text selectable style={styles.replyMessage}>
                      {item.content.message}
                    </Text>
                    {!!item.replies?.length && (
                      <View style={styles.subReplyBox}>
                        {item.replies.map((r) => {
                          return (
                            <TouchableNative
                              key={r.rpid}
                              onPress={() => {
                                console.log('3132');
                              }}>
                              <View>
                                <Text>
                                  <Text style={{ color: colors.pelorous }}>
                                    {r.member.uname}
                                  </Text>
                                  {': ' + r.content.message}
                                </Text>
                              </View>
                            </TouchableNative>
                          );
                        })}
                      </View>
                    )}
                  </View>
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

const styles = StyleSheet.create({
  userAvatar: {
    height: 40,
    width: 40,
    backgroundColor: colors.lightgray,
  },
  userInfoBox: {
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  usernameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.pink,
  },
  postUpTime: {
    fontSize: 14,
    color: colors.gray,
  },
  tagsBox: {
    ...layout.padding(15, 0),
    ...layout.border([1, 0, 0, 0], colors.lightgray),
    flexDirection: 'row',
  },
  tagText: {
    ...layout.padding(5),
    ...layout.margin(0, 10, 0, 0),
    flexWrap: 'wrap',
    flex: 0,
    alignItems: 'center',
    borderRadius: 5,
    color: colors.gray,
    backgroundColor: colors.whitesmoke,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...layout.padding(15),
    ...layout.border([0, 0, 0.5, 0], colors.lightgray),
  },
  commentTitleText: { fontSize: 14, fontWeight: 'bold' },
  replyNoMore: {
    ...layout.padding(20, 15),
    textAlign: 'center',
    color: colors.nobel,
  },
  replyLoadingBox: {
    ...layout.padding(15),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  replyItem: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    ...layout.padding(15),
    ...layout.border([0, 0, 0.5, 0], colors.lightgray),
  },
  replyAvatar: {
    height: 40,
    width: 40,
    backgroundColor: colors.lightgray,
  },
  replyItemContentBox: {
    marginLeft: 15,
    justifyContent: 'flex-start',
    flex: 1,
  },
  replyUsername: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.gray,
  },
  replyTime: {
    marginTop: 5,
    fontSize: 12,
    color: colors.gray,
  },
  replyMessage: {
    fontSize: 14,
    marginTop: 15,
  },
  subReplyBox: {
    marginTop: 10,
    ...layout.padding(10),
    borderRadius: 3,
    backgroundColor: colors.whitesmoke,
  },
});
