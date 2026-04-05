import React, { useLayoutEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";

import { MemberBalanceCard } from "../../components/cards/MemberBalanceCard";
import { EmptyState, LoadingState } from "../../components/common/StateViews";
import { useAppData } from "../../state/AppDataContext";
import { colors, radius, spacing, typography } from "../../theme/tokens";
import { SettlementMethod, SuggestedTransaction } from "../../types/models";
import { HomeStackParamList } from "../../types/navigation";

type Props = StackScreenProps<HomeStackParamList, "GroupDetailsScreen">;

type DetailsTab = "expenses" | "balances" | "settle";
type ExpenseFilter = "all" | "paidByMe" | "included";

const settlementMethods: SettlementMethod[] = ["Cash", "Bank Transfer", "Venmo", "Other"];

export function GroupDetailsScreen({ navigation, route }: Props) {
  const { groupId } = route.params;
  const {
    currentUserId,
    loadingGroups,
    getGroupById,
    calculateGroupBalances,
    getSuggestedTransactions,
    deleteExpense,
    refreshGroups,
    recordSettlement,
  } = useAppData();

  const group = getGroupById(groupId);

  const [activeTab, setActiveTab] = useState<DetailsTab>("expenses");
  const [expenseFilter, setExpenseFilter] = useState<ExpenseFilter>("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<SuggestedTransaction | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<SettlementMethod>("Cash");
  const [savingSettlement, setSavingSettlement] = useState(false);

  useLayoutEffect(() => {
    if (!group) {
      return;
    }

    navigation.setOptions({
      title: group.name,
      headerRight: () => (
        <Pressable
          style={styles.headerAddButton}
          onPress={() => navigation.navigate("AddExpenseScreen", { groupId: group.id })}
        >
          <Ionicons name="add" size={22} color="#000000" />
        </Pressable>
      ),
    });
  }, [group, navigation]);

  if (!group) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateTitle}>Group unavailable</Text>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const balances = calculateGroupBalances(group.id);
  const suggestedTransactions = getSuggestedTransactions(group.id);

  const userNetBalance = balances.find((entry) => entry.userId === currentUserId)?.netAmount ?? 0;
  const totalSpending = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const userContribution = group.expenses
    .filter((expense) => expense.paidByUserId === currentUserId)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const visibleExpenses = useMemo(() => {
    const sorted = [...group.expenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (expenseFilter === "all") {
      return sorted;
    }

    if (expenseFilter === "paidByMe") {
      return sorted.filter((expense) => expense.paidByUserId === currentUserId);
    }

    return sorted.filter((expense) =>
      expense.splits.some((split) => split.userId === currentUserId)
    );
  }, [currentUserId, expenseFilter, group.expenses]);

  const allSettled = balances.every((entry) => Math.abs(entry.netAmount) < 0.01);

  const getUserName = (userId: string): string =>
    group.members.find((member) => member.id === userId)?.name ?? "Unknown";

  const onDeleteExpense = (expenseId: string) => {
    Alert.alert("Expense actions", "Choose an action", [
      {
        text: "Edit",
        onPress: () =>
          navigation.navigate("AddExpenseScreen", {
            groupId: group.id,
            prefillExpenseId: expenseId,
          }),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteExpense(group.id, expenseId),
      },
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  };

  const onSubmitSettlement = async (status: "confirmed" | "requested") => {
    if (!selectedTransaction) {
      return;
    }

    try {
      setSavingSettlement(true);
      await recordSettlement({
        groupId: group.id,
        fromUserId: selectedTransaction.from,
        toUserId: selectedTransaction.to,
        amount: selectedTransaction.amount,
        method: selectedMethod,
        status,
      });
    } finally {
      setSavingSettlement(false);
      setSelectedTransaction(null);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refreshGroups} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Your Net Balance</Text>
          <Text style={[styles.summaryAmount, userNetBalance >= 0 ? styles.success : styles.warning]}>
            {userNetBalance >= 0 ? "+" : "-"}${Math.abs(userNetBalance).toFixed(2)}
          </Text>

          <View style={styles.summaryDetailsRow}>
            <View>
              <Text style={styles.summaryMiniLabel}>Total Group Spending</Text>
              <Text style={styles.summaryMiniValue}>${totalSpending.toFixed(2)}</Text>
            </View>
            <View>
              <Text style={styles.summaryMiniLabel}>Your Contribution</Text>
              <Text style={styles.summaryMiniValue}>${userContribution.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabRow}>
          {[
            { key: "expenses", label: "Expenses" },
            { key: "balances", label: "Balances" },
            { key: "settle", label: "Settle Up" },
          ].map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tabButton, selected && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab.key as DetailsTab)}
              >
                <Text style={[styles.tabButtonText, selected && styles.tabButtonTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {loadingGroups ? <LoadingState label="Refreshing group data..." /> : null}

        {activeTab === "expenses" ? (
          <View style={styles.sectionWrap}>
            <View style={styles.filterRow}>
              {[
                { key: "all", label: "All" },
                { key: "paidByMe", label: "Paid by me" },
                { key: "included", label: "I'm included" },
              ].map((item) => {
                const selected = expenseFilter === item.key;
                return (
                  <Pressable
                    key={item.key}
                    style={[styles.filterChip, selected && styles.filterChipActive]}
                    onPress={() => setExpenseFilter(item.key as ExpenseFilter)}
                  >
                    <Text style={[styles.filterChipText, selected && styles.filterChipTextActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {visibleExpenses.length === 0 ? (
              <EmptyState
                icon="receipt-outline"
                title="No Expenses Yet"
                description="Add your first expense to start tracking group activity."
              />
            ) : (
              <View style={styles.expensesList}>
                {visibleExpenses.map((expense) => (
                  <Pressable
                    key={expense.id}
                    style={styles.expenseCard}
                    onPress={() => onDeleteExpense(expense.id)}
                  >
                    <View style={styles.expenseCardTop}>
                      <Text style={styles.expenseTitle}>{expense.description}</Text>
                      <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.expenseMeta}>
                      Paid by {getUserName(expense.paidByUserId)}
                    </Text>
                    <Text style={styles.expenseMeta}>{expense.date.slice(0, 10)}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ) : null}

        {activeTab === "balances" ? (
          <View style={styles.sectionWrap}>
            {allSettled ? (
              <EmptyState
                icon="checkmark-done-outline"
                title="All Settled Up!"
                description="No one owes anything right now. Nice work."
              />
            ) : (
              <View style={styles.balanceGrid}>
                {balances.map((entry) => {
                  const member = group.members.find((user) => user.id === entry.userId);
                  if (!member) {
                    return null;
                  }

                  return (
                    <View key={entry.userId} style={styles.balanceGridCell}>
                      <MemberBalanceCard item={{ user: member, amount: entry.netAmount }} />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        ) : null}

        {activeTab === "settle" ? (
          <View style={styles.sectionWrap}>
            {suggestedTransactions.length === 0 ? (
              <EmptyState
                icon="sparkles-outline"
                title="No Suggested Transactions"
                description="Everything is balanced or already settled."
              />
            ) : (
              <View style={styles.settlementList}>
                {suggestedTransactions.map((transaction, index) => (
                  <Pressable
                    key={`${transaction.from}-${transaction.to}-${index}`}
                    style={styles.settlementCard}
                    onPress={() => setSelectedTransaction(transaction)}
                  >
                    <Text style={styles.settlementText}>
                      {getUserName(transaction.from)} pays {getUserName(transaction.to)}
                    </Text>
                    <Text style={styles.settlementAmount}>${transaction.amount.toFixed(2)}</Text>
                    <Pressable
                      style={styles.markSettledButton}
                      onPress={() => setSelectedTransaction(transaction)}
                    >
                      <Text style={styles.markSettledButtonText}>Mark as Settled</Text>
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            )}

            <View style={styles.historyWrap}>
              <Text style={styles.historyTitle}>Payment History</Text>
              {group.settlements.length === 0 ? (
                <Text style={styles.historyEmpty}>No settlements recorded yet.</Text>
              ) : (
                group.settlements.map((settlement) => (
                  <View key={settlement.id} style={styles.historyRow}>
                    <Text style={styles.historyText}>
                      {getUserName(settlement.fromUserId)} → {getUserName(settlement.toUserId)}
                    </Text>
                    <Text style={styles.historyAmount}>${settlement.amount.toFixed(2)}</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        ) : null}
      </ScrollView>

      {selectedTransaction ? (
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Record Settlement</Text>
            <Text style={styles.modalText}>
              {getUserName(selectedTransaction.from)} pays {getUserName(selectedTransaction.to)}
            </Text>
            <Text style={styles.modalAmount}>${selectedTransaction.amount.toFixed(2)}</Text>

            <Text style={styles.modalSubtitle}>Payment Method</Text>
            <View style={styles.methodRow}>
              {settlementMethods.map((method) => {
                const selected = method === selectedMethod;
                return (
                  <Pressable
                    key={method}
                    style={[styles.methodChip, selected && styles.methodChipActive]}
                    onPress={() => setSelectedMethod(method)}
                  >
                    <Text style={[styles.methodChipText, selected && styles.methodChipTextActive]}>
                      {method}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.modalPrimaryButton}
              onPress={() => onSubmitSettlement("confirmed")}
              disabled={savingSettlement}
            >
              <Text style={styles.modalPrimaryButtonText}>Confirm Payment</Text>
            </Pressable>

            <Pressable
              style={styles.modalSecondaryButton}
              onPress={() => onSubmitSettlement("requested")}
              disabled={savingSettlement}
            >
              <Text style={styles.modalSecondaryButtonText}>Send Request</Text>
            </Pressable>

            <Pressable
              style={styles.modalCancelButton}
              onPress={() => setSelectedTransaction(null)}
              disabled={savingSettlement}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: 144,
    marginBottom: 16,
  },
  summaryCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardStrong,
    padding: spacing.md,
    gap: spacing.sm,
    zIndex: 10,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 13,
  },
  summaryAmount: {
    fontFamily: typography.semiBold,
    fontSize: 34,
  },
  success: {
    color: colors.success,
  },
  warning: {
    color: colors.warning,
  },
  headerAddButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    marginRight: 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  summaryDetailsRow: {
    marginTop: spacing.xs,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryMiniLabel: {
    color: colors.textMuted,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  summaryMiniValue: {
    marginTop: 2,
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
  tabRow: {
    flexDirection: "row",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    minHeight: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: colors.cardStrong,
  },
  tabButtonText: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  tabButtonTextActive: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
  },
  sectionWrap: {
    gap: spacing.sm,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  filterChip: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipActive: {
    backgroundColor: colors.cardStrong,
    borderColor: colors.textPrimary,
  },
  filterChipText: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  filterChipTextActive: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
  },
  expensesList: {
    gap: spacing.sm,
  },
  expenseCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.md,
    gap: 4,
    zIndex: 10,
  },
  expenseCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expenseTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 15,
    flex: 1,
    marginRight: spacing.sm,
  },
  expenseAmount: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 16,
  },
  expenseMeta: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  balanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  balanceGridCell: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: spacing.sm,
  },
  settlementList: {
    gap: spacing.sm,
  },
  settlementCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "#1F1F1F",
    padding: spacing.md,
    gap: spacing.xs,
    zIndex: 10,
  },
  settlementText: {
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  settlementAmount: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 20,
  },
  markSettledButton: {
    alignSelf: "flex-start",
    minHeight: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  markSettledButtonText: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 12,
  },
  historyWrap: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "#1F1F1F",
    padding: spacing.md,
    gap: spacing.xs,
    zIndex: 10,
  },
  historyTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 16,
  },
  historyEmpty: {
    color: colors.textMuted,
    fontFamily: typography.regular,
    fontSize: 13,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.3)",
    paddingBottom: 6,
  },
  historyText: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  historyAmount: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 12,
  },
  fab: {
    position: "absolute",
    right: spacing.md,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  centeredState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  stateTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 20,
  },
  secondaryButton: {
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 13,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    zIndex: 200,
  },
  modalCard: {
    width: "100%",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "#1F1F1F",
    padding: spacing.md,
    gap: spacing.sm,
    zIndex: 201,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 20,
  },
  modalText: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  modalAmount: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 30,
  },
  modalSubtitle: {
    color: colors.textMuted,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  methodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  methodChip: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  methodChipActive: {
    backgroundColor: colors.card,
    borderColor: colors.textPrimary,
  },
  methodChipText: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  methodChipTextActive: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
  },
  modalPrimaryButton: {
    minHeight: 50,
    borderRadius: radius.pill,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalPrimaryButtonText: {
    color: "#000000",
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
  modalSecondaryButton: {
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSecondaryButtonText: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
  modalCancelButton: {
    minHeight: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelButtonText: {
    color: colors.textMuted,
    fontFamily: typography.regular,
    fontSize: 13,
  },
});
