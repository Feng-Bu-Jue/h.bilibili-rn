/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { Svg, GProps, Path } from 'react-native-svg';
import { getIconColor } from './helper';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

const IconMultiple: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M682.666667 85.333333C729.6 85.333333 768 123.733333 767.99999999 170.666667L768 682.666667C768 730.026667 729.6 768 682.666667 768L170.666667 767.99999999C123.306667 768 85.333333 730.026667 85.333333 682.666667L85.333333 170.666667C85.333333 123.733333 123.733333 85.333333 170.666667 85.333333L682.666667 85.333333M853.333333 341.333333L938.666667 341.333333 938.666667 853.333333C938.666667 900.266667 900.266667 938.666667 853.333333 938.666667L298.666667 938.666667 298.666667 853.333333 853.333333 853.333333 853.333333 341.333333Z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

IconMultiple.defaultProps = {
  size: 18,
};

export default React.memo ? React.memo(IconMultiple) : IconMultiple;
