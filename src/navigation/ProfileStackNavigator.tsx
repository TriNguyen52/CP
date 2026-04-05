import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { EditProfileScreen } from "../screens/main/EditProfileScreen";
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
    </Stack.Navigator>
  );
}
