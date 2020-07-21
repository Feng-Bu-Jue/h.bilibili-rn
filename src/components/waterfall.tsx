import React from 'react';
import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

type Props<TItem> = {
  columnWidth: number;
  columnGap?: number;
  itemInfoData: ItemInfo<TItem>[];
  bufferAmount?: number;
  renderItem: (itemInfo: ItemInfo<TItem>, index: number) => React.ReactNode;
  onReachEnd: () => void;
};

type State = {
  columnCount: number;
  offset: number;
};

type ItemInfo<TItem> = {
  size: number;
  item: TItem;
};

export default class Waterfall<TItem = any> extends React.Component<
  Props<TItem>,
  State
> {
  static defaultProps: Partial<Props<any>> = {
    columnGap: 0,
    bufferAmount: 10,
  };

  scrollHeight = 0;
  scrollWidth = 0;
  lastMeasuredIndex = -1;

  itemPositions: Array<{ offsetLeft: number; offsetTop: number }> = [];
  itemOffsetTops: Array<number> = [];

  constructor(props: Props<TItem>) {
    super(props);
    this.state = { offset: 0, columnCount: 0 } as State;
  }

  onScroll = ({
    nativeEvent: {
      contentOffset: { y },
      layoutMeasurement: { height },
      contentSize: { height: contentHeight },
    },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.setState({ offset: y });
    console.log(y, contentHeight);
    if (y + height >= contentHeight - 20) {
      this.props.onReachEnd?.call(undefined);
    }
  };

  _getOffsetColumn(predicate: (a: number, b: number) => boolean) {
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
    return this._getOffsetColumn((a, b) => a <= b);
  }

  getHighestOffsetColumn() {
    return this._getOffsetColumn((a, b) => a >= b);
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
      var middle = minIndex + Math.floor((maxIndex - minIndex) / 2);
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
    const { columnWidth, columnGap, itemInfoData } = this.props;
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
    const { columnWidth, columnGap, itemInfoData, renderItem } = this.props;
    const { columnCount } = this.state;
    const items: React.ReactNodeArray = [];
    let scrollOffset = 0;
    if (columnCount && itemInfoData.length) {
      if (!this.itemOffsetTops.length) {
        this.itemOffsetTops = Array(columnCount).fill(0);
      }
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
            {renderItem(itemInfoData[i], i)}
          </View>,
        );
      }
      scrollOffset = this.getHighestOffsetColumn()[1];
    }

    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1 }}
        onLayout={({
          nativeEvent: {
            layout: { width, height },
          },
        }) => {
          if (this.scrollWidth !== width) {
            this.scrollWidth = width;
            this.scrollHeight = height;
            this.setState({
              columnCount: Math.floor(
                (width - columnGap!) / (columnWidth + columnGap!),
              ),
            });
          }
        }}>
        <ScrollView
          onScroll={this.onScroll}
          scrollEventThrottle={16}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            position: 'relative',
            width: '100%',
            height: scrollOffset,
          }}>
          {items}
        </ScrollView>
      </View>
    );
  }
}
