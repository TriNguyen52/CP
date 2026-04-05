import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import TextRecognition from "react-native-text-recognition";
import { StackScreenProps } from "@react-navigation/stack";

import { useAppData } from "../../state/AppDataContext";
import { colors, radius, spacing, typography } from "../../theme/tokens";
import { SplitType } from "../../types/models";
import { HomeStackParamList } from "../../types/navigation";
import { parseReceiptLines, ParsedReceipt } from "../../utils/receiptParser";

type Props = StackScreenProps<HomeStackParamList, "AddExpenseScreen">;

const splitTypes: SplitType[] = ["equal", "unequal", "percentage", "shares"];
const categories = ["Groceries", "Utilities", "Entertainment", "Travel", "Other"];

export function AddExpenseScreen({ navigation, route }: Props) {
  const { groupId, prefillExpenseId } = route.params;
  const { getGroupById, addExpense, updateExpense, currentUserId } = useAppData();

  const group = getGroupById(groupId);
  const prefillExpense = group?.expenses.find((expense) => expense.id === prefillExpenseId);

  const [description, setDescription] = useState(prefillExpense?.description ?? "");
  const [amountText, setAmountText] = useState(
    prefillExpense ? prefillExpense.amount.toFixed(2) : ""
  );
  const [dateText, setDateText] = useState(
    prefillExpense?.date.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
  );
  const [paidByUserId, setPaidByUserId] = useState(
    prefillExpense?.paidByUserId ?? currentUserId
  );
  const [splitBetweenUserIds, setSplitBetweenUserIds] = useState<string[]>(
    prefillExpense?.splits.map((split) => split.userId) ?? group?.members.map((member) => member.id) ?? []
  );
  const [splitType, setSplitType] = useState<SplitType>(prefillExpense?.splitType ?? "equal");
  const [category, setCategory] = useState<string | undefined>(prefillExpense?.category);
  const [splitValues, setSplitValues] = useState<Record<string, string>>(() => {
    if (!prefillExpense || prefillExpense.splitType === "equal") {
      return {};
    }

    return Object.fromEntries(
      prefillExpense.splits.map((split) => [
        split.userId,
        String(split.value ?? split.amount),
      ])
    );
  });
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const groupMembers = group?.members ?? [];
  const selectedMembers = groupMembers.filter((member) =>
    splitBetweenUserIds.includes(member.id)
  );

  const splitValuesLabel = useMemo(() => {
    if (splitType === "unequal") {
      return "Amount";
    }

    if (splitType === "percentage") {
      return "Percent";
    }

    return "Shares";
  }, [splitType]);

  if (!group) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateTitle}>Group not found.</Text>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const toggleSplitMember = (userId: string) => {
    setSplitBetweenUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((entry) => entry !== userId);
      }

      return [...prev, userId];
    });
  };

  const onReceiptParsed = (parsed: ParsedReceipt) => {
    if (parsed.totalAmount !== undefined) {
      setAmountText(parsed.totalAmount.toFixed(2));
    }

    if (parsed.date) {
      setDateText(parsed.date);
    }

    if (parsed.merchantName && !description.trim()) {
      setDescription(parsed.merchantName);
    }

    if (parsed.lineItems.length > 0 && !description.trim()) {
      setDescription(parsed.lineItems[0]);
    }

    setScanError(null);
  };

  const validateSplitValues = (amount: number): Record<string, number> | null => {
    if (splitType === "equal") {
      return {};
    }

    const numericValues: Record<string, number> = {};

    for (const userId of splitBetweenUserIds) {
      const numeric = Number(splitValues[userId] ?? 0);
      if (Number.isNaN(numeric) || numeric < 0) {
        Alert.alert("Invalid split", "Please enter valid split values.");
        return null;
      }

      numericValues[userId] = numeric;
    }

    if (splitType === "unequal") {
      const total = Object.values(numericValues).reduce((sum, value) => sum + value, 0);
      if (Math.abs(total - amount) > 0.01) {
        Alert.alert("Unequal split mismatch", "Unequal split values must match the expense amount.");
        return null;
      }
    }

    if (splitType === "percentage") {
      const total = Object.values(numericValues).reduce((sum, value) => sum + value, 0);
      if (Math.abs(total - 100) > 0.1) {
        Alert.alert("Percentage split mismatch", "Percentages must total 100%.");
        return null;
      }
    }

    if (splitType === "shares") {
      const total = Object.values(numericValues).reduce((sum, value) => sum + value, 0);
      if (total <= 0) {
        Alert.alert("Invalid shares", "At least one member must have shares assigned.");
        return null;
      }
    }

    return numericValues;
  };

  const onSave = () => {
    const amount = Number(amountText);

    if (!description.trim()) {
      Alert.alert("Description required", "Please provide a description for this expense.");
      return;
    }

    if (Number.isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount.");
      return;
    }

    if (splitBetweenUserIds.length === 0) {
      Alert.alert("No split members", "Select at least one member to split this expense.");
      return;
    }

    const numericSplitValues = validateSplitValues(amount);
    if (numericSplitValues === null) {
      return;
    }

    if (prefillExpenseId) {
      updateExpense({
        expenseId: prefillExpenseId,
        groupId,
        description,
        amount,
        date: dateText,
        paidByUserId,
        splitBetweenUserIds,
        splitType,
        category,
        splitValues: numericSplitValues,
      });
    } else {
      addExpense({
        groupId,
        description,
        amount,
        date: dateText,
        paidByUserId,
        splitBetweenUserIds,
        splitType,
        category,
        splitValues: numericSplitValues,
      });
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.entryOptionsWrap}>
          <Pressable style={styles.entryCard}>
            <Text style={styles.entryTitle}>Enter Manually</Text>
            <Text style={styles.entryDescription}>Add details with full split controls.</Text>
          </Pressable>

          <Pressable style={styles.entryCard} onPress={() => setScanModalVisible(true)}>
            <Text style={styles.entryTitle}>Scan Receipt</Text>
            <Text style={styles.entryDescription}>Capture and auto-fill with OCR parsing.</Text>
          </Pressable>
        </View>

        {scanError ? <Text style={styles.errorText}>{scanError}</Text> : null}

        <View style={styles.formCard}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Dinner at Elm Street"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              value={amountText}
              onChangeText={setAmountText}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.textMuted}
              style={styles.amountInput}
            />
          </View>

          <Text style={styles.label}>Date</Text>
          <TextInput
            value={dateText}
            onChangeText={setDateText}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Text style={styles.label}>Paid by</Text>
          <View style={styles.chipsWrap}>
            {group.members.map((member) => (
              <Pressable
                key={member.id}
                style={[
                  styles.chip,
                  paidByUserId === member.id && styles.chipActive,
                ]}
                onPress={() => setPaidByUserId(member.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    paidByUserId === member.id && styles.chipTextActive,
                  ]}
                >
                  {member.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Split between</Text>
          <View style={styles.chipsWrap}>
            {group.members.map((member) => {
              const selected = splitBetweenUserIds.includes(member.id);
              return (
                <Pressable
                  key={member.id}
                  style={[styles.chip, selected && styles.chipActive]}
                  onPress={() => toggleSplitMember(member.id)}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                    {member.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Split type</Text>
          <View style={styles.chipsWrap}>
            {splitTypes.map((type) => {
              const selected = splitType === type;
              return (
                <Pressable
                  key={type}
                  style={[styles.chip, selected && styles.chipActive]}
                  onPress={() => setSplitType(type)}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                    {type[0].toUpperCase() + type.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {splitType !== "equal" ? (
            <View style={styles.customSplitWrap}>
              {selectedMembers.map((member) => (
                <View key={member.id} style={styles.customSplitRow}>
                  <Text style={styles.customSplitName}>{member.name}</Text>
                  <View style={styles.customSplitInputWrap}>
                    <Text style={styles.customSplitLabel}>{splitValuesLabel}</Text>
                    <TextInput
                      value={splitValues[member.id] ?? ""}
                      onChangeText={(value) =>
                        setSplitValues((prev) => ({ ...prev, [member.id]: value }))
                      }
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textMuted}
                      style={styles.customSplitInput}
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          <Text style={styles.label}>Category (optional)</Text>
          <View style={styles.chipsWrap}>
            {categories.map((item) => {
              const selected = category === item;
              return (
                <Pressable
                  key={item}
                  style={[styles.chip, selected && styles.chipActive]}
                  onPress={() => setCategory(item)}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={styles.footer}>
        <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>
            {prefillExpenseId ? "Update Expense" : "Save Expense"}
          </Text>
        </Pressable>
      </View>
      </ScrollView>

      <ReceiptScannerModal
        visible={scanModalVisible}
        onClose={() => setScanModalVisible(false)}
        onParsed={onReceiptParsed}
        onError={(message) => setScanError(message)}
      />
    </View>
  );
}

type ReceiptScannerModalProps = {
  visible: boolean;
  onClose: () => void;
  onParsed: (parsed: ParsedReceipt) => void;
  onError: (message: string) => void;
};

function ReceiptScannerModal({ visible, onClose, onParsed, onError }: ReceiptScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [processing, setProcessing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  const onCapture = async () => {
    if (!cameraRef.current) {
      return;
    }

    try {
      setProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.45 });

      if (!photo?.uri) {
        throw new Error("Could not capture receipt image.");
      }

      const lines = await TextRecognition.recognize(photo.uri);
      const parsed = parseReceiptLines(lines);
      onParsed(parsed);
      onClose();
    } catch (error) {
      onError("OCR scan failed. You can still enter details manually.");
      Alert.alert("Scan failed", "Could not parse the receipt. Please enter manually.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.scannerContainer}>
        {!permission ? (
          <View style={styles.centeredState}>
            <Text style={styles.stateTitle}>Checking camera permission...</Text>
          </View>
        ) : null}

        {permission && !permission.granted ? (
          <View style={styles.centeredState}>
            <Text style={styles.stateTitle}>Camera permission denied</Text>
            <Text style={styles.stateDescription}>
              Please allow camera access to scan receipts with OCR.
            </Text>
            <View style={styles.permissionButtonsRow}>
              <Pressable style={styles.secondaryButton} onPress={requestPermission}>
                <Text style={styles.secondaryButtonText}>Allow Camera</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={() => Linking.openSettings()}>
                <Text style={styles.secondaryButtonText}>Settings</Text>
              </Pressable>
            </View>
            <Pressable style={styles.cancelButtonInline} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Fallback to Manual Entry</Text>
            </Pressable>
          </View>
        ) : null}

        {permission?.granted ? (
          <>
            <CameraView ref={cameraRef} style={styles.cameraView} facing="back" />
            <View style={styles.scannerFooter}>
              <Pressable style={styles.cancelButtonInline} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.captureButton, processing && styles.captureButtonDisabled]}
                onPress={onCapture}
                disabled={processing}
              >
                <Ionicons name="camera" size={26} color="#000000" />
              </Pressable>
            </View>
          </>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: 120,
    marginBottom: 16,
  },
  entryOptionsWrap: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  entryCard: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.md,
    gap: spacing.xs,
    zIndex: 10,
  },
  entryTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 16,
  },
  entryDescription: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  errorText: {
    color: colors.warning,
    fontFamily: typography.regular,
    fontSize: 13,
  },
  formCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.md,
    gap: spacing.sm,
    zIndex: 10,
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
  },
  amountRow: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardStrong,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  currencySymbol: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 16,
  },
  amountInput: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 16,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  chip: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.cardStrong,
    borderColor: colors.textPrimary,
  },
  chipText: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  chipTextActive: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
  },
  customSplitWrap: {
    gap: spacing.xs,
  },
  customSplitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.3)",
    paddingBottom: spacing.xs,
  },
  customSplitName: {
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  customSplitInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  customSplitLabel: {
    color: colors.textMuted,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  customSplitInput: {
    width: 72,
    minHeight: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardStrong,
    color: colors.textPrimary,
    paddingHorizontal: spacing.xs,
    fontFamily: typography.regular,
    fontSize: 13,
  },
  footer: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
  saveButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  saveButtonText: {
    color: "#000000",
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cameraView: {
    flex: 1,
  },
  scannerFooter: {
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  captureButton: {
    width: 68,
    height: 68,
    borderRadius: radius.full,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  centeredState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  stateTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 20,
    textAlign: "center",
  },
  stateDescription: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
    textAlign: "center",
  },
  secondaryButton: {
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 13,
  },
  permissionButtonsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  cancelButtonInline: {
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
});
