import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { AppStatusBar } from "../../components/common/AppStatusBar";
import { MemberBalanceCard } from "../../components/cards/MemberBalanceCard";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { memberBalances } from "../../data/mockData";
import { colors, radius, spacing, typography } from "../../theme/tokens";

export function GroupBillsScreen() {
  return (
    <ScreenContainer contentStyle={styles.content}>
      <AppStatusBar />
      <NavigationHeader title="Group Bills" />

      <Text style={styles.sectionTitle}>Group Member Balances</Text>

      <View style={styles.grid}>
        {memberBalances.map((item) => (
          <View key={item.user.id} style={styles.gridCell}>
            <MemberBalanceCard item={item} />
          </View>
        ))}
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.row}>
          <Text style={styles.label}>Total Debt</Text>
          <Text style={styles.value}>$240</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Suggested Transactions</Text>
          <Text style={styles.value}>Jordan pays Alex $80</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Suggested Transactions</Text>
          <Text style={styles.value}>Sam pays Alex $50</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 18,
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
  summaryCard: {
    marginTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    gap: 4,
  },
  label: {
    color: colors.textMuted,
    fontFamily: typography.regular,
    fontSize: 13,
  },
  value: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
});
