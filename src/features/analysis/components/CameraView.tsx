import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { FONTS } from '@/constants/fonts';
import { colors } from '@/constants/colors';

interface CameraScreenProps {
  onClose: () => void;
  // Nova prop: Devolve a URI da foto capturada para a tela pai
  onPictureTaken: (uri: string) => void; 
}

export default function CameraScreen({ onClose, onPictureTaken }: CameraScreenProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  if (!cameraPermission) return <View style={styles.container} />;

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>
          O TuneLab precisa de acesso à câmera para capturar o ângulo do seu carro.
        </Text>
        <TouchableOpacity style={styles.botao} onPress={requestCameraPermission}>
          <Text style={styles.textoBotao}>Permitir Câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.closeButton, { top: 50 }]} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        if (photo?.uri) {
          onPictureTaken(photo.uri); // Devolve a foto pro Analysis.tsx!
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível capturar a foto.');
      }
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      onPictureTaken(result.assets[0].uri); // Devolve a foto pro Analysis.tsx!
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} facing="back" />

      <View style={styles.overlay} pointerEvents="box-none">
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={pickImageFromGallery}>
            <Text style={styles.secondaryButtonText}>📁 Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <View style={{ width: 60 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between' },
  closeButton: { position: 'absolute', top: 50, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  closeButtonText: { color: '#FFF', fontSize: 22, fontWeight: '600' },
  texto: { color: '#FFF', textAlign: 'center', marginBottom: 20, paddingHorizontal: 20 },
  botao: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 20 },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontFamily: FONTS.Montserrat.regular },
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 40, paddingHorizontal: 20 },
  captureButton: { width: 75, height: 75, borderRadius: 37.5, borderWidth: 4, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  captureButtonInner: { width: 63, height: 63, borderRadius: 31.5, backgroundColor: '#FFF' },
  secondaryButton: { justifyContent: 'center', alignItems: 'center', height: 50, paddingHorizontal: 15 },
  secondaryButtonText: { color: '#FFF', fontFamily: FONTS.Montserrat.regular, fontSize: 14 },
});