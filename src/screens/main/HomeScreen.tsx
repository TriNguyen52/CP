import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { billGroups } from "../../data/mockData";
import { GroupBillItem } from "../../components/cards/GroupBillItem";
import { AppStatusBar } from "../../components/common/AppStatusBar";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { colors, spacing, typography } from "../../theme/tokens";
import { RootStackParamList } from "../../types/navigation";

export function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <ScreenContainer contentStyle={styles.content}>
      <AppStatusBar />
      <NavigationHeader title="Transaction Minimizer" />

      <Pressable
        style={styles.sectionHeader}
        onPress={() => navigation.navigate("GroupBills")}
      >
        <Text style={styles.sectionTitle}>Group Bills</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </Pressable>

      <View>
        {billGroups.map((group) => (
          <GroupBillItem
            key={group.id}
            item={group}
            onPress={() => navigation.navigate("GroupBills")}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: 120,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 22,
  },
});
