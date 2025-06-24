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
  const seriesRef = useRef<TextInput>(null);
  const numberRef = useRef<TextInput>(null);
  const barcodeRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);

  const [formData, setFormData] = useState<Funko>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    series: initialData?.series || "",
    number: initialData?.number || "",
    barcode: initialData?.barcode || "",
    image_uri: initialData?.image_uri || "",
    notes: initialData?.notes || "",
  });

  const [loading, setLoading] = useState(false);

  interface HandleInputChange {
    (field: keyof typeof formData, value: string): void;
  }

  const handleInputChange: HandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your photo library."
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
    } catch (error) {
      if (__DEV__) {
        Alert.alert("Error", `Failed to pick image: ${error}`);
      }
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your camera."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleInputChange("image_uri", result.assets[0].uri);
      }
    } catch (error) {
      if (__DEV__) {
        Alert.alert("Error", `Failed to pick image: ${error}`);
      }
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const showImageOptions = () => {
    Alert.alert("Select Image", "Choose how you want to add an image", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSubmit = async () => {
    if (!formData?.name?.trim()) {
      Alert.alert("Error", "Please enter a name for your Funko Pop");
      return;
    }

    setLoading(true);
    const success = await onSubmit(formData);
    setLoading(false);

    if (success) {
      Alert.alert(
        "Success",
        `Funko Pop ${isEditing ? "updated" : "added"} successfully!`,
        [{ text: "OK", onPress: onCancel }]
      );
    } else {
      Alert.alert(
        "Error",
        `Failed to ${isEditing ? "update" : "add"} Funko Pop`
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        enableOnAndroid={true}
        extraScrollHeight={30}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEditing ? "Edit Funko Pop" : "Add New Funko Pop"}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="Enter Funko Pop name"
              placeholderTextColor="#999"
              returnKeyType="next"
              onSubmitEditing={() => seriesRef.current?.focus()}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Series</Text>
            <TextInput
              ref={seriesRef}
              style={styles.input}
              value={formData.series}
              onChangeText={(value) => handleInputChange("series", value)}
              placeholder="Enter series (e.g., Marvel, DC)"
              placeholderTextColor="#999"
              returnKeyType="next"
              onSubmitEditing={() => numberRef.current?.focus()}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number</Text>
            <TextInput
              ref={numberRef}
              style={styles.input}
              value={formData.number}
              onChangeText={(value) => handleInputChange("number", value)}
              placeholder="Enter Funko number"
              placeholderTextColor="#999"
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => barcodeRef.current?.focus()}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Barcode</Text>
            <TextInput
              ref={barcodeRef}
              style={styles.input}
              value={formData.barcode}
              onChangeText={(value) => handleInputChange("barcode", value)}
              placeholder="Barcode (scanned or manual)"
              placeholderTextColor="#999"
              editable={true}
              returnKeyType="next"
              onSubmitEditing={() => notesRef.current?.focus()}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image</Text>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={showImageOptions}
            >
              {formData.image_uri ? (
                <Image
                  source={{ uri: formData.image_uri }}
                  style={styles.imagePreview}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={40} color="#666" />
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
              onChangeText={(value) => handleInputChange("notes", value)}
              placeholder="Additional notes..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              returnKeyType="done"
              onSubmitEditing={() => {
                handleSubmit(); // submit as we blur this field on submit
              }}
              submitBehavior="blurAndSubmit"
            />
            {/* <TextInput
            ref={notesRef}
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(value) => handleInputChange('notes', value)}
            placeholder="Additional notes..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            returnKeyType="done"
          /> */}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Saving..." : isEditing ? "Update" : "Add Funko"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  textArea: {
    height: 100,
  },
  imageButton: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  cancelButtonText: {
    color: "#6c757d",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default AddFunkoForm;
