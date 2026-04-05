import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { DashboardScreen } from "../screens/main/DashboardScreen";
import { colors, typography } from "../theme/tokens";
import { TransactionsStackParamList } from "../types/navigation";

const Stack = createStackNavigator<TransactionsStackParamList>();

export function TransactionsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: "transparent",
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontFamily: typography.semiBold,
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{
          title: "Spending Analytics",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
