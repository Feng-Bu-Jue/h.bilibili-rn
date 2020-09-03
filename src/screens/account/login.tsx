import React from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import IconBilibili from '~/assets/iconfont/IconBilibili';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout } from '~/constants';
import { Panel, TouchableNative } from '~/components';
import { useLocalStore, observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { AuthApi } from '~/bilibiliApi';
// @ts-ignore
import { JSEncrypt } from 'jsencrypt';
import { LoginProps } from '~/typings/navigation';
import { appStore } from '~/stores/appStore';
import { SignHelper } from '~/bilibiliApi/util';

const Login = observer((props: LoginProps) => {
  const insets = useSafeAreaInsets();
  const store = useLocalStore(() => ({
    username: '@qq.com',
    password: '',
  }));

  const onSigninPress = async () => {
    const { username, password } = store;
    console.log(username, password);
    // 0. TODO: vlidate password & username
    // 1. encrypt password
    const {
      data: { hash, key },
    } = await AuthApi.encryptPassword({
      act: 'getkey',
      _: Date.now().toString().substr(0, 10),
    });
    console.log(hash, key);
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(key);
    let encryptedPassword = encrypt.encrypt(hash.concat(password));

    // 2. get access token
    const loginParams = {
      username: username,
      password: encryptedPassword,
      gee_type: 10,
      appkey: '4409e2ce8ffd12b8',
      mobi_app: 'android',
      platform: 'android',
      ts: 1599129389,
    } as any;
    // signature
    const appSecret = '59b43e04ad6965f34319062b478f83dd';
    loginParams.sign = SignHelper.md5Sign(loginParams, (signString) =>
      signString.concat(appSecret),
    );
    const {
      data: {
        data: {
          token_info: { access_token },
        },
      },
    } = await AuthApi.login(loginParams);

    console.log(access_token);
    // 3. stored cookie
    const {
      data: {
        data: { cookie },
      },
    } = await AuthApi.freshSSO(access_token);
    await appStore.saveAuthResult(cookie);

    console.log(cookie);
    if (cookie) {
      props.navigation.goBack();
    }
  };

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
        <TouchableNative
          style={styles.signinButton}
          onPress={() => {
            onSigninPress();
          }}>
          <Text style={styles.singinText}>{'登录'}</Text>
        </TouchableNative>
      </Panel>
    </Panel>
  );
});

export default Login;

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
