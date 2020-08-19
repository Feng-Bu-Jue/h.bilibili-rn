import React from 'react';
import { observer } from 'mobx-react';
import {
  View,
  Text,
  StyleSheet,
  LayoutRectangle,
  findNodeHandle,
} from 'react-native';
import { colors, layout } from '~/constants';
import { action, reaction, observable, computed } from 'mobx';
import TouchableNative from './touchableNative';
import { BaseComponent } from '.';

type Option<T> = {
  text: string;
  value: T;
};

const DropdownMenuContext = React.createContext({});

@observer
class DropdownMenu<T> extends BaseComponent<{
  containerRef?: React.RefObject<any>;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}> {
  static defaultProps = { activeIndex: -1 };

  menulayout?: LayoutRectangle;
  private menu?: View | null = null;

  @computed
  get rendered() {
    return this.props.activeIndex >= 0 && false;
  }

  componentDidMount() {
    this.$reactionDisposers.push(
      reaction(
        () => this.props.activeIndex,
        (index) => {
          if (index >= 0) {
            this.show();
          } else {
            this.hide();
          }
        },
        { fireImmediately: true },
      ),
    );
  }

  private measureMenuLayout = () =>
    new Promise<LayoutRectangle>((resolve, reject) => {
      if (this.props.containerRef) {
        this.menu?.measureLayout(
          findNodeHandle(this.props.containerRef as any) as any,
          (x, y, width, height) => {
            resolve({ x, y, width, height });
          },
          () => reject(),
        );
      }
      if (this.menu) {
        this.menu.measureInWindow((x, y, width, height) => {
          resolve({ x, y, width, height });
        });
      }
    });

  async show() {
    const menuLayout = await this.measureMenuLayout();
    console.log(menuLayout);
  }

  hide() {}

  @action.bound
  onMenuItemPress(index: number) {
    this.props.onActiveIndexChange(index);
  }

  render() {
    const { children, activeIndex } = this.props;

    return (
      <DropdownMenuContext.Provider value={{}}>
        <View
          ref={(ref) => {
            this.menu = ref;
          }}
          style={styles.menuBox}>
          {React.Children.map(
            children as any,
            (option: DropdownMenuOption<T>, index) => {
              const { value, options } = option.props;
              return (
                <TouchableNative
                  onPress={() => this.onMenuItemPress(index)}
                  style={styles.menuItem}>
                  <Text style={styles.menuItemText}>
                    {options.find((x) => x.value === value)?.text}
                  </Text>
                </TouchableNative>
              );
            },
          )}
        </View>
        {this.rendered && (
          <View style={[styles.optionBox]}>
            {React.Children.toArray(children)[activeIndex]}
          </View>
        )}
      </DropdownMenuContext.Provider>
    );
  }
}

@observer
class DropdownMenuOption<T> extends React.Component<{
  value: T;
  options: Option<T>[];
}> {
  render() {
    const { value, options } = this.props;
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flexDirection: 'row',
          ...layout.padding(5),
          backgroundColor: colors.whitesmoke,
          flex: 1,
          width: '100%',
        }}>
        {options.map((option) => {
          return (
            <View style={styles.optionItem}>
              <TouchableNative
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    styles.optionText,
                    value === option.value
                      ? { backgroundColor: colors.pink, color: colors.white }
                      : {},
                  ]}>
                  {option.text}
                </Text>
              </TouchableNative>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menuBox: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: colors.white,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 14,
    color: colors.gray,
    ...layout.padding(10, 0),
  },
  optionBox: {
    position: 'absolute',
    backgroundColor: colors.whitesmoke,
    width: '100%',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowRadius: 6,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  optionItem: {
    borderRadius: 4,
    overflow: 'hidden',
    flexBasis: '25%',
    alignItems: 'center',
    ...layout.padding(5),
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: colors.gray,
    ...layout.padding(5, 10),
  },
});

export default {
  Box: DropdownMenu,
  Option: DropdownMenuOption,
};
