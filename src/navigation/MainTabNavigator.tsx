import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { BottomTabBar } from "../components/common/BottomTabBar";
import { HomeStackNavigator } from "./HomeStackNavigator";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import { TransactionsStackNavigator } from "./TransactionsStackNavigator";
import { MainTabParamList } from "../types/navigation";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Transactions" component={TransactionsStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}
