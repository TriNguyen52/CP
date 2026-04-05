import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing, typography } from "../../theme/tokens";

export type AppNotification = {
  id: string;
  kind: "expense" | "payment" | "settlement";
  text: string;
  timestamp: string;
  createdAt: string;
};

type NotificationBannerProps = {
  notifications: AppNotification[];
};

const dotColorByKind: Record<AppNotification["kind"], string> = {
  expense: "#3B82F6",
  payment: "#22C55E",
  settlement: "#F59E0B",
};

export function NotificationBanner({ notifications }: NotificationBannerProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const visibleNotifications = useMemo(() => {
    return [...notifications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .filter((item) => !dismissedIds.includes(item.id))
      .slice(0, 3);
  }, [dismissedIds, notifications]);

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {visibleNotifications.map((notification) => (
          <View key={notification.id} style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.textWrap}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: dotColorByKind[notification.kind] },
                  ]}
                />
                <Text style={styles.messageText}>{notification.text}</Text>
              </View>

              <Pressable
                style={styles.dismissButton}
                onPress={() =>
                  setDismissedIds((prev) => (prev.includes(notification.id) ? prev : [...prev, notification.id]))
                }
              >
                <Ionicons name="close" size={14} color={colors.textSecondary} />
              </Pressable>
            </View>

            <Text style={styles.timestampText}>{notification.timestamp}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    paddingRight: spacing.xs,
    gap: spacing.xs,
  },
  card: {
    width: 288,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1F1F1F",
    padding: 12,
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  textWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  messageText: {
    flex: 1,
    color: "rgba(255,255,255,0.9)",
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  timestampText: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: typography.regular,
    fontSize: 12,
    marginLeft: 20,
  },
  dismissButton: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});