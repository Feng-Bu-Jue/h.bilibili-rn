import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { animations } from '~/assets/animations';

type OutputProps<B, P> = B & P;
type BaseProps = {
  loading: boolean; //pretending
  position?: 'center' | 'start' | 'end'; //todo
};

export const LoadingHOC = function <P extends object>(
  ViewComponet: React.ComponentType<P>,
): React.ComponentType<OutputProps<BaseProps, P>> {
  return (class extends React.PureComponent<BaseProps> {
    render() {
      const { children, loading, ...rest } = this.props;
      return (
        <ViewComponet {...(rest as any)}>
          {children}
          {loading && (
            <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
              <LottieView source={animations.loading} autoPlay loop />
            </View>
          )}
        </ViewComponet>
      );
    }
  } as unknown) as React.ComponentType<OutputProps<BaseProps, P>>; // so dirty
};

export default LoadingHOC(View);

const styles = StyleSheet.create({
  loadingContainer: { justifyContent: 'center', alignContent: 'center' },
});
