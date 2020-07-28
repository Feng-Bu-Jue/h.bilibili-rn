import { sizes } from './sizes';
import { ViewStyle } from 'react-native';
import { colors } from './colors';

export const layout = {
  maskView(backgroundColor: string = 'rgba(0, 0, 0, 0.4)'): ViewStyle {
    return {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      position: 'absolute',
      // width: '100%',
      // height: '100%',
      zIndex: sizes.zIndexN,
      backgroundColor,
    };
  },
  flex(
    flexGrow?: number,
    flexShrink?: number,
    flexBasis?: number | string,
  ): Style.Flex {
    const flex: Style.Flex = {};
    if (flexGrow !== undefined) {
      flex.flexGrow = flexGrow;
      // flex.flexShrink = 1;
      // flex.flexBasis = '0%';
    }
    if (flexShrink !== undefined) {
      flex.flexShrink = flexShrink;
    }
    if (flexBasis !== undefined) {
      flex.flexBasis = flexBasis;
    }
    return flex;
  },
  padding(...arg: Array<number | string>): Style.Padding {
    if (arg.length === 1) {
      return {
        paddingTop: arg[0],
        paddingRight: arg[0],
        paddingBottom: arg[0],
        paddingLeft: arg[0],
      };
    }
    if (arg.length === 2) {
      return {
        paddingTop: arg[0],
        paddingRight: arg[1],
        paddingBottom: arg[0],
        paddingLeft: arg[1],
      };
    }
    if (arg.length === 3) {
      return {
        paddingTop: arg[0],
        paddingRight: arg[1],
        paddingBottom: arg[2],
        paddingLeft: arg[1],
      };
    }
    if (arg.length === 4) {
      return {
        paddingTop: arg[0],
        paddingRight: arg[1],
        paddingBottom: arg[2],
        paddingLeft: arg[3],
      };
    }
    return {};
  },
  margin(...arg: Array<number | string>): Style.Margin {
    if (arg.length === 1) {
      return {
        marginTop: arg[0],
        marginRight: arg[0],
        marginBottom: arg[0],
        marginLeft: arg[0],
      };
    }
    if (arg.length === 2) {
      return {
        marginTop: arg[0],
        marginRight: arg[1],
        marginBottom: arg[0],
        marginLeft: arg[1],
      };
    }
    if (arg.length === 3) {
      return {
        marginTop: arg[0],
        marginRight: arg[1],
        marginBottom: arg[2],
        marginLeft: arg[1],
      };
    }
    if (arg.length === 4) {
      return {
        marginTop: arg[0],
        marginRight: arg[1],
        marginBottom: arg[2],
        marginLeft: arg[3],
      };
    }
    return {};
  },
  border(
    arg: Array<number> | number,
    borderColor: Array<string> | string = colors.gray,
    borderStyle: Style.BorderStyle = 'solid',
  ): Style.Border {
    const border: Style.Border = {
      borderStyle,
      ...layout.borderColor.apply(
        layout,
        typeof borderColor === 'string' ? [borderColor] : borderColor,
      ),
    };
    if (typeof arg === 'number') {
      border.borderWidth = arg;
    } else {
      if (arg.length === 1) {
        border.borderWidth = arg[0];
      }
      if (arg.length === 2) {
        border.borderTopWidth = arg[0];
        border.borderRightWidth = arg[1];
        border.borderBottomWidth = arg[0];
        border.borderLeftWidth = arg[1];
      }
      if (arg.length === 3) {
        border.borderTopWidth = arg[0];
        border.borderRightWidth = arg[1];
        border.borderBottomWidth = arg[2];
        border.borderLeftWidth = arg[1];
      }
      if (arg.length === 4) {
        border.borderTopWidth = arg[0];
        border.borderRightWidth = arg[1];
        border.borderBottomWidth = arg[2];
        border.borderLeftWidth = arg[3];
      }
    }
    return border;
  },
  borderColor(...arg: Array<string>): Style.BorderColor {
    if (arg.length === 1) {
      return {
        borderColor: arg[0],
      };
    }
    if (arg.length === 2) {
      return {
        borderTopColor: arg[0],
        borderRightColor: arg[1],
        borderBottomColor: arg[0],
        borderLeftColor: arg[1],
      };
    }
    if (arg.length === 3) {
      return {
        borderTopColor: arg[0],
        borderRightColor: arg[1],
        borderBottomColor: arg[2],
        borderLeftColor: arg[1],
      };
    }
    if (arg.length === 4) {
      return {
        borderTopColor: arg[0],
        borderRightColor: arg[1],
        borderBottomColor: arg[2],
        borderLeftColor: arg[3],
      };
    }
    return {};
  },
};
