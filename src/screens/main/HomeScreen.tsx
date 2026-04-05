import React from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { GroupBillItem } from "../../components/cards/GroupBillItem";
import { NotificationBellButton } from "../../components/common/NotificationBellButton";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { EmptyState, ErrorState, SkeletonList } from "../../components/common/StateViews";
import { appNotifications } from "../../data/mockData";
import { useAppData } from "../../state/AppDataContext";
import { colors, radius, spacing, typography } from "../../theme/tokens";
import { HomeStackParamList } from "../../types/navigation";

export function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const anyNavigation = useNavigation<NavigationProp<ParamListBase>>();
  const { groups, loadingGroups, groupsError, refreshGroups } = useAppData();
  const hasUnreadNotifications = appNotifications.some((item) => item.unread);

  const contentHeader = (
    <View>
      <NavigationHeader
        title="Transaction Minimizer"
        rightAction={
          <NotificationBellButton
            hasUnread={hasUnreadNotifications}
            onPress={() => anyNavigation.navigate("NotificationsScreen")}
          />
        }
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Group Bills</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.container}>
        {loadingGroups ? (
          <View style={styles.contentWrap}>
            {contentHeader}
            <SkeletonList count={4} cardHeight={92} />
          </View>
        ) : null}

        {!loadingGroups && groupsError ? (
          <View style={styles.contentWrap}>
            {contentHeader}
            <ErrorState
              title="Network error"
              message="We could not load your groups. Check your connection and try again."
              onRetry={refreshGroups}
            />
          </View>
        ) : null}

        {!loadingGroups && !groupsError ? (
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={false} onRefresh={refreshGroups} />}
            ListHeaderComponent={contentHeader}
            ListFooterComponent={<View style={styles.listFooter} />}
            renderItem={({ item }) => (
              <GroupBillItem
                item={item}
                onPress={() => navigation.navigate("GroupDetailsScreen", { groupId: item.id })}
              />
            )}
            ListEmptyComponent={
              <EmptyState
                icon="people-outline"
                title="No Groups Yet"
                description="Create your first group to start splitting expenses with friends."
                actionLabel="Create Group"
                onActionPress={() => navigation.navigate("CreateGroupScreen")}
              />
            }
          />
        ) : null}

        <Pressable
          style={styles.fab}
          onPress={() => navigation.navigate("CreateGroupScreen")}
        >
          <Ionicons name="add" size={28} color="#000000" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  contentWrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 132,
  },
  listFooter: {
    height: 16,
  },
  sectionHeader: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 22,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
});
