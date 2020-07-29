import { observer } from 'mobx-react';
import React from 'react';
import {
  ImageProps,
  Image,
  View,
  LayoutChangeEvent,
  ImageURISource,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { observable, computed, runInAction } from 'mobx';
import merge from 'lodash.merge';
import { BaseComponent } from '.';
import { FastImageProps } from 'react-native-fast-image';

type ImageSize = { height: number; width: number };
const cache = new Map();
const returnWithSaveCache = function <T>(key: string, value: T) {
  cache.set(key, value);
  return value;
};

export const batchLoadImages = async function (
  source: ImageURISource[],
): Promise<void> {
  await Promise.all(source.map((x) => loadImage(x)));
};

const loadImage = function (source: any): Promise<ImageSize> {
  return new Promise<ImageSize>((resolve, reject) => {
    if (cache.has(source.uri)) {
      const size = cache.get(source.uri);
      resolve(size);
    }
    Image.getSize(
      source.uri!,
      (width: number, height: number) => {
        resolve(returnWithSaveCache(source.uri, { height, width }));
      },
      (error) => {
        try {
          const { height, width } = (Image as any).resolveAssetSource(source);
          resolve(returnWithSaveCache(source.uri, { height, width }));
        } catch (newError) {
          reject(error);
        }
      },
    );
  });
};

type Props = {
  height?: number;
  width?: number;
  imageStyle?: StyleProp<ViewStyle>;
} & (ImageProps | FastImageProps);

export default <P extends FastImageProps | ImageProps>(
  ImageComponent: React.ComponentType<P>,
) => {
  return observer(
    class extends BaseComponent<Props> {
      private size: ImageSize | undefined;

      constructor(props: Props) {
        super(props);
        const { height, width } = this.props;
        const loadImageTask =
          height !== undefined && width !== undefined
            ? Promise.resolve({ height, width } as ImageSize)
            : loadImage(props.source);

        loadImageTask
          .then((size: ImageSize) => {
            this.size = size;
            this.finishLoad();
          })
          .catch(() => {
            this.finishLoad();
          });
      }
      store = observable({
        width: 0,
        hasloaded: false,
      });

      overrodeProps = computed(() => {
        if (this.store.hasloaded && this.size) {
          let height;
          let width = this.store.width;
          const style: any = this.props?.style || {};
          if (typeof style.width === 'undefined') {
            style.width = '100%';
          } else if (typeof style.width === 'number') {
            width = style.width;
          }
          const scaling = width / this.size.width;
          height = this.size.height * scaling;
          return merge({}, this.props, {
            style: { height, width: style.width },
          });
        }
        return this.props;
      });

      finishLoad() {
        runInAction(() => {
          this.store.hasloaded = true;
        });
      }

      onLayout = (event: LayoutChangeEvent) => {
        if (event.nativeEvent.layout.width !== this.store.width) {
          runInAction(() => {
            this.store.width = event.nativeEvent.layout.width;
          });
        }
      };

      render(): React.ReactNode {
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          height,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          width,
          style,
          ...rest
        } = this.overrodeProps.get();
        if (this.store.hasloaded) {
          return (
            <View onLayout={this.onLayout}>
              <ImageComponent {...(rest as any)} style={style} />
            </View>
          );
        }
        return <></>;
      }
    },
  );
};
