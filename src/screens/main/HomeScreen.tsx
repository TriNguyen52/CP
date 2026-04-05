import React from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { GroupBillItem } from "../../components/cards/GroupBillItem";
import { AppStatusBar } from "../../components/common/AppStatusBar";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { EmptyState, ErrorState, SkeletonList } from "../../components/common/StateViews";
import { useAppData } from "../../state/AppDataContext";
import { colors, radius, spacing, typography } from "../../theme/tokens";
import { HomeStackParamList } from "../../types/navigation";

export function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const { groups, loadingGroups, groupsError, refreshGroups } = useAppData();

  const contentHeader = (
    <View>
      <AppStatusBar />
      <NavigationHeader title="Transaction Minimizer" />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Group Bills</Text>
      </View>
    </View>
  );

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    right: spacing.md,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
});
