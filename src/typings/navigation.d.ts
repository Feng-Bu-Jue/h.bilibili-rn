import { StackScreens } from './screens';
import { StackScreenProps } from '@react-navigation/stack';

type RootParamList = DrawStackParamList;

type DrawStackParamList = {
  [StackScreens.DrawList]: undefined;
  [StackScreens.DrawDetail]: {
    docId: number;
  };
};

type BaseScreenProps<RouteName extends keyof RootParamList> = StackScreenProps<
  RootParamList,
  RouteName
>;

type DrawListProps = BaseScreenProps<HomeStackScreens.DrawList>;
type DrawDetailProps = BaseScreenProps<HomeStackScreens.DrawDetail>;
