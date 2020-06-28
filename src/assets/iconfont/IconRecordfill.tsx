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

const IconRecordfill: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M943.488 260c-10.176-5.632-22.592-5.312-32.48 0.864L800 330.368 800 288c0-52.928-43.072-96-96-96L160 192C107.072 192 64 235.072 64 288l0 448c0 52.928 43.072 96 96 96l544 0c52.928 0 96-43.072 96-96l0-38.88 111.648 66.368C916.672 766.496 922.336 768 928 768c5.472 0 10.912-1.408 15.808-4.192C953.824 758.112 960 747.488 960 736L960 288C960 276.352 953.696 265.632 943.488 260zM256 448c-35.296 0-64-28.704-64-64s28.704-64 64-64 64 28.704 64 64S291.296 448 256 448z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

IconRecordfill.defaultProps = {
  size: 18,
};

export default React.memo ? React.memo(IconRecordfill) : IconRecordfill;
