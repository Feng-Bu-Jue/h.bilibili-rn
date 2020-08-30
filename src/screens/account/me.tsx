import React from 'react';
import { Text } from 'react-native';
import { observer } from 'mobx-react';
import { Panel, TouchableNative } from '~/components';
import { MeProps } from '~/typings/navigation';
import { StackScreens } from '~/typings/screens';
import { colors, layout } from '~/constants';

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
          props.navigation.navigate(StackScreens.Login);
        }}>
        <Text style={{ color: colors.white }}>{'signin'}</Text>
      </TouchableNative>
    </Panel>
  );
});

//const styles = StyleSheet.create({});
