import { observer } from 'mobx-react';
import React from 'react';
import { EmitterSubscription } from 'react-native';
import { IReactionDisposer } from 'mobx';

@observer
export default class BaseComponent<
  P = {},
  S = {},
  SS = any
> extends React.Component<P, S, SS> {
  $listeners: EmitterSubscription[] = [];
  $reactionDisposers: Array<IReactionDisposer> = [];

  componentWillUnmount() {
    this.$reactionDisposers?.forEach((_) => _());
    this.$listeners.forEach((_) => _.remove());
    this.$onWillUnmount();
  }

  $onWillUnmount(): void {}
}
