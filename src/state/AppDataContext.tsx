import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { billGroups, users } from "../data/mockData";
import {
  Expense,
  ExpenseSplit,
  Group,
  MemberNetBalance,
  SettlementMethod,
  SettlementRecord,
  SettlementStatus,
  SplitType,
  SuggestedTransaction,
  User,
} from "../types/models";
import { minimizeTransactions } from "../utils/transactionMinimizer";

type AddExpenseInput = {
  groupId: string;
  description: string;
  amount: number;
  date: string;
  paidByUserId: string;
  splitBetweenUserIds: string[];
  splitType: SplitType;
  category?: string;
  merchantName?: string;
  lineItems?: string[];
  splitValues?: Record<string, number>;
};

type UpdateExpenseInput = AddExpenseInput & {
  expenseId: string;
};

type CreateGroupInput = {
  name: string;
  description?: string;
  memberIds: string[];
  imageUri?: string;
};

type RecordSettlementInput = {
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  method: SettlementMethod;
  status: SettlementStatus;
};

type AppDataContextValue = {
  currentUserId: string;
  contacts: User[];
  groups: Group[];
  loadingGroups: boolean;
  groupsError: string | null;
  refreshGroups: () => Promise<void>;
  getGroupById: (groupId: string) => Group | undefined;
  createGroup: (input: CreateGroupInput) => Group;
  addExpense: (input: AddExpenseInput) => Expense;
  updateExpense: (input: UpdateExpenseInput) => Expense;
  deleteExpense: (groupId: string, expenseId: string) => void;
  calculateGroupBalances: (groupId: string) => MemberNetBalance[];
  getSuggestedTransactions: (groupId: string) => SuggestedTransaction[];
  recordSettlement: (input: RecordSettlementInput) => Promise<SettlementRecord>;
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

const CURRENT_USER_ID = users[0].id;

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

const toExpenseSplit = (
  splitType: SplitType,
  amount: number,
  splitBetweenUserIds: string[],
  splitValues: Record<string, number> = {}
): ExpenseSplit[] => {
  if (splitBetweenUserIds.length === 0) {
    return [];
  }

  if (splitType === "equal") {
    const equalShare = roundToCents(amount / splitBetweenUserIds.length);
    return splitBetweenUserIds.map((userId, index) => {
      if (index === splitBetweenUserIds.length - 1) {
        const allocated = roundToCents(equalShare * (splitBetweenUserIds.length - 1));
        return { userId, amount: roundToCents(amount - allocated) };
      }

      return { userId, amount: equalShare };
    });
  }

  if (splitType === "unequal") {
    return splitBetweenUserIds.map((userId) => ({
      userId,
      amount: roundToCents(splitValues[userId] ?? 0),
    }));
  }

  if (splitType === "percentage") {
    return splitBetweenUserIds.map((userId, index) => {
      const percentage = splitValues[userId] ?? 0;
      if (index === splitBetweenUserIds.length - 1) {
        const allocated = splitBetweenUserIds
          .slice(0, splitBetweenUserIds.length - 1)
          .reduce((sum, memberId) => sum + roundToCents((amount * (splitValues[memberId] ?? 0)) / 100), 0);
        return {
          userId,
          value: percentage,
          amount: roundToCents(amount - allocated),
        };
      }

      return {
        userId,
        value: percentage,
        amount: roundToCents((amount * percentage) / 100),
      };
    });
  }

  const totalShares = splitBetweenUserIds.reduce((sum, userId) => sum + (splitValues[userId] ?? 0), 0);

  if (totalShares <= 0) {
    const equalShare = roundToCents(amount / splitBetweenUserIds.length);
    return splitBetweenUserIds.map((userId) => ({ userId, amount: equalShare, value: 1 }));
  }

  return splitBetweenUserIds.map((userId, index) => {
    const shares = splitValues[userId] ?? 0;

    if (index === splitBetweenUserIds.length - 1) {
      const allocated = splitBetweenUserIds
        .slice(0, splitBetweenUserIds.length - 1)
        .reduce((sum, memberId) => sum + roundToCents((amount * (splitValues[memberId] ?? 0)) / totalShares), 0);

      return {
        userId,
        value: shares,
        amount: roundToCents(amount - allocated),
      };
    }

    return {
      userId,
      value: shares,
      amount: roundToCents((amount * shares) / totalShares),
    };
  });
};

const initialGroups: Group[] = billGroups.map((group, index) => {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - (index + 1));

  const initialExpense: Expense = {
    id: `exp-seed-${group.id}`,
    groupId: group.id,
    description: "Shared groceries",
    amount: Math.max(40, Math.round(group.totalAmount * 0.15)),
    date: baseDate.toISOString(),
    paidByUserId: group.members[0]?.id ?? CURRENT_USER_ID,
    splitType: "equal",
    category: "Groceries",
    splits: toExpenseSplit(
      "equal",
      Math.max(40, Math.round(group.totalAmount * 0.15)),
      group.members.map((member) => member.id)
    ),
  };

  return {
    ...group,
    createdAt: baseDate.toISOString(),
    imageUri: undefined,
    expenses: [initialExpense],
    settlements: [],
  };
});

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [groupsError, setGroupsError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      await wait(450);
      setLoadingGroups(false);
    };

    initialize();
  }, []);

  const refreshGroups = useCallback(async () => {
    setGroupsError(null);
    await wait(500);
  }, []);

  const getGroupById = useCallback(
    (groupId: string): Group | undefined => groups.find((group) => group.id === groupId),
    [groups]
  );

  const createGroup = useCallback((input: CreateGroupInput): Group => {
    const uniqueMemberIds = Array.from(new Set([CURRENT_USER_ID, ...input.memberIds]));
    const members = users.filter((user) => uniqueMemberIds.includes(user.id));

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: input.name.trim(),
      description: input.description?.trim() || "",
      members,
      yourTurn: false,
      totalAmount: 0,
      createdAt: new Date().toISOString(),
      imageUri: input.imageUri,
      expenses: [],
      settlements: [],
    };

    setGroups((prev) => [newGroup, ...prev]);
    return newGroup;
  }, []);

  const addExpense = useCallback((input: AddExpenseInput): Expense => {
    const amount = roundToCents(input.amount);

    const expense: Expense = {
      id: `exp-${Date.now()}`,
      groupId: input.groupId,
      description: input.description.trim(),
      amount,
      date: input.date,
      paidByUserId: input.paidByUserId,
      splitType: input.splitType,
      category: input.category,
      merchantName: input.merchantName,
      lineItems: input.lineItems,
      splits: toExpenseSplit(input.splitType, amount, input.splitBetweenUserIds, input.splitValues),
    };

    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== input.groupId) {
          return group;
        }

        return {
          ...group,
          totalAmount: roundToCents(group.totalAmount + amount),
          expenses: [expense, ...group.expenses],
        };
      })
    );

    return expense;
  }, []);

  const updateExpense = useCallback((input: UpdateExpenseInput): Expense => {
    const amount = roundToCents(input.amount);

    const updatedExpense: Expense = {
      id: input.expenseId,
      groupId: input.groupId,
      description: input.description.trim(),
      amount,
      date: input.date,
      paidByUserId: input.paidByUserId,
      splitType: input.splitType,
      category: input.category,
      merchantName: input.merchantName,
      lineItems: input.lineItems,
      splits: toExpenseSplit(input.splitType, amount, input.splitBetweenUserIds, input.splitValues),
    };

    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== input.groupId) {
          return group;
        }

        const nextExpenses = group.expenses.map((expense) =>
          expense.id === input.expenseId ? updatedExpense : expense
        );

        const updatedTotal = nextExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        return {
          ...group,
          totalAmount: roundToCents(updatedTotal),
          expenses: nextExpenses,
        };
      })
    );

    return updatedExpense;
  }, []);

  const deleteExpense = useCallback((groupId: string, expenseId: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) {
          return group;
        }

        const remainingExpenses = group.expenses.filter((expense) => expense.id !== expenseId);
        const updatedTotal = remainingExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        return {
          ...group,
          expenses: remainingExpenses,
          totalAmount: roundToCents(updatedTotal),
        };
      })
    );
  }, []);

  const calculateGroupBalances = useCallback(
    (groupId: string): MemberNetBalance[] => {
      const group = groups.find((entry) => entry.id === groupId);
      if (!group) {
        return [];
      }

      const balanceMap = new Map<string, number>();
      group.members.forEach((member) => balanceMap.set(member.id, 0));

      group.expenses.forEach((expense) => {
        const currentPaidBy = balanceMap.get(expense.paidByUserId) ?? 0;
        balanceMap.set(expense.paidByUserId, roundToCents(currentPaidBy + expense.amount));

        expense.splits.forEach((split) => {
          const current = balanceMap.get(split.userId) ?? 0;
          balanceMap.set(split.userId, roundToCents(current - split.amount));
        });
      });

      group.settlements
        .filter((settlement) => settlement.status === "confirmed")
        .forEach((settlement) => {
          const fromValue = balanceMap.get(settlement.fromUserId) ?? 0;
          const toValue = balanceMap.get(settlement.toUserId) ?? 0;

          balanceMap.set(settlement.fromUserId, roundToCents(fromValue + settlement.amount));
          balanceMap.set(settlement.toUserId, roundToCents(toValue - settlement.amount));
        });

      return Array.from(balanceMap.entries()).map(([userId, netAmount]) => ({
        userId,
        netAmount: roundToCents(netAmount),
      }));
    },
    [groups]
  );

  const getSuggestedTransactions = useCallback(
    (groupId: string): SuggestedTransaction[] => minimizeTransactions(calculateGroupBalances(groupId)),
    [calculateGroupBalances]
  );

  const recordSettlement = useCallback(async (input: RecordSettlementInput): Promise<SettlementRecord> => {
    const settlement: SettlementRecord = {
      id: `settlement-${Date.now()}`,
      groupId: input.groupId,
      fromUserId: input.fromUserId,
      toUserId: input.toUserId,
      amount: roundToCents(input.amount),
      method: input.method,
      status: input.status,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update for smooth UX.
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== input.groupId) {
          return group;
        }

        return {
          ...group,
          settlements: [settlement, ...group.settlements],
        };
      })
    );

    await wait(300);
    return settlement;
  }, []);

  const value = useMemo<AppDataContextValue>(
    () => ({
      currentUserId: CURRENT_USER_ID,
      contacts: users.filter((user) => user.id !== CURRENT_USER_ID),
      groups,
      loadingGroups,
      groupsError,
      refreshGroups,
      getGroupById,
      createGroup,
      addExpense,
      updateExpense,
      deleteExpense,
      calculateGroupBalances,
      getSuggestedTransactions,
      recordSettlement,
    }),
    [
      groups,
      loadingGroups,
      groupsError,
      refreshGroups,
      getGroupById,
      createGroup,
      addExpense,
      updateExpense,
      deleteExpense,
      calculateGroupBalances,
      getSuggestedTransactions,
      recordSettlement,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }

  return context;
}
