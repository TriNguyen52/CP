import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  CreateAccount: undefined;
  Onboarding: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  GroupDetailsScreen: { groupId: string };
  AddExpenseScreen: { groupId: string; prefillExpenseId?: string };
  CreateGroupScreen: undefined;
};

export type TransactionsStackParamList = {
  DashboardScreen: undefined;
};

export type ProfileStackParamList = {
  EditProfileScreen: undefined;
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Transactions: NavigatorScreenParams<TransactionsStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};
