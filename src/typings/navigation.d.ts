import { StackScreens } from './screens';
import { StackScreenProps } from '@react-navigation/stack';

type RootParamList = DrawStackParamList & AccountStackParamList;

type DrawStackParamList = {
  [StackScreens.DrawList]: undefined;
  [StackScreens.DrawDetail]: {
    docId: number;
  };
};

type AccountStackParamList = {
  [StackScreens.Login]: undefined;
  [StackScreens.Me]: undefined;
};

type BaseScreenProps<RouteName extends keyof RootParamList> = StackScreenProps<
  RootParamList,
  RouteName
>;

type DrawListProps = BaseScreenProps<StackScreens.DrawList>;
type DrawDetailProps = BaseScreenProps<StackScreens.DrawDetail>;
type LoginProps = BaseScreenProps<StackScreens.Login>;
type MeProps = BaseScreenProps<StackScreens.Me>;
