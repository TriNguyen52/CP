import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { CategoryCard } from "../../components/cards/CategoryCard";
import { AppStatusBar } from "../../components/common/AppStatusBar";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { transactions } from "../../data/mockData";
import { colors, spacing, typography } from "../../theme/tokens";

export function DashboardScreen() {
  return (
    <ScreenContainer contentStyle={styles.content}>
      <AppStatusBar />
      <NavigationHeader title="Spending Analytics" />

      <Text style={styles.subtitle}>Spending Categories</Text>

      <View style={styles.grid}>
        {transactions.map((item) => (
          <View key={item.id} style={styles.gridCell}>
            <CategoryCard
              title={item.category}
              amount={item.amount}
              percentageChange={item.percentageChange}
            />
          </View>
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
  subtitle: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  gridCell: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: spacing.sm,
  },
});
