import React from 'react';
import {
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleProp,
  ImageStyle,
  ScrollViewProps,
  Animated,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';

export type WaterfallProps<TItem> = {
  columnCount: number;
  columnGap?: number;
  itemInfoData: ItemInfo<TItem>[];
  bufferAmount?: number;
  renderItem: (
    itemInfo: ItemInfo<TItem>,
    columnWidth: number,
    index: number,
  ) => React.ReactNode;
  renderHeader: () => React.ReactNode;
  renderFooter: () => React.ReactNode;
  onInitData: (columnWidth: number) => void;
  onInfinite?: (columnWidth: number) => void;
  onRefesh: (columnWidth: number) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ImageStyle>;
} & ScrollViewProps;

type State = {
  columnWidth: number;
  offset: number;
};

export type ItemInfo<TItem> = {
  size: number;
  item: TItem;
};

export default class Waterfall<TItem = any> extends React.Component<
  WaterfallProps<TItem>,
  State
> {
  static defaultProps: Partial<WaterfallProps<any>> = {
    columnGap: 0,
    bufferAmount: 10,
  };

  scrollOffset = new Animated.Value(0);
  itemsRunwayOffset = new Animated.Value(0);

  scrollHeight = 0;
  scrollWidth = 0;
  lastMeasuredIndex = -1;

  itemPositions: Array<{ offsetLeft: number; offsetTop: number }> = [];
  itemOffsetTops: Array<number> = [];

  constructor(props: WaterfallProps<TItem>) {
    super(props);
    this.itemOffsetTops = Array(this.props.columnCount).fill(0);
    this.state = { offset: 0, columnWidth: 0 } as State;
  }

  getColumnWidth = () => {
    return this.state.columnWidth;
  };

  private onScroll = ({
    nativeEvent: {
      contentOffset: { y },
      layoutMeasurement: { height },
      contentSize: { height: contentHeight },
    },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.setState({ offset: y });
    if (y + height >= contentHeight - 20) {
      this.props.onInfinite?.call(undefined, this.state.columnWidth);
    }
  };

  private onItemsBoxLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }: LayoutChangeEvent) => {
    if (this.scrollWidth !== width) {
      const { columnCount, columnGap, itemInfoData, onInitData } = this.props;

      this.scrollWidth = width;
      this.scrollHeight = height;
      const newColumnWidth =
        (width - (columnCount - 1) * columnGap!) / columnCount;
      if (!itemInfoData?.length) {
        onInitData?.call(undefined, newColumnWidth);
      }
      this.setState({
        columnWidth: newColumnWidth,
      });
    }
  };

  private getOffsetColumn(predicate: (a: number, b: number) => boolean) {
    let index = 0;
    let value = 0;
    if (this.itemOffsetTops.length) {
      value = this.itemOffsetTops.reduce((p, c, i) => {
        if (predicate(p, c)) {
          index = i - 1;
          return p;
        } else {
          index = i;
          return c;
        }
      });
    }
    return [index, value];
  }

  getLowestOffsetColumn() {
    return this.getOffsetColumn((a, b) => a <= b);
  }

  getHighestOffsetColumn() {
    return this.getOffsetColumn((a, b) => a >= b);
  }

  evaluateVisibleRange() {
    let { offset } = this.state;
    const { itemInfoData, bufferAmount } = this.props;
    const maxOffset = offset + this.scrollHeight * 2;
    const itemCount = itemInfoData.length;
    let start = 0;

    const lastMeasuredOffset =
      this.lastMeasuredIndex >= 0
        ? this.getPositionForIndex(this.lastMeasuredIndex).offsetTop
        : 0;

    const compare = (i: number) =>
      this.getPositionForIndex(i).offsetTop <= offset;

    if (lastMeasuredOffset >= offset) {
      start = this.binarySearch({
        minIndex: 0,
        maxIndex: this.lastMeasuredIndex,
        compare,
      });
    } else {
      start = this.exponentialSearch({
        arrayLength: itemCount,
        index: this.lastMeasuredIndex,
        compare,
      });
    }

    offset =
      this.getPositionForIndex(start).offsetTop + itemInfoData[start].size;

    let end = start;
    while (offset < maxOffset && end < itemCount - 1) {
      end++;
      offset = this.getPositionForIndex(end).offsetTop;
    }

    if (bufferAmount) {
      start = Math.max(0, start - bufferAmount);
      end = Math.min(end + bufferAmount, itemCount - 1);
    }
    return [start, end];
  }

  private binarySearch({
    minIndex,
    maxIndex,
    compare,
  }: {
    minIndex: number;
    maxIndex: number;
    compare: (mid: number) => boolean;
  }) {
    while (maxIndex >= minIndex) {
      const middle = minIndex + Math.floor((maxIndex - minIndex) / 2);
      if (compare(middle)) {
        minIndex = middle + 1;
      } else {
        maxIndex = middle - 1;
      }
    }
    if (minIndex > 0) {
      return minIndex - 1;
    }
    //not found :)
    return 0;
  }

  private exponentialSearch({
    arrayLength,
    index,
    compare,
  }: {
    arrayLength: number;
    index: number;
    compare: (index: number) => boolean;
  }) {
    let interval = 1;
    while (index < arrayLength && compare(index)) {
      index += interval;
      interval *= 2;
    }
    return this.binarySearch({
      minIndex: Math.min(index, arrayLength - 1),
      maxIndex: Math.floor(index / 2),
      compare,
    });
  }

  getPositionForIndex(index: number) {
    const { columnGap, itemInfoData } = this.props;
    const { columnWidth } = this.state;
    if (index > this.lastMeasuredIndex) {
      for (let i = this.lastMeasuredIndex + 1; i <= index; i++) {
        const [columnIndex, columnOffset] = this.getLowestOffsetColumn();
        this.itemPositions[i] = {
          offsetLeft: (columnWidth + columnGap!) * columnIndex,
          offsetTop: columnOffset,
        };
        this.itemOffsetTops[columnIndex] = columnOffset + itemInfoData[i].size;
        this.lastMeasuredIndex = i;
      }
    }
    return this.itemPositions[index];
  }

  render() {
    const {
      renderItem,
      renderHeader,
      renderFooter,
      itemInfoData,
      style,
      onScroll,
      containerStyle,
      ...rest
    } = this.props;
    const { columnWidth } = this.state;
    const items: React.ReactNodeArray = [];

    if (columnWidth && itemInfoData.length) {
      const [start, end] = this.evaluateVisibleRange();

      for (let i = start; i <= end; i++) {
        const posistion = this.getPositionForIndex(i);
        items.push(
          <View
            key={i}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              position: 'absolute',
              top: posistion.offsetTop,
              left: posistion.offsetLeft,
              width: columnWidth,
              height: itemInfoData[i].size,
            }}>
            {renderItem(itemInfoData[i], columnWidth, i)}
          </View>,
        );
      }

      const runwayOffset = this.getHighestOffsetColumn()[1];
      this.itemsRunwayOffset.setValue(runwayOffset);
    }

    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1 }}>
        <Animated.ScrollView
          style={style}
          bounces={false}
          onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            this.onScroll(e);
            onScroll?.call(undefined, e);
          }}
          scrollEventThrottle={100}
          {...(rest as any)}>
          <Animated.View style={[styles.container, containerStyle]}>
            {renderHeader && <View>{renderHeader()}</View>}
            <Animated.View
              style={{ height: this.itemsRunwayOffset }}
              onLayout={this.onItemsBoxLayout}>
              {items}
            </Animated.View>
            {renderFooter && <View>{renderFooter()}</View>}
          </Animated.View>
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
});
