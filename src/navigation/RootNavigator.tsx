import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AddBillScreen } from "../screens/modal/AddBillScreen";
import { AddPaymentMethodScreen } from "../screens/modal/AddPaymentMethodScreen";
import { GroupBillsScreen } from "../screens/modal/GroupBillsScreen";
import { OcrPermissionScreen } from "../screens/modal/OcrPermissionScreen";
import { RecommendationScreen } from "../screens/modal/RecommendationScreen";
import { RootStackParamList } from "../types/navigation";
import { AuthNavigator } from "./AuthNavigator";
import { MainTabNavigator } from "./MainTabNavigator";

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen
          name="AddBill"
          component={AddBillScreen}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="AddPayment"
          component={AddPaymentMethodScreen}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="GroupBills"
          component={GroupBillsScreen}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="OcrPermission"
          component={OcrPermissionScreen}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="Recommendation"
          component={RecommendationScreen}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
