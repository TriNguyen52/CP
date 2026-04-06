import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import * as ExpoImagePicker from "expo-image-picker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { StackScreenProps } from "@react-navigation/stack";

import { useAppData } from "../../state/AppDataContext";
import {
  GroqReceiptScanResult,
  scanReceiptWithGroq,
} from "../../services/groqReceiptScanner";
import { colors, radius, spacing, typography } from "../../theme/tokens";
import { SplitType } from "../../types/models";
import { HomeStackParamList } from "../../types/navigation";

type Props = StackScreenProps<HomeStackParamList, "AddExpenseScreen">;

const splitTypes: SplitType[] = ["equal", "unequal", "percentage", "shares"];
const categories = ["Groceries", "Utilities", "Entertainment", "Travel", "Other"];
const SCAN_FAILURE_MESSAGE = "Failed to scan receipt";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return SCAN_FAILURE_MESSAGE;
};

export function AddExpenseScreen({ navigation, route }: Props) {
  const { groupId, prefillExpenseId, autoOpenScanner } = route.params;
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
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanSummary, setScanSummary] = useState<GroqReceiptScanResult | null>(null);

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

  useEffect(() => {
    if (autoOpenScanner) {
      // Open camera automatically when launched from AddBill scan action.
      onScanFromCamera();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenScanner]);

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

  const onReceiptParsed = (parsed: GroqReceiptScanResult) => {
    if (parsed.amount !== undefined) {
      setAmountText(parsed.amount.toFixed(2));
    }

    if (parsed.date) {
      const parsedDate = new Date(parsed.date);
      setDateText(
        Number.isNaN(parsedDate.getTime())
          ? parsed.date
          : parsedDate.toISOString().slice(0, 10)
      );
    }

    if (parsed.merchant) {
      setDescription(parsed.merchant);
    }

    setScanSummary(parsed);
    setScanError(null);
  };

  const showPermissionAlert = (
    title: string,
    message: string,
    canAskAgain: boolean
  ) => {
    if (!canAskAgain) {
      Alert.alert(title, message, [
        {
          text: "Open settings",
          onPress: () => {
            Linking.openSettings();
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
      return;
    }

    Alert.alert(title, message);
  };

  const ensureCameraPermission = async () => {
    const current = await ExpoImagePicker.getCameraPermissionsAsync();
    if (current.granted) {
      return true;
    }

    const request = await ExpoImagePicker.requestCameraPermissionsAsync();
    if (request.granted) {
      return true;
    }

    showPermissionAlert(
      "Camera permission needed",
      "Allow camera access to scan your receipt.",
      request.canAskAgain
    );
    return false;
  };

  const ensureGalleryPermission = async () => {
    const current = await ExpoImagePicker.getMediaLibraryPermissionsAsync();
    if (current.granted) {
      return true;
    }

    const request = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (request.granted) {
      return true;
    }

    showPermissionAlert(
      "Photo access needed",
      "Allow photo library access to import receipt images.",
      request.canAskAgain
    );
    return false;
  };

  const launchExpoCameraFallback = async () => {
    const result = await ExpoImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.8,
      allowsEditing: false,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets?.[0]?.base64;
  };

  const launchExpoGalleryFallback = async () => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.8,
      allowsEditing: false,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets?.[0]?.base64;
  };

  const showFailureToast = () => {
    if (Platform.OS === "android") {
      ToastAndroid.show(SCAN_FAILURE_MESSAGE, ToastAndroid.SHORT);
      return;
    }

    Alert.alert("Scan failed", SCAN_FAILURE_MESSAGE);
  };

  const processScannedImage = async (imageBase64?: string) => {
    if (!imageBase64) {
      setScanError("No image data found. Please retake the receipt photo.");
      showFailureToast();
      return;
    }

    try {
      setScanLoading(true);
      const parsed = await scanReceiptWithGroq(imageBase64);
      onReceiptParsed(parsed);
    } catch (error) {
      setScanError(getErrorMessage(error));
      showFailureToast();
    } finally {
      setScanLoading(false);
    }
  };

  const onScanFromCamera = async () => {
    setScanError(null);

    const hasPermission = await ensureCameraPermission();
    if (!hasPermission) {
      return;
    }

    try {
      const result = await launchCamera({
        mediaType: "photo",
        includeBase64: true,
        quality: 0.8,
        saveToPhotos: false,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode || result.errorMessage) {
        if (result.errorMessage) {
          setScanError(result.errorMessage);
        }

        const fallbackBase64 = await launchExpoCameraFallback();
        if (!fallbackBase64) {
          return;
        }
        await processScannedImage(fallbackBase64);
        return;
      }

      const asset = result.assets?.[0];
      if (asset?.base64) {
        await processScannedImage(asset.base64);
        return;
      }

      const fallbackBase64 = await launchExpoCameraFallback();
      if (!fallbackBase64) {
        return;
      }
      await processScannedImage(fallbackBase64);
    } catch {
      setScanError("Could not open camera from native picker. Using Expo fallback.");
      const fallbackBase64 = await launchExpoCameraFallback();
      if (!fallbackBase64) {
        return;
      }
      await processScannedImage(fallbackBase64);
    }
  };

  const onScanFromGallery = async () => {
    setScanError(null);

    const hasPermission = await ensureGalleryPermission();
    if (!hasPermission) {
      return;
    }

    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: true,
        quality: 0.8,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode || result.errorMessage) {
        if (result.errorMessage) {
          setScanError(result.errorMessage);
        }

        const fallbackBase64 = await launchExpoGalleryFallback();
        if (!fallbackBase64) {
          return;
        }
        await processScannedImage(fallbackBase64);
        return;
      }

      const asset = result.assets?.[0];
      if (asset?.base64) {
        await processScannedImage(asset.base64);
        return;
      }

      const fallbackBase64 = await launchExpoGalleryFallback();
      if (!fallbackBase64) {
        return;
      }
      await processScannedImage(fallbackBase64);
    } catch {
      setScanError("Could not open gallery from native picker. Using Expo fallback.");
      const fallbackBase64 = await launchExpoGalleryFallback();
      if (!fallbackBase64) {
        return;
      }
      await processScannedImage(fallbackBase64);
    }
  };

  const onOpenScanPicker = () => {
    Alert.alert("Scan Receipt", "Choose image source", [
      {
        text: "Camera",
        onPress: () => {
          onScanFromCamera();
        },
      },
      {
        text: "Gallery",
        onPress: () => {
          onScanFromGallery();
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
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

          <Pressable style={styles.entryCard} onPress={onOpenScanPicker}>
            <Text style={styles.entryTitle}>Scan Receipt</Text>
            <Text style={styles.entryDescription}>Capture or select a photo and auto-fill details.</Text>
          </Pressable>
        </View>

        {scanError ? <Text style={styles.errorText}>{scanError}</Text> : null}

        {scanLoading ? (
          <View style={styles.scanLoadingWrap}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.scanLoadingText}>Processing receipt...</Text>
          </View>
        ) : null}

        {scanSummary ? (
          <View style={styles.scanResultCard}>
            <Text style={styles.scanResultTitle}>Scanned Receipt</Text>
            <Text style={styles.scanResultLine}>
              Merchant: {scanSummary.merchant || "Unknown"}
            </Text>
            <Text style={styles.scanResultLine}>
              Amount: {scanSummary.amount !== undefined ? `$${scanSummary.amount.toFixed(2)}` : "-"}
            </Text>
            <Text style={styles.scanResultLine}>Date: {scanSummary.date || "-"}</Text>

            {scanSummary.items.length > 0 ? (
              <View style={styles.itemsWrap}>
                <Text style={styles.itemsTitle}>Extracted Items</Text>
                {scanSummary.items.map((item, index) => (
                  <View key={`${item.name}-${index}`} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <Text style={styles.confirmedScanText}>
              Receipt details applied. You can edit before saving.
            </Text>
          </View>
        ) : null}

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
    </View>
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
  scanLoadingWrap: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#1F1F1F",
    minHeight: 48,
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  scanLoadingText: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 13,
  },
  scanResultCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#1F1F1F",
    padding: spacing.md,
    gap: spacing.xs,
  },
  scanResultTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 16,
    marginBottom: 2,
  },
  scanResultLine: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 13,
  },
  itemsWrap: {
    marginTop: spacing.xs,
    gap: 6,
  },
  itemsTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 13,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 12,
    flex: 1,
    marginRight: spacing.sm,
  },
  itemPrice: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 12,
  },
  confirmScanButton: {
    marginTop: spacing.xs,
    minHeight: 42,
    borderRadius: radius.pill,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmScanButtonText: {
    color: "#000000",
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
  confirmedScanText: {
    color: colors.success,
    fontFamily: typography.regular,
    fontSize: 12,
    marginTop: spacing.xs,
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
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  processingText: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 14,
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
