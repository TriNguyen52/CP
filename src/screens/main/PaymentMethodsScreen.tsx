import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../components/common/ScreenContainer";
import { colors, radius, spacing, typography } from "../../theme/tokens";

type PaymentMethod = {
  id: string;
  type: "card" | "bank";
  label: string;
  last4: string;
};

const initialMethods: PaymentMethod[] = [
  { id: "pm-1", type: "card", label: "Visa", last4: "4242" },
  { id: "pm-2", type: "card", label: "Mastercard", last4: "9911" },
  { id: "pm-3", type: "bank", label: "Bank Account", last4: "1064" },
];

export function PaymentMethodsScreen() {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);

  const onDeleteMethod = (methodId: string) => {
    Alert.alert("Delete payment method", "Remove this payment method?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setMethods((prev) => prev.filter((method) => method.id !== methodId)),
      },
    ]);
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Saved Methods</Text>

        {methods.length === 0 ? (
          <Text style={styles.emptyText}>No saved payment methods yet.</Text>
        ) : (
          methods.map((method) => (
            <View key={method.id} style={styles.methodRow}>
              <View style={styles.methodLeft}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name={method.type === "card" ? "card-outline" : "business-outline"}
                    size={18}
                    color={colors.textPrimary}
                  />
                </View>
                <View>
                  <Text style={styles.methodLabel}>{method.label}</Text>
                  <Text style={styles.methodValue}>•••• {method.last4}</Text>
                </View>
              </View>

              <Pressable onPress={() => onDeleteMethod(method.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={18} color={colors.textPrimary} />
              </Pressable>
            </View>
          ))
        )}

        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={18} color={"#000000"} />
          <Text style={styles.addButtonText}>Add New Payment Method</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: 116,
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#1F1F1F",
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 18,
  },
  emptyText: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  methodRow: {
    minHeight: 60,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "#1F1F1F",
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  methodLabel: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
  methodValue: {
    marginTop: 2,
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 13,
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  addButton: {
    marginTop: spacing.xs,
    minHeight: 48,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
    backgroundColor: "#FFFFFF",
  },
  addButtonText: {
    color: "#000000",
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
});
