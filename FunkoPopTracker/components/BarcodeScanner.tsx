import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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

export default function CameraScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraFacing, setCameraFacing] = useState<CameraType>("back");

  const [scanned, setScanned] = useState(false);
  // const cameraRef = useRef(null);

  if (!permission) {
    // Camera is still loading or permission is not granted
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setCameraFacing((current) => (current === "back" ? "front" : "back"));
  }

  // useEffect(() => {
  //   const getBarCodeScannerPermissions = async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setHasPermission(status === 'granted');
  //   };

  //   getBarCodeScannerPermissions();
  // }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Alert.alert(
      'Barcode Scanned!',
      `Type: ${type}\nData: ${data}`,
      [{ text: 'OK', onPress: () => setScanned(false) }]
    );
  };

  // const toggleCameraType = () => {
  //   setCameraType(
  //     cameraType === Camera.Constants.Type.back
  //       ? Camera.Constants.Type.front
  //       : Camera.Constants.Type.back
  //   );
  // };

  const handleFakeBarCodeScanned = () => {
    if (__DEV__) {
    // Simulate a barcode scan in development
    setTimeout(() => {
      handleBarCodeScanned({
        type: 'code128',
        data: '1234567890',
      });
    }, 2000);
  }
      

  // if (hasPermission === null) {
  //   return <Text>Requesting camera permission...</Text>;
  // }

  // if (hasPermission === false) {
  //   return <Text>No access to camera</Text>;
  // }

  return (
    <View style={styles.container}>
      <CameraView
        barcodeScannerSettings={{
          // Todo figure out what type of barcodes we want to scan
          barcodeTypes: ["qr", 'aztec', 'ean13', 'ean8', 'pdf417', 'upc_e',
             'datamatrix', 'code39', 'code93', 'itf14', 'codabar', 'code128', 'upc_a'],
        }}
        // ref={cameraRef}
        style={styles.camera}
        facing={cameraFacing}
        // onBarCodeScanned={({ type, data }) => {
          // setScanned(true);
        //   Alert.alert(
        //     "Barcode Scanned!",
        //     `Type: ${type}\nData: ${data}`,
        //     [{ text: "OK", onPress: () => {} }]
        //   );
        // }}
        // onError={(error) => {
        //   console.error("Camera error:", error);
        //   Alert.alert("Camera Error", "An error occurred while using the camera.");
        // }}
        // onMountError={(error) => {
        //   console.error("Camera mount error:", error);
        //   Alert.alert("Camera Mount Error", "An error occurred while mounting the camera.");
        // }}
        // onCameraReady={() => {
        //   console.log("Camera is ready");
        // }}   
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
          <Text style={styles.instructions}>
            Point your camera at a QR code to scan
          </Text>
        </View>
      </CameraView>

      {/* <View style={styles.controls}>
        <Button title="Flip Camera" onPress={toggleCameraType} />
        {scanned && (
          <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
        )}
      </View> */}
    </View>
  );
}


