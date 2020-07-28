import React from 'react';
import { observer } from 'mobx-react';
import { BaseComponent } from '~/components';
import { View, ScrollView } from 'react-native';
import { DrawDetailProps } from '~/typings/navigation';

@observer
export default class DrawDetail extends BaseComponent<DrawDetailProps> {
  constructor(props: DrawDetailProps) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <ScrollView style={{ backgroundColor: '#000' }} />
      </View>
    );
  }
}
