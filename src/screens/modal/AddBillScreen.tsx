import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { AppStatusBar } from "../../components/common/AppStatusBar";
import { FeatureCard } from "../../components/cards/FeatureCard";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { useAppData } from "../../state/AppDataContext";
import { colors, spacing, typography } from "../../theme/tokens";

const options = [
  {
    title: "Create New Group",
    description:
      "Set up a new shared expense space, add friends instantly, and organize all upcoming bills in one place.",
    icon: "add-circle-outline",
  },
  {
    title: "Join Existing",
    description:
      "Use an invite code to join an active group, sync your balances, and start tracking shared costs right away.",
    icon: "people-outline",
  },
  {
    title: "Quick Split",
    description:
      "Capture one-off expenses fast by splitting a receipt in just a few taps with automatic per-person totals.",
    icon: "flash-outline",
  },
  {
    title: "Recurring Bills",
    description:
      "Create reusable templates for rent, utilities, and subscriptions so repeating charges are added consistently.",
    icon: "repeat-outline",
  },
] as const;

export function AddBillScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { groups } = useAppData();

  const onScanBill = () => {
    const fallbackGroupId = groups[0]?.id;
    if (!fallbackGroupId) {
      Alert.alert("No group available", "Create a group before scanning a bill.");
      return;
    }

    (navigation as unknown as { navigate: (screen: string, params?: object) => void }).navigate(
      "AddExpenseScreen",
      { groupId: fallbackGroupId, autoOpenScanner: true }
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={8}
    >
      <SafeAreaView style={styles.safeArea}>
        <AppStatusBar />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalBackdrop}>
            <NavigationHeader title="Create a New Bill Group" />
            <View style={styles.modalContent}>
              <Text style={styles.subtitle}>Join an Existing Bill Group</Text>
              <Pressable style={styles.scanBillButton} onPress={onScanBill}>
                <Ionicons name="scan" size={18} color="#000000" />
                <Text style={styles.scanBillButtonText}>Scan Bill</Text>
              </Pressable>
              <Text style={styles.sectionTitle}>Available Features</Text>

              <View style={styles.grid}>
                {options.map((option) => (
                  <View key={option.title} style={styles.gridCell}>
                    <FeatureCard
                      title={option.title}
                      description={option.description}
                      icon={option.icon}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <View style={styles.fixedActionsWrap}>
        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          <Pressable style={[styles.actionButton, styles.saveButton]}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
  },
  modalBackdrop: {
    zIndex: 200,
  },
  modalContent: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.md,
    zIndex: 201,
    marginBottom: 16,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 20,
    marginBottom: spacing.md,
  },
  scanBillButton: {
    alignSelf: "flex-start",
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  scanBillButtonText: {
    color: "#000000",
    fontFamily: typography.semiBold,
    fontSize: 13,
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
  fixedActionsWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000000",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButton: {
    backgroundColor: "#2D2D2D",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  saveButton: {
    backgroundColor: "#FFFFFF",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
  saveButtonText: {
    color: "#000000",
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
});
