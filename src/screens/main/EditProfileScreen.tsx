import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { AppStatusBar } from "../../components/common/AppStatusBar";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { SecondaryButton } from "../../components/common/Buttons";
import { colors, radius, spacing, typography } from "../../theme/tokens";

export function EditProfileScreen() {
  return (
    <ScreenContainer contentStyle={styles.content}>
      <AppStatusBar />
      <NavigationHeader title="Transaction Minimizer" />

      <View style={styles.card}>
        <Text style={styles.name}>Edit Profile</Text>
        <Text style={styles.description}>
          Update your details, payment preferences, and notifications for your group bills.
        </Text>
      </View>

      <SecondaryButton label="Manage Payment Methods" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: 130,
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  name: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 22,
  },
  description: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});
