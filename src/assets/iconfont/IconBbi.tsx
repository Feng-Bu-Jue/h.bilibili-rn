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

const IconBbi: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 64c246.4 0 448 198.4 448 448 0 246.4-201.6 448-448 448-249.6 0-448-201.6-448-448C64 262.4 262.4 64 512 64z m28.8 300.8v70.4h172.8v230.4h-57.6v-176h-115.2V896c198.4-16 355.2-182.4 355.2-384 0-214.4-172.8-384-384-384C297.6 128 128 297.6 128 512c0 201.6 156.8 368 355.2 384V492.8h-115.2v176H310.4v-233.6h172.8v-67.2l-169.6 16-3.2-28.8-3.2-28.8 403.2-35.2 3.2 28.8 3.2 28.8-176 16z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

IconBbi.defaultProps = {
  size: 18,
};

export default React.memo ? React.memo(IconBbi) : IconBbi;
