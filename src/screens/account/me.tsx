import React from 'react';
import { Text } from 'react-native';
import { observer } from 'mobx-react';
import { Panel, TouchableNative, BaseComponent } from '~/components';
import { MeProps } from '~/typings/navigation';
import { StackScreens } from '~/typings/screens';
import { colors, layout } from '~/constants';
import { appStore } from '~/stores/appStore';
import { UserApi } from '~/bilibiliApi';

export default observer((props: MeProps) => {
  return (
    <Panel style={{ alignItems: 'center', justifyContent: 'center' }}>
      <TouchableNative
        style={{
          backgroundColor: colors.pink,
          ...layout.padding(10),
          borderRadius: 4,
        }}
        onPress={() => {
          if (!appStore.authToken) {
            props.navigation.navigate(StackScreens.Login);
          } else {
            UserApi.userDetail({ vmid: appStore.authToken.mid });
          }
        }}>
        <Text style={{ color: colors.white }}>{'signin'}</Text>
      </TouchableNative>
    </Panel>
  );
});

export class Me extends BaseComponent {
  render() {
    return <></>;
  }
}
//const styles = StyleSheet.create({});
