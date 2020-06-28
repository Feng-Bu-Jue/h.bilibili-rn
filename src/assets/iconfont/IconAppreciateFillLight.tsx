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

const IconAppreciateFillLight: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M859.733333 426.666667h-183.466666c14.933333-40.533333 34.133333-117.333333 23.466666-200.533334-4.266667-55.466667-38.4-98.133333-85.333333-113.066666-34.133333-10.666667-70.4-6.4-89.6 12.8-23.466667 23.466667-34.133333 70.4-46.933333 121.6-8.533333 36.266667-17.066667 72.533333-29.866667 91.733333-34.133333 59.733333-123.733333 83.2-134.4 87.466667H256c-12.8 0-21.333333 8.533333-21.333333 21.333333v448c0 12.8 8.533333 21.333333 21.333333 21.333333h68.266667c2.133333 0 6.4 0 8.533333-2.133333h394.666667c202.666667 0 213.333333-398.933333 213.333333-403.2-2.133333-46.933333-44.8-85.333333-81.066667-85.333333zM170.666667 424.533333H106.666667c-12.8 0-21.333333 8.533333-21.333334 21.333334v448c0 12.8 8.533333 21.333333 21.333334 21.333333h64c12.8 0 21.333333-8.533333 21.333333-21.333333v-448c0-10.666667-10.666667-21.333333-21.333333-21.333334z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

IconAppreciateFillLight.defaultProps = {
  size: 18,
};

export default React.memo ? React.memo(IconAppreciateFillLight) : IconAppreciateFillLight;
