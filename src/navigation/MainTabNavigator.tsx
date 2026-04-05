import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { BottomTabBar } from "../components/common/BottomTabBar";
import { DashboardScreen } from "../screens/main/DashboardScreen";
import { EditProfileScreen } from "../screens/main/EditProfileScreen";
import { HomeScreen } from "../screens/main/HomeScreen";
import { MainTabParamList } from "../types/navigation";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => (
        <BottomTabBar
          {...props}
          showCenterButton
          onCenterPress={() => props.navigation.navigate("Profile")}
        />
      )}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={EditProfileScreen} />
    </Tab.Navigator>
  );
}
