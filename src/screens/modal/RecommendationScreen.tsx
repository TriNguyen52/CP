import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { AppStatusBar } from "../../components/common/AppStatusBar";
import { LineChartLarge } from "../../components/charts/LineChartLarge";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { NotificationBellButton } from "../../components/common/NotificationBellButton";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { appNotifications, recommendations } from "../../data/mockData";
import { colors, radius, spacing, typography } from "../../theme/tokens";

const tabs = ["1M", "3M", "1Y"];

export function RecommendationScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [activeTab, setActiveTab] = useState("3M");
  const hasUnreadNotifications = appNotifications.some((item) => item.unread);

  return (
    <ScreenContainer contentStyle={styles.content}>
      <AppStatusBar />
      <NavigationHeader
        title="Recommendations"
        rightAction={
          <NotificationBellButton
            hasUnread={hasUnreadNotifications}
            onPress={() => navigation.navigate("NotificationsScreen")}
          />
        }
      />

      <View style={styles.tabWrap}>
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.chartCard}>
        <LineChartLarge />
      </View>

      <Text style={styles.sectionTitle}>Financial Health Recommendations</Text>

      {recommendations.map((item) => (
        <View key={item.title} style={styles.recoCard}>
          <Text style={styles.recoTitle}>{item.title}</Text>
          <Text style={styles.recoAmount}>${item.amount}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${item.percentage}%` }]} />
          </View>
        </View>
      ))}

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total Optimization</Text>
        <Text style={styles.summaryValue}>$3800 (+5%)</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Projected Savings</Text>
        <Text style={styles.summaryValue}>$600 (+10%)</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  tabWrap: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
  },
  tab: {
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  tabActive: {
    backgroundColor: colors.cardStrong,
  },
  tabText: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 13,
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
  },
  chartCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 18,
  },
  recoCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  recoTitle: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  recoAmount: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 24,
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.textPrimary,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingBottom: spacing.sm,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
});
