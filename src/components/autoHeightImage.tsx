import { observer } from 'mobx-react';
import React from 'react';
import {
  ImageProps,
  Image,
  View,
  LayoutChangeEvent,
  ImageURISource,
} from 'react-native';
import { observable, runInAction, when } from 'mobx';
import BaseComponent from './baseComponent';

type Size = { height: number; width: number };
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

const loadImage = function (source: any): Promise<Size> {
  return new Promise<Size>((resolve, reject) => {
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

type OutputProps<P> = BaseProps & P;
type BaseProps = {
  width?: number;
  imageSize?: Size;
  onImageLayout?: (size: Size) => void;
};

const AutoHeightImageHOC = function <P extends object>(
  ImageComponent: React.ComponentType<P>,
): React.ComponentType<OutputProps<P>> {
  return (observer(
    class extends BaseComponent<BaseProps & ImageProps> {
      constructor(props: BaseProps & ImageProps) {
        super(props);
        const { imageSize, width } = this.props;
        if (width) {
          this.store.containerWidth = width;
        }
        const loadImageTask = imageSize
          ? Promise.resolve(imageSize)
          : loadImage(props.source);

        loadImageTask.then((size: Size) => {
          runInAction(() => {
            this.store.imageSize = size;
          });
        });

        this.$reactionDisposers.push(
          when(
            () => !!this.store.imageSize && !!this.store.containerWidth,
            () => {
              if (this.store.imageSize) {
                const scaling =
                  this.store.containerWidth / this.store.imageSize.width;
                const layoutSize = {
                  width: this.store.containerWidth,
                  height: scaling * this.store.imageSize.height,
                };
                this.store.layoutSize = layoutSize;
                if (this.props.onImageLayout) {
                  this.props.onImageLayout(layoutSize);
                }
              }
            },
          ),
        );
      }

      store = observable({
        containerWidth: 0,
        imageSize: undefined as Size | undefined,
        layoutSize: undefined as Size | undefined,
      });

      onLayout = ({
        nativeEvent: {
          layout: { width },
        },
      }: LayoutChangeEvent) => {
        if (!this.store.containerWidth) {
          runInAction(() => {
            this.store.containerWidth = width;
          });
        }
      };

      render(): React.ReactNode {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { style, height, width, ...rest } = this.props;

        return (
          <View onLayout={this.onLayout}>
            {this.store.layoutSize && (
              <View
                style={{
                  height: this.store.layoutSize.height,
                  width: this.store.layoutSize.width,
                }}>
                <ImageComponent
                  {...(rest as any)}
                  style={[
                    style,
                    {
                      height: this.store.layoutSize.height,
                      width: this.store.layoutSize.width,
                    },
                  ]}
                />
              </View>
            )}
          </View>
        );
      }
    },
  ) as unknown) as React.ComponentType<OutputProps<P>>; //TODO:Find out a generic difinition to...
};

export default AutoHeightImageHOC;
