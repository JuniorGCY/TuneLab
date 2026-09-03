import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { uploadToCoreAPI } from '../services/uploadToCoreAPI';
import { createCarAPI } from '../services/createCarAPI';
import { useAuth } from '@/contexts/AuthContext';

interface CameraScreenProps {
  onClose: () => void;
}

export default function CameraScreen({onClose}: CameraScreenProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { getToken, firebaseUser, isLoading } = useAuth();

  const realizarRequisicao = async () => {
    if (isLoading) return; 

    if (!firebaseUser) {
      throw new Error("Usuário não está autenticado na interface.");
    }

    const token = await getToken();
    if (!token) {
      throw new Error("Falha de comunicação: Não foi possível resgatar o token de sessão.");
    }
  };

  if (!cameraPermission) {
    return <View style={styles.container} />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>
          O TuneLab precisa de acesso à câmera para analisar seu carro.
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
          setCapturedImage(photo.uri);
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
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!capturedImage) return;

    setLoading(true);
    try {
      console.log('1. Iniciando processo completo...');
      
      if (!firebaseUser) {
         throw new Error("Usuário não está logado!");
      }
      
      const token = await getToken();
        if (!token) {
        throw new Error("Não foi possível obter o token de autenticação.");
      }

      console.log('2. Enviando imagem para o Storage...');
      const imageUrl = await uploadToCoreAPI(capturedImage, token);
      console.log('URL recebida:', imageUrl);

      console.log('3. Salvando dados no Postgres (Neon)...');
      
      const payloadCarro = {
        titulo: "Meu Primeiro Projeto",
        descricao: "Carro capturado pelo TuneLab",
        hp: 250,
        imageUrl: imageUrl
      };

      const carroSalvo = await createCarAPI(payloadCarro, token);
      console.log('Carro inserido com sucesso no banco:', carroSalvo);

      Alert.alert('Sucesso!', 'Foto enviada e carro cadastrado na base de dados!');
      setCapturedImage(null);
    
      onClose();

    } catch (error: any) {
      console.log('Erro no fluxo de cadastro:', error);
      Alert.alert(
        'Erro',
        error?.message || 'Falha ao processar o veículo.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  if (capturedImage) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Image source={{ uri: capturedImage }} style={styles.previewImage} />

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setCapturedImage(null)}
          disabled={loading}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.previewButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#333' }]}
            onPress={() => setCapturedImage(null)}
            disabled={loading}
          >
            <Text style={styles.textoBotao}>Tirar Outra</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.textoBotao}>Analisar Carro</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <CameraView
        style={StyleSheet.absoluteFill}
        ref={cameraRef}
        facing="back"
      />

      <View style={styles.overlay} pointerEvents="box-none">
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={pickImageFromGallery}
          >
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
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
  },
  texto: {
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  botao: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  textoBotao: {
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: FONTS.Montserrat.bold,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
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
    justifyContent: 'center',
  },
});