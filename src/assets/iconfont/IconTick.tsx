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

const IconTick: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 896C299.936 896 128 724.064 128 512S299.936 128 512 128s384 171.936 384 384-171.936 384-384 384m0-832C264.96 64 64 264.96 64 512s200.96 448 448 448 448-200.96 448-448S759.04 64 512 64"
        fill={getIconColor(color, 0, '#181818')}
      />
      <Path
        d="M432 618.752l-121.376-121.376-45.248 45.248 166.624 166.624 326.624-326.624-45.248-45.248z"
        fill={getIconColor(color, 1, '#181818')}
      />
    </Svg>
  );
};

IconTick.defaultProps = {
  size: 18,
};

export default React.memo ? React.memo(IconTick) : IconTick;
