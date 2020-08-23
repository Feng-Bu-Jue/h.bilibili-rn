import * as React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import PortalManager from './portalManager';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

type Operation =
  | { type: 'mount'; key: number; children: React.ReactNode }
  | { type: 'update'; key: number; children: React.ReactNode }
  | { type: 'unmount'; key: number };

export type PortalMethods = {
  mount: (children: React.ReactNode) => number;
  update: (key: number, children: React.ReactNode) => void;
  unmount: (key: number) => void;
};

export const PortalContext = React.createContext<PortalMethods>(null as any);

export default class PortalHost extends React.Component<Props> {
  static displayName = 'Portal.Host';

  componentDidMount() {
    const manager = this.manager;
    const queue = this.queue;

    while (queue.length && manager) {
      const action = queue.pop();
      if (action) {
        switch (action.type) {
          case 'mount':
            manager.mount(action.key, action.children);
            break;
          case 'update':
            manager.update(action.key, action.children);
            break;
          case 'unmount':
            manager.unmount(action.key);
            break;
        }
      }
    }
  }

  private setManager = (manager: PortalManager | undefined | null) => {
    this.manager = manager;
  };

  private mount = (children: React.ReactNode) => {
    const key = this.nextKey++;

    if (this.manager) {
      this.manager.mount(key, children);
    } else {
      this.queue.push({ type: 'mount', key, children });
    }

    return key;
  };

  private update = (key: number, children: React.ReactNode) => {
    if (this.manager) {
      this.manager.update(key, children);
    } else {
      const op = { type: 'mount', key, children };
      const index = this.queue.findIndex(
        (o) => o.type === 'mount' || (o.type === 'update' && o.key === key),
      );

      if (index > -1) {
        // @ts-ignore
        this.queue[index] = op;
      } else {
        this.queue.push(op as Operation);
      }
    }
  };

  private unmount = (key: number) => {
    if (this.manager) {
      this.manager.unmount(key);
    } else {
      this.queue.push({ type: 'unmount', key });
    }
  };

  private nextKey = 0;
  private queue: Operation[] = [];
  private manager: PortalManager | null | undefined;

  render() {
    return (
      <PortalContext.Provider
        value={{
          mount: this.mount,
          update: this.update,
          unmount: this.unmount,
        }}>
        {/* Need collapsable=false here to clip the elevations, otherwise they appear above Portal components */}
        <View
          style={[styles.container, this.props.style]}
          collapsable={false}
          pointerEvents="box-none">
          {this.props.children}
        </View>
        <PortalManager ref={this.setManager} />
      </PortalContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});