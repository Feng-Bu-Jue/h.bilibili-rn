import { HomeStackScreens } from './screens';
import { StackScreenProps } from '@react-navigation/stack';

type RootParamList = DrawStackParamList;

type DrawStackParamList = {
  [HomeStackScreens.DrawDetail]: undefined;
  [HomeStackScreens.DrawList]: undefined;
};

type BaseScreenProps<RouteName extends keyof RootParamList> = StackScreenProps<
  RootParamList,
  RouteName
>;

type DrawListProps = BaseScreenProps<HomeStackScreens.DrawList>;
type DrawDetailProps = BaseScreenProps<HomeStackScreens.DrawDetail>;
