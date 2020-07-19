import React from 'react';
import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { colors } from '~/utils/colors';

type Props<TItem> = {
  columnWidth: number;
  columnGap?: number;
  itemInfoData: ItemInfo<TItem>[];
  renderItem: (itemInfo: ItemInfo<TItem>, index: number) => React.ReactNode;
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
    },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.setState({ offset: y });
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

  evaluateVisableItemIndexRange() {
    const { offset } = this.state;
    let start: number | undefined;
    let end: number | undefined;
    for (let i = 0; i < this.props.itemInfoData.length; i++) {
      const position = this.getPositionForIndex(i);
      if (
        position.offsetTop >= offset - this.scrollHeight * 1.5 &&
        start === undefined
      ) {
        start = i;
      } else if (
        (position.offsetTop >= offset + this.scrollHeight * 2.5 ||
          this.props.itemInfoData.length - 1 === i) &&
        end === undefined
      ) {
        end = i;
      }
      if (start !== undefined && end !== undefined) {
        break;
      }
    }
    return [start, end];
  }

  getPositionForIndex(index: number) {
    const { columnWidth, columnGap, itemInfoData } = this.props;
    if (index > this.lastMeasuredIndex) {
      for (let i = this.lastMeasuredIndex + 1; i <= index; i++) {
        const [columnIndex, columnOffset] = this.getLowestOffsetColumn();
        this.itemPositions[i] = {
          offsetLeft: (columnWidth + columnGap) * columnIndex,
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
    if (columnCount) {
      if (!this.itemOffsetTops?.length) {
        this.itemOffsetTops = Array(columnCount).fill(0);
      }
      const [start, end] = this.evaluateVisableItemIndexRange();
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
        <ScrollView onScroll={this.onScroll} scrollEventThrottle={100}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              position: 'relative',
              width: '100%',
              height: scrollOffset,
              backgroundColor: colors.blush,
            }}>
            {items}
          </View>
        </ScrollView>
      </View>
    );
  }
}
