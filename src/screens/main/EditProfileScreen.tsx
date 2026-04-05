import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { NavigationHeader } from "../../components/common/NavigationHeader";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { colors, radius, spacing, typography } from "../../theme/tokens";
import { ProfileStackParamList } from "../../types/navigation";

const profileSections = [
  {
    key: "payment",
    label: "Payment Methods",
    icon: "card-outline" as const,
    route: "PaymentMethodsScreen" as const,
  },
  {
    key: "preferences",
    label: "Preferences",
    icon: "settings-outline" as const,
    route: "PreferencesScreen" as const,
  },
  {
    key: "app-info",
    label: "App Info",
    icon: "information-circle-outline" as const,
    route: "AppInfoScreen" as const,
  },
];

export function EditProfileScreen() {
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();

  return (
    <ScreenContainer contentStyle={styles.content}>
      <NavigationHeader title="Transaction Minimizer" />

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AK</Text>
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Name</Text>
          <Text style={styles.fieldValue}>Alex Kim</Text>
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>alex.kim@transaction.app</Text>
        </View>

        <Pressable style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
      </View>

      <View style={styles.sectionsWrap}>
        {profileSections.map((section) => (
          <Pressable
            key={section.key}
            style={styles.sectionCard}
            onPress={() => navigation.navigate(section.route)}
          >
            <View style={styles.sectionLeft}>
              <Ionicons name={section.icon} size={18} color={colors.textPrimary} />
              <Text style={styles.sectionText}>{section.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </Pressable>

      <View style={styles.footerSpacer}>
        <Text style={styles.description}>
          Update your details, payment preferences, and notifications for your group bills.
        </Text>
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
  profileCard: {
    borderRadius: radius.lg,
    backgroundColor: "#1F1F1F",
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    zIndex: 10,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardStrong,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: spacing.xs,
  },
  avatarText: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 28,
  },
  fieldWrap: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardStrong,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 52,
    justifyContent: "center",
  },
  fieldLabel: {
    color: colors.textMuted,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  fieldValue: {
    color: colors.textPrimary,
    marginTop: 2,
    fontFamily: typography.regular,
    fontSize: 15,
  },
  saveButton: {
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xs,
  },
  saveButtonText: {
    color: "#000000",
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
  sectionsWrap: {
    gap: spacing.sm,
  },
  sectionCard: {
    minHeight: 56,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#1F1F1F",
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sectionText: {
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 15,
  },
  logoutButton: {
    minHeight: 48,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E74C3C",
    marginTop: spacing.xs,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
  footerSpacer: {
    marginBottom: 16,
  },
  description: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});
