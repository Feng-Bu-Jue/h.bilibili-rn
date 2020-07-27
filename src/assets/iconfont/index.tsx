/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';
import IconArrowUp from './IconArrowUp';
import IconNan from './IconNan';
import IconNv from './IconNv';
import IconBbi from './IconBbi';
import IconLock from './IconLock';
import IconPeople from './IconPeople';
import IconShoucang from './IconShoucang';
import IconShoucang1 from './IconShoucang1';
import IconXiaoxi from './IconXiaoxi';
import IconXihuan from './IconXihuan';
import IconXihuan1 from './IconXihuan1';
import IconLishixiao from './IconLishixiao';
import IconRefresh from './IconRefresh';
import IconCross from './IconCross';
import IconTick from './IconTick';
import IconDownload from './IconDownload';
import IconSousuo from './IconSousuo';
import IconShuaxin from './IconShuaxin';
import IconAndroidgengduo from './IconAndroidgengduo';
import IconCnBilibiliB from './IconCnBilibiliB';
import IconBilibili from './IconBilibili';
import IconCheck from './IconCheck';
import IconClose from './IconClose';
import IconLikefill from './IconLikefill';
import IconLike from './IconLike';
import IconBack from './IconBack';
import IconDown from './IconDown';
import IconRankfill from './IconRankfill';
import IconPicfill from './IconPicfill';
import IconPeoplefill from './IconPeoplefill';
import IconRecordfill from './IconRecordfill';
import IconAppreciateLight from './IconAppreciateLight';
import IconAppreciateFillLight from './IconAppreciateFillLight';

export type IconNames = 'arrow-up' | 'nan' | 'nv' | 'Bbi' | 'lock' | 'people' | 'shoucang' | 'shoucang1' | 'xiaoxi' | 'xihuan' | 'xihuan1' | 'lishixiao' | 'refresh' | 'cross' | 'tick' | 'download' | 'sousuo' | 'shuaxin' | 'androidgengduo' | 'CN_bilibiliB' | 'bilibili' | 'check' | 'close' | 'likefill' | 'like' | 'back' | 'down' | 'rankfill' | 'picfill' | 'peoplefill' | 'recordfill' | 'appreciate_light' | 'appreciate_fill_light';

interface Props extends GProps, ViewProps {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

const IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'arrow-up':
      return <IconArrowUp key="1" {...rest} />;
    case 'nan':
      return <IconNan key="2" {...rest} />;
    case 'nv':
      return <IconNv key="3" {...rest} />;
    case 'Bbi':
      return <IconBbi key="4" {...rest} />;
    case 'lock':
      return <IconLock key="5" {...rest} />;
    case 'people':
      return <IconPeople key="6" {...rest} />;
    case 'shoucang':
      return <IconShoucang key="7" {...rest} />;
    case 'shoucang1':
      return <IconShoucang1 key="8" {...rest} />;
    case 'xiaoxi':
      return <IconXiaoxi key="9" {...rest} />;
    case 'xihuan':
      return <IconXihuan key="10" {...rest} />;
    case 'xihuan1':
      return <IconXihuan1 key="11" {...rest} />;
    case 'lishixiao':
      return <IconLishixiao key="12" {...rest} />;
    case 'refresh':
      return <IconRefresh key="13" {...rest} />;
    case 'cross':
      return <IconCross key="14" {...rest} />;
    case 'tick':
      return <IconTick key="15" {...rest} />;
    case 'download':
      return <IconDownload key="16" {...rest} />;
    case 'sousuo':
      return <IconSousuo key="17" {...rest} />;
    case 'shuaxin':
      return <IconShuaxin key="18" {...rest} />;
    case 'androidgengduo':
      return <IconAndroidgengduo key="19" {...rest} />;
    case 'CN_bilibiliB':
      return <IconCnBilibiliB key="20" {...rest} />;
    case 'bilibili':
      return <IconBilibili key="21" {...rest} />;
    case 'check':
      return <IconCheck key="22" {...rest} />;
    case 'close':
      return <IconClose key="23" {...rest} />;
    case 'likefill':
      return <IconLikefill key="24" {...rest} />;
    case 'like':
      return <IconLike key="25" {...rest} />;
    case 'back':
      return <IconBack key="26" {...rest} />;
    case 'down':
      return <IconDown key="27" {...rest} />;
    case 'rankfill':
      return <IconRankfill key="28" {...rest} />;
    case 'picfill':
      return <IconPicfill key="29" {...rest} />;
    case 'peoplefill':
      return <IconPeoplefill key="30" {...rest} />;
    case 'recordfill':
      return <IconRecordfill key="31" {...rest} />;
    case 'appreciate_light':
      return <IconAppreciateLight key="32" {...rest} />;
    case 'appreciate_fill_light':
      return <IconAppreciateFillLight key="33" {...rest} />;
  }

  return null;
};

export default React.memo ? React.memo(IconFont) : IconFont;
