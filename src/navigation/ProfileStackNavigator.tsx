import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { AppInfoScreen } from "../screens/main/AppInfoScreen";
import { EditProfileScreen } from "../screens/main/EditProfileScreen";
import { PaymentMethodsScreen } from "../screens/main/PaymentMethodsScreen";
import { PreferencesScreen } from "../screens/main/PreferencesScreen";
import { colors, typography } from "../theme/tokens";
import { ProfileStackParamList } from "../types/navigation";

const Stack = createStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
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
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentMethodsScreen"
        component={PaymentMethodsScreen}
        options={{
          title: "Payment Methods",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="PreferencesScreen"
        component={PreferencesScreen}
        options={{
          title: "Preferences",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AppInfoScreen"
        component={AppInfoScreen}
        options={{
          title: "App Info",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
