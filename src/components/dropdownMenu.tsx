import React from 'react';
import { observer } from 'mobx-react';
import {
  View,
  Text,
  StyleSheet,
  LayoutRectangle,
  LayoutChangeEvent,
  Animated,
  Easing,
} from 'react-native';
import { colors, layout } from '~/constants';
import { action, reaction, computed, observable, runInAction } from 'mobx';
import TouchableNative from './touchableNative';
import { BaseComponent, Portal } from '.';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export type Option<T> = {
  text: string;
  value: T;
};

// eslint-disable-next-line no-spaced-func
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

  menuOptionTranslateY = new Animated.Value(0);

  @observable
  menuLayout?: LayoutRectangle;
  @observable
  _activeIndex = -1;

  @computed
  get rendered() {
    return !!this.menuLayout && this._activeIndex >= 0;
  }

  componentDidMount() {
    this.$reactionDisposers.push(
      reaction(
        () => this.props.activeIndex,
        (index) => {
          if (index >= 0) {
            this.show(index);
          } else {
            this.hide();
          }
        },
        { fireImmediately: true },
      ),
    );
  }

  @action.bound
  onMenuLayout(event: LayoutChangeEvent) {
    this.menuLayout = event.nativeEvent.layout;
  }

  @action
  show(index: number) {
    this.menuOptionTranslateY.setValue(-this.menuLayout!.height);
    this._activeIndex = index;
    Animated.timing(this.menuOptionTranslateY, {
      toValue: 0,
      easing: Easing.ease,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }

  hide() {
    Animated.timing(this.menuOptionTranslateY, {
      toValue: -(this.menuLayout?.height || 0),
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      runInAction(() => {
        this._activeIndex = -1;
      });
    });
  }

  @action.bound
  onMenuItemPress(index: number) {
    this._onActiveIndexChange(index);
  }

  _onActiveIndexChange = (index: number) => {
    this.props.onActiveIndexChange(index);
  };

  render() {
    const { children } = this.props;
    return (
      <>
        <View onLayout={this.onMenuLayout} style={[styles.menuBox]}>
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
              style={[
                StyleSheet.absoluteFill,
                styles.innerPortal,
                {
                  transform: [{ translateY: this.menuLayout?.height || 0 }],
                },
              ]}>
              <Animated.View
                style={[
                  styles.optionView,
                  {
                    transform: [
                      {
                        translateY: this.menuOptionTranslateY,
                      },
                    ],
                  }, //todo enter/out animation
                ]}>
                <DropdownMenuContext.Provider
                  value={{ onActiveIndexChange: this._onActiveIndexChange }}>
                  {React.Children.toArray(children)[this._activeIndex]}
                </DropdownMenuContext.Provider>
              </Animated.View>
              <TouchableWithoutFeedback
                containerStyle={styles.mask}
                onPress={() => this.onMenuItemPress(-1)}
              />
            </View>
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
            <View style={styles.optionBox}>
              {options.map((option) => {
                return (
                  <TouchableNative
                    key={String(option.value)}
                    onPress={() => {
                      this.props.onValueChange(option.value);
                      onActiveIndexChange(-1);
                    }}
                    style={styles.optionItem}>
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
  innerPortal: {
    overflow: 'hidden',
  },
  optionView: {
    top: 0,
    left: 0,
    zIndex: 100,
    width: '100%',
    position: 'absolute',
  },
  mask: {
    flex: 1,
    backgroundColor: colors.black40,
  },
  optionBox: {
    flexDirection: 'row',
    ...layout.padding(5),
    backgroundColor: colors.whitesmoke,
    flex: 1,
  },
  optionItem: {
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    ...layout.margin(5),
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
