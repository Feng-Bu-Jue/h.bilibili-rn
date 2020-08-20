import React from 'react';
import { observer } from 'mobx-react';
import {
  View,
  Text,
  StyleSheet,
  LayoutRectangle,
  findNodeHandle,
} from 'react-native';
import { colors, layout, sizes } from '~/constants';
import { action, reaction, computed, observable, runInAction } from 'mobx';
import TouchableNative from './touchableNative';
import { BaseComponent, Portal } from '.';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export type Option<T> = {
  text: string;
  value: T;
};

const DropdownMenuContext = React.createContext<{
  onActiveIndexChange: (index: number) => void;
}>({} as any);

@observer
class DropdownMenu<T> extends BaseComponent<{
  containerRef?: React.RefObject<any>;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}> {
  static defaultProps = { activeIndex: -1 };

  private menu?: View | null = null;

  @observable
  menulayout?: LayoutRectangle;

  @computed
  get rendered() {
    return this.props.activeIndex >= 0 && !!this.menulayout;
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
    runInAction(() => {
      this.menulayout = menuLayout;
    });
  }

  hide() {}

  @action.bound
  onMenuItemPress(index: number) {
    this._onActiveIndexChange(index);
  }

  _onActiveIndexChange = (index: number) => {
    this.props.onActiveIndexChange(index);
  };

  render() {
    const { children, activeIndex } = this.props;
    return (
      <>
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
          <Portal>
            <View
              style={{
                zIndex: sizes.zIndexN,
                transform: [{ translateY: this.menulayout!.height }],
              }}>
              <DropdownMenuContext.Provider
                value={{ onActiveIndexChange: this._onActiveIndexChange }}>
                {React.Children.toArray(children)[activeIndex]}
              </DropdownMenuContext.Provider>
            </View>
            <TouchableWithoutFeedback
              // eslint-disable-next-line react-native/no-inline-styles
              containerStyle={{ flex: 1, backgroundColor: colors.black40 }}
              onPress={() => this.onMenuItemPress(-1)}
            />
          </Portal>
        )}
      </>
    );
  }
}

@observer
class DropdownMenuOption<T> extends React.Component<{
  value: T;
  options: Option<T>[];
  onValueChange: (value: T) => void;
}> {
  render() {
    const { value, options } = this.props;
    return (
      <DropdownMenuContext.Consumer>
        {({ onActiveIndexChange }) => {
          return (
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                flexDirection: 'row',
                ...layout.padding(5),
                backgroundColor: colors.whitesmoke,
              }}>
              {options.map((option) => {
                return (
                  <View key={String(option.value)} style={styles.optionItem}>
                    <TouchableNative
                      onPress={() => {
                        this.props.onValueChange(option.value);
                        onActiveIndexChange(-1);
                      }}
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        width: '100%',
                      }}>
                      <Text
                        style={[
                          styles.optionText,
                          value === option.value
                            ? {
                                backgroundColor: colors.pink,
                                color: colors.white,
                              }
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
        }}
      </DropdownMenuContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  menuBox: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: colors.white,
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
      width: 0,
    },
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
  optionItem: {
    borderRadius: 4,
    overflow: 'hidden',
    flexBasis: '25%',
    alignItems: 'center',
    ...layout.padding(5),
  },
  optionText: {
    fontSize: 14,
    width: '100%',
    textAlign: 'center',
    color: colors.gray,
    ...layout.padding(5, 10),
  },
});

export default {
  Box: DropdownMenu,
  Option: DropdownMenuOption,
};
