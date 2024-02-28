import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Linking, Clipboard } from 'react-native';
import { StatusBar } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Наведите камеру на QR-код');

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setText(data);
    Linking.openURL(data); // Открывает сканированную ссылку
  };

  const copyToClipboard = () => {
    Clipboard.setString(text);
    alert('Ссылка скопирована!');
  };

  const askForCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text>Разрешение на использование камеры</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={{ margin: 10 }}>Нет доступа к камере</Text>
        <Button title={'Дать разрешение'} onPress={askForCameraPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      </View>

      <Text style={styles.text}>{text}</Text>
      {scanned && (
        <View style={styles.buttonContainer}>
          <Button title={'Скопировать ссылку'} onPress={copyToClipboard} />
          <Button title={'Сканировать ещё?'} onPress={() => setScanned(false)} color="tomato" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '85%',
    aspectRatio: 1,
    borderRadius: 30,
    overflow: 'hidden',
  },
  text: {
    fontSize: 16,
    margin: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});