declare module 'components' {
  interface IImageInfo {
    url: string;
    width?: number;
    height?: number;
    sizeKb?: number;
    originSizeKb?: number;
    originUrl?: string;
    props?: any;
    freeHeight?: boolean;
    freeWidth?: boolean;
  }

  interface IImageSize {
    width: number;
    height: number;
    status: 'loading' | 'success' | 'fail';
  }

  interface ImageViewerProps {
    entityId: ModelEntityId;
    visible?: boolean;
    imageUrls: IImageInfo[];
    flipThreshold?: number;
    maxOverflow?: number;
    index?: number;
    failImageSource?: IImageInfo;
    backgroundColor?: string;
    footerContainerStyle?: object;
    enableImageZoom?: boolean;
    style?: ViewStyle;
    enableSwipeDown?: boolean;
    swipeDownThreshold?: number;
    doubleClickInterval?: number;
    minScale?: number;
    maxScale?: number;
    enablePreload?: boolean;
    pageAnimateTime?: number;
    onLongPress?: (image?: IImageInfo) => void;
    onClick?: (close?: () => any, currentShowIndex?: number) => void;
    onDoubleClick?: (close?: () => any) => void;
    onSave?: (url: string) => void;
    onMove?: (position?: IOnMove) => void;
    renderHeader?: (currentIndex?: number) => React.ReactElement<any>;
    renderFooter?: (currentIndex: number) => React.ReactElement<any>;
    renderImage?: (props: any) => React.ReactElement<any>;
    onShowModal?: (content?: any) => void;
    onCancel?: () => void;
    onSwipeDown?: () => void;
    loadingRender?: () => React.ReactElement<any>;
    onSaveToCamera?: (index?: number) => void;
    onChange?: (index?: number) => void;
  }

  interface ICenterOn {
    x: number;
    y: number;
    scale: number;
    duration: number;
  }

  interface IOnClick {
    locationX: number;
    locationY: number;
    pageX: number;
    pageY: number;
  }

  interface ImageZoomProps {
    cropWidth: number;
    cropHeight: number;
    imageWidth: number;
    imageHeight: number;
    panToMove?: boolean;
    pinchToZoom?: boolean;
    enableDoubleClickZoom?: boolean;
    clickDistance?: number;
    maxOverflow?: number;
    longPressTime?: number;
    doubleClickInterval?: number;
    centerOn?: ICenterOn;
    style?: ViewStyle;
    swipeDownThreshold?: number;
    enableSwipeDown?: boolean;
    enableCenterFocus?: boolean;
    minScale?: number;
    maxScale?: number;
    onClick?: (eventParams: IOnClick) => void;
    onDoubleClick?: () => void;
    onLongPress?: () => void;
    horizontalOuterRangeOffset?: (offsetX?: number) => void;
    onDragLeft?: () => void;
    responderRelease?: (vx?: number, scale?: number) => void;
    onMove?: (position?: IOnMove) => void;
    layoutChange?: (event?: object) => void;
    onSwipeDown?: () => void;
  }
}
