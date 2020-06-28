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

const IconDown: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M792.832 485.856c-12.512-12.544-32.8-12.48-45.248-0.032L544 688.992 544 128c0-17.664-14.336-32-32-32s-32 14.336-32 32l0 563.04-234.048-235.456c-12.48-12.576-32.704-12.64-45.248-0.128-12.544 12.448-12.608 32.704-0.128 45.248l287.52 289.248c3.168 3.2 6.88 5.536 10.816 7.136C502.912 798.88 507.296 800 512 800c11.296 0 20.704-6.176 26.4-14.976l254.368-253.952C805.312 518.624 805.312 498.368 792.832 485.856z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <Path
        d="M864 928 160 928c-17.664 0-32-14.304-32-32s14.336-32 32-32l704 0c17.696 0 32 14.304 32 32S881.696 928 864 928z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </Svg>
  );
};

IconDown.defaultProps = {
  size: 18,
};

export default React.memo ? React.memo(IconDown) : IconDown;
