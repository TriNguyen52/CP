import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { StackScreenProps } from "@react-navigation/stack";

import { useAppData } from "../../state/AppDataContext";
import { colors, radius, spacing, typography } from "../../theme/tokens";
import { HomeStackParamList } from "../../types/navigation";

type Props = StackScreenProps<HomeStackParamList, "CreateGroupScreen">;

export function CreateGroupScreen({ navigation }: Props) {
  const { contacts, createGroup } = useAppData();

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [showMembersPanel, setShowMembersPanel] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const filteredContacts = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      if (selectedMemberIds.includes(contact.id)) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      return contact.name.toLowerCase().includes(normalized);
    });
  }, [contacts, search, selectedMemberIds]);

  const selectedMembers = useMemo(
    () => contacts.filter((contact) => selectedMemberIds.includes(contact.id)),
    [contacts, selectedMemberIds]
  );

  const pickGroupImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission denied",
        "Please allow photo access to choose a group image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert("Group name required", "Please enter a group name.");
      return;
    }

    setSubmitting(true);

    const created = createGroup({
      name: groupName,
      description,
      memberIds: selectedMemberIds,
      imageUri,
    });

    setSubmitting(false);
    navigation.replace("GroupDetailsScreen", { groupId: created.id });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageWrap}>
          <Pressable style={styles.imagePicker} onPress={pickGroupImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Ionicons name="images-outline" size={30} color={colors.textSecondary} />
            )}
          </Pressable>
          <Text style={styles.imageLabel}>Group image</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Group Name *</Text>
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Weekend Trip"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What is this group for?"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.inputMultiline]}
            multiline
          />
        </View>

        <View style={styles.formCard}>
          <View style={styles.membersHeader}>
            <Text style={styles.sectionTitle}>Add Members</Text>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => setShowMembersPanel((prev) => !prev)}
            >
              <Text style={styles.secondaryButtonText}>
                {showMembersPanel ? "Hide" : "Add Members"}
              </Text>
            </Pressable>
          </View>

          {selectedMembers.length > 0 ? (
            <View style={styles.chipsWrap}>
              {selectedMembers.map((member) => (
                <View key={member.id} style={styles.memberChip}>
                  <Text style={styles.memberChipText}>{member.name}</Text>
                  <Pressable
                    onPress={() =>
                      setSelectedMemberIds((prev) => prev.filter((id) => id !== member.id))
                    }
                  >
                    <Ionicons name="close" size={14} color={colors.textPrimary} />
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.helperText}>No members added yet.</Text>
          )}

          {showMembersPanel ? (
            <View style={styles.membersPanel}>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search contacts"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />

              {filteredContacts.map((contact) => (
                <View key={contact.id} style={styles.contactRow}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Pressable
                    style={styles.addContactButton}
                    onPress={() =>
                      setSelectedMemberIds((prev) =>
                        prev.includes(contact.id) ? prev : [...prev, contact.id]
                      )
                    }
                  >
                    <Ionicons name="add" size={16} color={colors.textPrimary} />
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.primaryButton, submitting && styles.primaryButtonDisabled]}
          onPress={onCreateGroup}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>Create Group</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 120,
    gap: spacing.md,
  },
  imageWrap: {
    alignItems: "center",
    gap: spacing.xs,
  },
  imagePicker: {
    width: 104,
    height: 104,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageLabel: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 13,
  },
  formCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  label: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 13,
  },
  input: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardStrong,
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  inputMultiline: {
    minHeight: 84,
    textAlignVertical: "top",
  },
  membersHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 18,
  },
  secondaryButton: {
    minHeight: 36,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 12,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  memberChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardStrong,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  memberChipText: {
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  helperText: {
    color: colors.textMuted,
    fontFamily: typography.regular,
    fontSize: 13,
  },
  membersPanel: {
    gap: spacing.sm,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.3)",
    paddingBottom: spacing.xs,
  },
  contactName: {
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  addContactButton: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: radius.pill,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: "#000000",
    fontFamily: typography.semiBold,
    fontSize: 16,
  },
});
