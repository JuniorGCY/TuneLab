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
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { uploadToCoreAPI } from '../services/uploadToCoreAPI';
import { createCarAPI } from '../services/createCarAPI';
import { useAuth } from '@/contexts/AuthContext';

interface CameraScreenProps {
  onClose: () => void;
}

export default function CameraScreen({ onClose }: CameraScreenProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [hp, setHp] = useState('');

  const { getToken, firebaseUser } = useAuth();

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

  const handleDiscardImage = () => {
    setCapturedImage(null);
    setTitulo('');
    setDescricao('');
    setHp('');
  };

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

    if (!titulo.trim()) {
        Alert.alert('Atenção', 'Dê um título ao seu projeto antes de salvar.');
        return;
    }

    setLoading(true);
    try {
      if (!firebaseUser) throw new Error("Usuário não está logado!");
      
      const token = await getToken();
      if (!token) throw new Error("Não foi possível obter o token de autenticação.");

      console.log('1. Enviando imagem para o Storage...');
      const imageUrl = await uploadToCoreAPI(capturedImage, token);

      console.log('2. Salvando dados no Postgres (Neon)...');
      
      const payloadCarro = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        hp: parseInt(hp, 10) || 0, 
        imageUrl: imageUrl
      };

      await createCarAPI(payloadCarro, token);

      Alert.alert('Sucesso!', 'Veículo cadastrado na sua garagem!');
      handleDiscardImage();
      onClose();

    } catch (error: any) {
      console.log('Erro no fluxo de cadastro:', error);
      Alert.alert('Erro', error?.message || 'Falha ao processar o veículo.');
    } finally {
      setLoading(false);
    }
  };
  
  if (capturedImage) {
    return (
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar barStyle="light-content" />
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleDiscardImage}
          disabled={loading}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Image source={{ uri: capturedImage }} style={styles.previewImageSmall} />

          <View style={styles.formContainer}>
            <Text style={styles.headerTitle}>Detalhes do Veículo</Text>

            <Text style={styles.label}>Título do Projeto</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Golf GTI Stage 2"
              placeholderTextColor="#666"
              editable={!loading}
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Ex: Intake em carbono, remap conservador..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={3}
              editable={!loading}
            />

            <Text style={styles.label}>Potência Estimada (HP)</Text>
            <TextInput
              style={styles.input}
              value={hp}
              onChangeText={setHp}
              placeholder="Ex: 300"
              placeholderTextColor="#666"
              keyboardType="numeric"
              editable={!loading}
            />
          </View>
        </ScrollView>

        <View style={styles.previewButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#333' }]}
            onPress={handleDiscardImage}
            disabled={loading}
          >
            <Text style={styles.textoBotao}>Descartar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.textoBotao}>Salvar na Garagem</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  previewImageSmall: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  formContainer: {
    padding: 20,
  },
  headerTitle: {
    fontFamily: FONTS.Montserrat.regular,
    fontSize: RFValue(18),
    color: '#FFF',
    marginBottom: 20,
    marginTop: 10,
  },
  label: {
    fontFamily: FONTS.Montserrat.medium,
    fontSize: RFValue(12),
    color: '#CCC',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#FFF',
    fontFamily: FONTS.Montserrat.regular,
    fontSize: RFValue(14),
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    fontFamily: FONTS.Montserrat.regular,
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
  previewButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#0F0F0F',
    borderTopWidth: 1,
    borderTopColor: '#222',
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