import React from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import IconBilibili from '~/assets/iconfont/IconBilibili';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout } from '~/constants';
import { Panel, TouchableNative } from '~/components';
import { useLocalStore, observer } from 'mobx-react';
import { runInAction } from 'mobx';

export default observer(() => {
  const insets = useSafeAreaInsets();
  const store = useLocalStore(() => ({
    username: '',
    password: '',
  }));

  return (
    <Panel>
      <View style={[styles.logoContainer, { paddingTop: insets.top + 30 }]}>
        <IconBilibili size={100} color={colors.white} />
      </View>
      <Panel style={layout.padding(0, 15)}>
        <TextInput
          style={[styles.inputBox]}
          value={store.username}
          placeholder={'账号/邮箱/手机号'}
          selectionColor={colors.pink}
          placeholderTextColor={colors.lightgray}
          onChangeText={(text) => {
            runInAction(() => {
              store.username = text;
            });
          }}
        />
        <TextInput
          style={styles.inputBox}
          value={store.password}
          placeholder={'密码'}
          textContentType={'password'}
          selectionColor={colors.pink}
          placeholderTextColor={colors.lightgray}
          onChangeText={(text) => {
            runInAction(() => {
              store.password = text;
            });
          }}
        />
        <TouchableNative style={styles.signinButton}>
          <Text style={styles.singinText}>{'登录'}</Text>
        </TouchableNative>
      </Panel>
    </Panel>
  );
});

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    backgroundColor: colors.pink,
    ...layout.padding(0, 0, 40),
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    elevation: 5,
    shadowOffset: { height: -3, width: 1 },
    shadowColor: colors.black40,
    marginBottom: 40,
  },
  inputBox: {
    ...layout.padding(10),
    backgroundColor: '#F2F3F5',
    marginBottom: 20,
  },
  signinButton: {
    backgroundColor: colors.pink,
    ...layout.padding(10, 0),
    alignItems: 'center',
    borderRadius: 6,
  },
  singinText: {
    fontSize: 16,
    color: colors.white,
  },
});
