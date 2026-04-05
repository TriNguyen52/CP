import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { LineChartMini } from "../charts/LineChartMini";
import { colors, radius, spacing, typography } from "../../theme/tokens";

type CategoryCardProps = {
  title: string;
  amount: number;
  percentageChange: number;
};

export function CategoryCard({ title, amount, percentageChange }: CategoryCardProps) {
  const positive = percentageChange >= 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>${amount.toLocaleString()}</Text>
      <LineChartMini />
      <Text style={[styles.percentage, positive ? styles.positive : styles.negative]}>
        {positive ? "+" : ""}
        {percentageChange}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 168,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    zIndex: 10,
  },
  title: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  amount: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 22,
  },
  percentage: {
    fontFamily: typography.semiBold,
    fontSize: 12,
  },
  positive: {
    color: colors.success,
  },
  negative: {
    color: colors.warning,
  },
});
