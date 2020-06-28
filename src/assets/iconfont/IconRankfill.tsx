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

const IconRankfill: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M288 288 160 288c-17.664 0-32 14.336-32 32l0 544c0 17.696 14.336 32 32 32l128 0c17.664 0 32-14.304 32-32L320 320C320 302.336 305.664 288 288 288z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <Path
        d="M576 480l-128 0c-17.664 0-32 14.336-32 32l0 352c0 17.696 14.336 32 32 32l128 0c17.696 0 32-14.304 32-32L608 512C608 494.336 593.696 480 576 480z"
        fill={getIconColor(color, 1, '#333333')}
      />
      <Path
        d="M864 128l-128 0c-17.696 0-32 14.336-32 32l0 704c0 17.696 14.304 32 32 32l128 0c17.696 0 32-14.304 32-32L896 160C896 142.336 881.696 128 864 128z"
        fill={getIconColor(color, 2, '#333333')}
      />
    </Svg>
  );
};

IconRankfill.defaultProps = {
  size: 18,
};

export default React.memo ? React.memo(IconRankfill) : IconRankfill;
