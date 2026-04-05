import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  CreateAccount: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  AddBill: undefined;
  AddPayment: undefined;
  GroupBills: undefined;
  OcrPermission: undefined;
  Recommendation: undefined;
};
