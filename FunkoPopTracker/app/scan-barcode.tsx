import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
// import { Camera, CameraType } from "expo-camera";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import axios from "axios";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import AddFunkoForm from "../components/AddFunkoForm";
import { useFunkos } from "@/hooks/useFunkos";
import { Funko } from "@/utils/funko";

export default function ScanBarcodeScreen() {
  const { colors, dark } = useTheme();
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [, requestPermission] = useCameraPermissions();
  const [cameraFacing, setCameraFacing] = useState<CameraType>("back");
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [funkoData, setFunkoData] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { addFunko } = useFunkos();

  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
      setHasPermission(status === "granted");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cleanFunkoName(name: string) {
    return name
      .replace(/^.*?:\s*/i, "") // remove text before colon
      .replace(/\b(Funko|Vinyl|Figure)\b/gi, "") // remove other words except Pop here
      .replace(/\bPop!?(\s|$)/gi, "") // remove Pop or Pop! followed by space or end
      .replace(/\s+/g, " ") // collapse spaces
      .trim();
  }

  const fetchProductInfo = async (barcode: string) => {
    setLoading(true);
    setFunkoData(null);
    try {
      const response = await axios.get(
        `https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`
      );
      if (
        response.data &&
        response.data.items &&
        response.data.items.length > 0
      ) {
        const product = response.data.items[0];
        // Map product info to Funko form data shape
        const funkoName = cleanFunkoName(product.title);
        const mappedFunko = {
          name: funkoName || "",
          series: "",
          notes: product.description || "",
          image_uri:
            product.images && product.images.length > 0
              ? product.images[0]
              : "",
          barcode,
        };
        setFunkoData(mappedFunko);
        setShowAddForm(true);
      } else {
        Alert.alert(
          "No product found",
          "No product info found for this barcode. You can add it manually."
        );
        setScanned(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch product data.");
      console.error(error);
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      fetchProductInfo(data);
    }
  };

  const handleAddFunko = async (funkoData: Funko) => {
    const success = await addFunko(funkoData);
    return success;
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No access to camera.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />

      {!scanned ? (
        <View style={styles.container}>
          <CameraView
            barcodeScannerSettings={{
              // Todo figure out what type of bar codes we want to scan
              barcodeTypes: [
                "qr",
                "aztec",
                "ean13",
                "ean8",
                "pdf417",
                "upc_e",
                "datamatrix",
                "code39",
                "code93",
                "itf14",
                "codabar",
                "code128",
                "upc_a",
              ],
            }}
            style={styles.camera}
            facing={cameraFacing}
            onBarcodeScanned={handleBarCodeScanned}
          />
        </View>
      ) : loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.text, marginTop: 12 }}>
            Looking up product...
          </Text>
        </View>
      ) : (
        // Nothing else to show, the form modal will open automatically
        <View style={styles.centered}>
          <Text style={{ color: colors.text }}>Waiting...</Text>
        </View>
      )}

      <Modal
        visible={showAddForm}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowAddForm(false)}
      >
        <AddFunkoForm
          onSubmit={handleAddFunko}
          onCancel={() => {
            setShowAddForm(false);
            router.push("/");
          }}
          initialData={funkoData || { barcode: "" }}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  instructions: {
    color: "white",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: "white",
  },
});
