import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../components/common/ScreenContainer";
import { colors, radius, spacing, typography } from "../../theme/tokens";

export function AppInfoScreen() {
  const openUrl = async (url: string) => {
    await Linking.openURL(url);
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>App Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>

        <Pressable style={styles.linkRow} onPress={() => openUrl("https://example.com/terms")}> 
          <Text style={styles.linkText}>Terms of Service</Text>
          <Ionicons name="open-outline" size={16} color={colors.textPrimary} />
        </Pressable>

        <Pressable style={styles.linkRow} onPress={() => openUrl("https://example.com/privacy")}> 
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Ionicons name="open-outline" size={16} color={colors.textPrimary} />
        </Pressable>

        <Pressable style={styles.supportButton} onPress={() => openUrl("mailto:support@transaction.app")}> 
          <Text style={styles.supportButtonText}>Contact Support</Text>
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
  infoRow: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "#1F1F1F",
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoLabel: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  infoValue: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
  linkRow: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "#1F1F1F",
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkText: {
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  supportButton: {
    marginTop: spacing.xs,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  supportButtonText: {
    color: "#000000",
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
});
