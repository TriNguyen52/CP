import React, { useMemo, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { appNotifications } from "../../data/mockData";
import { colors, radius, spacing, typography } from "../../theme/tokens";

type NotificationItem = (typeof appNotifications)[number];

const dotColorByKind: Record<NotificationItem["kind"], string> = {
  expense: "#3B82F6",
  payment: "#22C55E",
  settlement: "#F59E0B",
};

export function NotificationsScreen() {
  const [items, setItems] = useState<NotificationItem[]>(appNotifications);

  const sortedItems = useMemo(
    () =>
      [...items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [items]
  );

  const markAllAsRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const deleteNotification = (notificationId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== notificationId));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
      <View style={styles.topRow}>
        <Pressable style={styles.markAllButton} onPress={markAllAsRead}>
          <Text style={styles.markAllButtonText}>Mark All as Read</Text>
        </Pressable>
      </View>

      <FlatList
        data={sortedItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={styles.mainRow}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: dotColorByKind[item.kind] },
                  ]}
                />
                <View style={styles.textWrap}>
                  <Text style={styles.messageText}>{item.text}</Text>
                  <Text style={styles.timeText}>{item.timestamp}</Text>
                </View>
              </View>

              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteNotification(item.id)}
              >
                <Ionicons name="close" size={14} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No notifications yet.</Text>
          </View>
        }
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 110,
  },
  topRow: {
    marginBottom: spacing.sm,
    alignItems: "flex-end",
  },
  markAllButton: {
    minHeight: 36,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "#1F1F1F",
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  markAllButtonText: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 12,
  },
  listContent: {
    paddingBottom: spacing.md,
  },
  card: {
    backgroundColor: "#1F1F1F",
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
    flex: 1,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginTop: 6,
  },
  textWrap: {
    flex: 1,
  },
  messageText: {
    color: "#FFFFFF",
    fontFamily: typography.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  timeText: {
    marginTop: 4,
    color: "rgba(255,255,255,0.6)",
    fontFamily: typography.regular,
    fontSize: 12,
  },
  deleteButton: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyWrap: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "#1F1F1F",
    padding: spacing.md,
    alignItems: "center",
  },
  emptyText: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
});
