import React from 'react';
import { BaseComponent, Panel } from '~/components';
import { View, Image, StyleSheet, Text } from 'react-native';
import { UserApi } from '~/bilibiliApi';
import { appStore } from '~/stores/appStore';
import { observable, runInAction, reaction } from 'mobx';
import { UserSpaceDetail } from '~/bilibiliApi/typings';
import { observer } from 'mobx-react';
import { colors, sizes, layout } from '~/constants';
import {
  SafeAreaInsetsContext,
  EdgeInsets,
} from 'react-native-safe-area-context';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MeProps } from '~/typings/navigation';
import { StackScreens } from '~/typings/screens';

// const AutoHeightImageBackground = AutoHeightImageHOC(ImageBackground);

@observer
export default class Me extends BaseComponent<MeProps> {
  static contextType = SafeAreaInsetsContext;
  constructor(props: MeProps) {
    super(props);

    this.$reactionDisposers.push(
      reaction(
        () => appStore.authToken,
        (tokenInfo) => {
          if (tokenInfo) {
            this.getUserDetail(tokenInfo.mid);
          }
        },
        { fireImmediately: true },
      ),
    );
  }

  @observable
  userDetail?: UserSpaceDetail;

  async getUserDetail(mid: number) {
    const {
      data: { data: userDetail },
    } = await UserApi.getUserDetail({
      vmid: mid,
    });
    runInAction(() => {
      this.userDetail = userDetail;
    });
  }

  renderProfile() {
    if (this.userDetail) {
      return (
        <View style={styles.profileBox}>
          <Image
            source={{ uri: this.userDetail?.card.face }}
            borderRadius={40}
            style={styles.avatar}
          />
          <Text style={styles.levelText}>
            Lv{this.userDetail?.card.level_info.current_level}
          </Text>
          <Text style={styles.nameText}>{this.userDetail?.card.name}</Text>
          <Text style={styles.signText}>{this.userDetail?.card.sign}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.profileBox}>
          <TouchableWithoutFeedback
            style={styles.avatar}
            onPress={() => {
              this.props.navigation.push(StackScreens.Login);
            }}>
            <Text style={[styles.tologinText]}>{'点击登录'}</Text>
          </TouchableWithoutFeedback>
          <Text style={[styles.nameText, { color: colors.gray }]}>{'-'}</Text>
          <Text style={styles.signText}>{'-'}</Text>
        </View>
      );
    }
  }

  render() {
    const insets: EdgeInsets = this.context;
    return (
      <Panel style={{ paddingTop: insets.top }}>
        {this.renderProfile()}
        <Panel style={styles.sectionCard}></Panel>
      </Panel>
    );
  }
}
const styles = StyleSheet.create({
  profileBox: {
    ...layout.padding(20, 0),
    alignItems: 'center',
  },
  spaceBg: {
    height: 130,
    alignItems: 'center',
    width: sizes.windowWidth,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: colors.lightgray,
  },
  levelText: {
    ...layout.padding(0, 8),
    color: colors.white,
    backgroundColor: colors.pink,
    borderRadius: 10,
    fontWeight: 'bold',
    transform: [{ translateY: -2 }],
  },
  nameText: {
    ...layout.padding(10, 0, 5),
    color: colors.pink,
    fontWeight: 'bold',
    fontSize: 18,
  },
  signText: {
    ...layout.padding(3, 10),
    color: colors.gray,
    fontSize: 14,
    backgroundColor: colors.whitesmoke,
    borderRadius: 10,
  },
  tologinText: {
    color: colors.white,
    fontSize: 14,
  },
  sectionCard: {
    elevation: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
