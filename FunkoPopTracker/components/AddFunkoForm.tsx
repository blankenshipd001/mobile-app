import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Funko } from "@/utils/funko";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTheme } from "@react-navigation/native";
import Toast from "react-native-toast-message";

type AddFunkoFormProps = {
  onSubmit: (data: Funko) => Promise<any>;
  onCancel: () => void;
  initialData?: Partial<Funko> | null;
  isEditing?: boolean;
};

const AddFunkoForm: React.FC<AddFunkoFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  isEditing = false,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const seriesRef = useRef<TextInput>(null);
  const numberRef = useRef<TextInput>(null);
  const barcodeRef = useRef<TextInput>(null);
  const purchaseRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);

  const [formData, setFormData] = useState<Funko>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    series: initialData?.series || "",
    number: initialData?.number || "",
    purchase_price: initialData?.purchase_price || "",
    barcode: initialData?.barcode || "",
    image_uri: initialData?.image_uri || "",
    notes: initialData?.notes || "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof Funko, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow photo library access."
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.5,
      });
      if (!result.canceled && result.assets[0]) {
        handleInputChange("image_uri", result.assets[0].uri);
      }
    } catch {
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Required", "Please allow camera access.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        handleInputChange("image_uri", result.assets[0].uri);
      }
    } catch {
      Alert.alert("Error", "Failed to take photo.");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Name is required.");
      return;
    }
    setLoading(true);
    const success = await onSubmit(formData);
    setLoading(false);
    if (success) {
      Toast.show({
        type: "success",
        text1: `${isEditing ? "Updated" : "Added"} successfully!`,
      });
      onCancel();
    } else {
      Toast.show({
        type: "error",
        text1: `Failed to ${isEditing ? "update" : "add"} Funko.`,
      });
      onCancel();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollView}
          enableOnAndroid
          extraScrollHeight={30}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? "Edit Funko Pop" : "Add New Funko Pop"}
            </Text>
          </View>

          <View style={styles.form}>
            {[
              {
                label: "Name *",
                key: "name",
                ref: null,
                next: seriesRef,
                keyboard: "default",
              },
              {
                label: "Series",
                key: "series",
                ref: seriesRef,
                next: numberRef,
                keyboard: "default",
              },
              {
                label: "Number",
                key: "number",
                ref: numberRef,
                next: purchaseRef,
                keyboard: "numeric",
              },
              {
                label: "Purchase Price",
                key: "purchase_price",
                ref: purchaseRef,
                next: barcodeRef,
                keyboard: "numeric",
              },
              {
                label: "Barcode",
                key: "barcode",
                ref: barcodeRef,
                next: notesRef,
                keyboard: "default",
              },
            ].map(({ label, key, ref, next, keyboard }) => (
              <View style={styles.inputGroup} key={key}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  ref={ref}
                  style={styles.input}
                  value={String(formData[key as keyof Funko] ?? "")}
                  onChangeText={(v) => handleInputChange(key as keyof Funko, v)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  placeholderTextColor={colors.text + "99"}
                  returnKeyType="next"
                  keyboardType={keyboard as any}
                  onSubmitEditing={() => next?.current?.focus()}
                />
              </View>
            ))}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Image</Text>
              <TouchableOpacity
                style={styles.imageButton}
                onPress={() => {
                  Alert.alert("Choose Image", "", [
                    { text: "Camera", onPress: takePhoto },
                    { text: "Gallery", onPress: pickImage },
                    { text: "Cancel", style: "cancel" },
                  ]);
                }}
              >
                {formData.image_uri ? (
                  <Image
                    source={{ uri: formData.image_uri }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons
                      name="camera"
                      size={40}
                      color={colors.text + "66"}
                    />
                    <Text style={styles.imagePlaceholderText}>
                      Tap to add image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                ref={notesRef}
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(v) => handleInputChange("notes", v)}
                placeholder="Additional notes..."
                placeholderTextColor={colors.text + "99"}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                returnKeyType="done"
              />
            </View>

            {/* Add bottom padding so content doesn't hide behind buttons */}
            <View style={{ height: 100 }} />
          </View>
        </KeyboardAwareScrollView>

        {/* Sticky buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Saving..." : isEditing ? "Update" : "Add Funko"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollView: { flexGrow: 1 },
    header: { backgroundColor: colors.primary, padding: 20, paddingTop: 60 },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.card,
      textAlign: "center",
    },
    form: { padding: 20 },
    inputGroup: { marginBottom: 20 },
    label: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: colors.card,
      color: colors.text,
    },
    textArea: { height: 100 },
    imageButton: {
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: "dashed",
      borderRadius: 8,
      height: 200,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.card,
    },
    imagePlaceholder: { alignItems: "center" },
    imagePlaceholderText: {
      marginTop: 10,
      color: colors.text + "88",
      fontSize: 16,
    },
    imagePreview: { width: "100%", height: "100%", borderRadius: 6 },
    buttonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 20,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    button: { flex: 1, padding: 15, borderRadius: 8, marginHorizontal: 5 },
    cancelButton: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    submitButton: { backgroundColor: colors.primary },
    buttonText: { fontSize: 16, fontWeight: "600", textAlign: "center" },
    cancelText: { color: colors.text },
  });

export default AddFunkoForm;
