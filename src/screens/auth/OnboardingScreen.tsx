import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import { AppStatusBar } from "../../components/common/AppStatusBar";
import { PrimaryButton, SecondaryButton } from "../../components/common/Buttons";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { AuthStackParamList } from "../../types/navigation";
import { colors, radius, spacing, typography } from "../../theme/tokens";

type Props = StackScreenProps<AuthStackParamList, "Onboarding">;

export function OnboardingScreen({ navigation }: Props) {
  return (
    <ScreenContainer contentStyle={styles.content}>
      <AppStatusBar />
      <View style={styles.heroCircle} />
      <Text style={styles.title}>Minimal</Text>
      <Text style={styles.subtitle}>Smart splitting starts here</Text>
      <Text style={styles.description}>Track bills, reduce payments, and settle in fewer steps.</Text>

      <View style={styles.actions}>
        <PrimaryButton
          label="Continue to App"
          onPress={() => navigation.getParent()?.navigate("Main" as never)}
        />
        <SecondaryButton
          label="Back"
          onPress={() => navigation.navigate("CreateAccount")}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    paddingTop: spacing.sm,
  },
  heroCircle: {
    width: 300,
    height: 300,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginTop: spacing.xl,
  },
  title: {
    marginTop: spacing.xl,
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 40,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 20,
  },
  description: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontFamily: typography.regular,
    fontSize: 14,
    textAlign: "center",
    maxWidth: 280,
  },
  actions: {
    width: "100%",
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
});
