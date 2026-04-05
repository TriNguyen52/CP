import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { AddExpenseScreen } from "../screens/main/AddExpenseScreen";
import { CreateGroupScreen } from "../screens/main/CreateGroupScreen";
import { GroupDetailsScreen } from "../screens/main/GroupDetailsScreen";
import { HomeScreen } from "../screens/main/HomeScreen";
import { NotificationsScreen } from "../screens/main/NotificationsScreen";
import { colors, typography } from "../theme/tokens";
import { HomeStackParamList } from "../types/navigation";

const Stack = createStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
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
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="GroupDetailsScreen"
        component={GroupDetailsScreen}
        options={{ title: "Group Details" }}
      />
      <Stack.Screen
        name="CreateGroupScreen"
        component={CreateGroupScreen}
        options={{ title: "Create Group" }}
      />
      <Stack.Screen
        name="AddExpenseScreen"
        component={AddExpenseScreen}
        options={{
          title: "Add Expense",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{
          title: "Notifications",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
