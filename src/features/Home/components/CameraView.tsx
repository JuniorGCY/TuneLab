import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

export default function CameraScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  if (!cameraPermission) {
    return <View style={styles.container} />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>O TuneLab precisa de acesso à câmera para analisar seu carro.</Text>
        <TouchableOpacity style={styles.botao} onPress={requestCameraPermission}>
          <Text style={styles.textoBotao}>Permitir Câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        if (photo?.uri) {
          setCapturedImage(photo.uri);
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível capturar a foto.");
      }
    }
  };

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage }} style={styles.previewImage} />
        <View style={styles.previewButtonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#333' }]} 
            onPress={() => setCapturedImage(null)}
          >
            <Text style={styles.textoBotao}>Tirar Outra</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]} 
            onPress={() => {
              Alert.alert("Sucesso!", "Foto pronta para envio ao TuneLab Core.");
            }}
          >
            <Text style={styles.textoBotao}>Analisar Carro</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back">
        <View style={styles.footerContainer}>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={pickImageFromGallery}>
            <Text style={styles.secondaryButtonText}>📁 Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <View style={{ width: 60 }} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F', justifyContent: 'center' },
  camera: { flex: 1 },
  texto: { color: '#FFF', textAlign: 'center', marginBottom: 20, paddingHorizontal: 20 },
  botao: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 20 },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontFamily: FONTS.Montserrat.bold },
  footerContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 40,
  },
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 63,
    height: 63,
    borderRadius: 31.5,
    backgroundColor: '#FFF',
  },
  secondaryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 15,
  },
  secondaryButtonText: {
    color: '#FFF',
    fontFamily: FONTS.Montserrat.regular,
    fontSize: 14,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#0F0F0F',
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  }
});