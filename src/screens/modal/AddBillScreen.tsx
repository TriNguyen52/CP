import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { AppStatusBar } from "../../components/common/AppStatusBar";
import { FeatureCard } from "../../components/cards/FeatureCard";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { colors, spacing, typography } from "../../theme/tokens";

const options = [
  {
    title: "Create New Group",
    description: "Start a fresh bill group and invite members.",
    icon: "add-circle-outline",
  },
  {
    title: "Join Existing",
    description: "Enter a code to join an existing bill group.",
    icon: "people-outline",
  },
  {
    title: "Quick Split",
    description: "Split one receipt in a few taps.",
    icon: "flash-outline",
  },
  {
    title: "Recurring Bills",
    description: "Set up monthly recurring bill templates.",
    icon: "repeat-outline",
  },
] as const;

export function AddBillScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return (
    <ScreenContainer contentStyle={styles.content}>
      <AppStatusBar />
      <View style={styles.modalBackdrop}>
        <NavigationHeader title="Create a New Bill Group" />
        <View style={styles.modalContent}>
          <Text style={styles.subtitle}>Join an Existing Bill Group</Text>
          <Text style={styles.sectionTitle}>Bill Group Options</Text>

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
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
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
  actionsRow: {
    marginTop: spacing.xs,
    flexDirection: "row",
    gap: spacing.sm,
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
