import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { MemberBalance } from "../../types/models";
import { CircularProgress } from "../charts/CircularProgress";
import { colors, radius, spacing, typography } from "../../theme/tokens";

type MemberBalanceCardProps = {
  item: MemberBalance;
};

export function MemberBalanceCard({ item }: MemberBalanceCardProps) {
  const isPositive = item.amount >= 0;
  const absoluteAmount = Math.abs(item.amount);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.name}>{item.user.name}</Text>
        <CircularProgress
          size={48}
          strokeWidth={5}
          progress={Math.min(100, Math.round((absoluteAmount / 250) * 100))}
        />
      </View>
      <Text style={[styles.amount, isPositive ? styles.positive : styles.negative]}>
        {isPositive ? "Gets" : "Owes"} ${absoluteAmount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 138,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: "rgba(31, 31, 31, 0.95)",
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    zIndex: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 14,
    marginRight: spacing.sm,
  },
  amount: {
    fontFamily: typography.regular,
    fontSize: 14,
  },
  positive: {
    color: colors.success,
  },
  negative: {
    color: colors.warning,
  },
});
