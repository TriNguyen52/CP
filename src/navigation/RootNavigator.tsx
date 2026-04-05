import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { AppDataProvider } from "../state/AppDataContext";
import { MainTabNavigator } from "./MainTabNavigator";

export function RootNavigator() {
  return (
    <AppDataProvider>
      <NavigationContainer>
        <MainTabNavigator />
      </NavigationContainer>
    </AppDataProvider>
  );
}
