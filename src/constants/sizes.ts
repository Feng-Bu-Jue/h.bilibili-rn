import { NativeModules, Platform, Dimensions, StatusBar } from 'react-native';

// Get StatuBar Height
let statuHeight: number = 0;
if (Platform.OS === 'ios') {
  NativeModules.StatusBarManager.getHeight(({ height }: { height: number }) => {
    statuHeight = height || 0;
  });
} else {
  statuHeight = StatusBar.currentHeight || 0;
}

export const sizes = {
  get statuHeight() {
    return statuHeight;
  },
  get headerHeight() {
    return Platform.select({
      ios: 44 + statuHeight,
      default: 44 + statuHeight,
    });
  },
  windowWidth: Dimensions.get('window').width,
  windowHeight: Dimensions.get('window').height,
  screenWidth: Dimensions.get('screen').width,
  screenHeight: Dimensions.get('screen').height,
  zIndexN: 1,
  zIndexMax: 999,
};
