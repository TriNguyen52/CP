import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { BillGroup } from "../../types/models";
import { colors, radius, spacing, typography } from "../../theme/tokens";

type GroupBillItemProps = {
  item: BillGroup;
  onPress?: () => void;
};

export function GroupBillItem({ item, onPress }: GroupBillItemProps) {
  const initials = item.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.leftRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Ionicons name="checkmark-circle" size={16} color={colors.textPrimary} />
          </View>
          <Text style={styles.description}>{item.description}</Text>
          {item.yourTurn ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Your Turn</Text>
            </View>
          ) : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.cardStrong,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 22,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 16,
  },
  description: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 13,
  },
  badge: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardStrong,
  },
  badgeText: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 11,
  },
});
