import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { CreateAccountScreen } from "../screens/auth/CreateAccountScreen";
import { OnboardingScreen } from "../screens/auth/OnboardingScreen";
import { AuthStackParamList } from "../types/navigation";

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}
