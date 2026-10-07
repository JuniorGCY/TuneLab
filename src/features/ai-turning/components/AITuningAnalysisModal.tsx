import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS } from '@/constants/fonts';

import { TuningCard } from '@/features/ai-turning/components/TuningCard';
import { TuningVisualCard } from '@/features/ai-turning/components/TuningVisualCard';
import { TuningResult } from '@/features/ai-turning/components/TuningResult';
import { RFValue } from 'react-native-responsive-fontsize';

import { createCarAPI } from '@/features/Home/services/createCarAPI';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, ActivityIndicator } from 'react-native';

import { UploadResponse } from '@/features/Home/types/UploadResponse';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  data: UploadResponse | null;
}

export default function AITuningAnalysisModal({ visible, onClose, data }: ModalProps) {
  const [activeTab, setActiveTab] = useState('Performance');
  const [isSaving, setIsSaving] = useState(false); // Novo estado
  const { getToken } = useAuth(); // Puxa o toke

  // Proteção: se não houver dados, não renderiza o modal quebrado
  if (!data || !data.ai_setup) return null;

  const { ai_setup, imageUrl, imagemModificadaUrl } = data;
  const perfItems = ai_setup.performance_items || [];
  const visItems = ai_setup.visual_items || [];

  // Na aba Visual mostramos o carro já com o setup aplicado pela IA, quando disponível.
  // Se a geração de imagem não rodou (sem crédito no Gemini, por exemplo), caímos de
  // volta pra foto original em vez de quebrar a tela.
  const temImagemModificada = !!imagemModificadaUrl;
  const heroImageUri = activeTab === 'Visual' && temImagemModificada ? imagemModificadaUrl : imageUrl;

  const handleDownloadImagemModificada = () => {
    if (!imagemModificadaUrl) return;
    Linking.openURL(imagemModificadaUrl);
  };

  const handleSaveSetup = async () => {
    setIsSaving(true)

    try {
      const token = await getToken();
      if (!token) throw new Error("Não autenticado");

      const payload = {
        titulo: "Projeto Tuning IA", // Ou pegue o modelo que a IA retornou
        descricao: ai_setup.setup_summary.powerGain + " - " + ai_setup.setup_summary.estimatedCost,
        hp: parseInt(ai_setup.setup_summary.totalPower) || 0,
        imageUrl: imageUrl, // A URL que o Go retornou
        imagemModificadaUrl: imagemModificadaUrl,
        setup_ia: ai_setup, // O JSONB gigante vai todo pra cá!
      }

      await createCarAPI(payload,token)

      Alert.alert("Sucesso!", "Seu projeto está salvo na garagem!")
      onClose(); // Fecha o modal e volta pra Home
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar na garagem.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />

        <ScrollView style={styles.scrollView} bounces={false}>
          <ImageBackground
            source={{ uri: heroImageUri }}
            style={styles.heroImage}
            imageStyle={{ opacity: 0.6 }}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                <Text style={styles.headerIcon}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Análise Completa</Text>

              {activeTab === 'Visual' && temImagemModificada && (
                <TouchableOpacity onPress={handleDownloadImagemModificada} style={styles.iconButton}>
                  <Text style={styles.headerIcon}>⬇</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.heroContent}>
              <Text style={styles.carName}>Seu Projeto Exclusivo</Text>
              <View style={styles.badgesRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Powered by TuneLab AI</Text>
                </View>
              </View>
            </View>
          </ImageBackground>

          <View style={styles.tabsContainer}>
            {['Performance', 'Visual', 'Setup Completo'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.disclaimer} accessible accessibilityRole="text">
              <Text style={styles.disclaimerText}>
                Sugestões geradas por IA: peças, preços e ganhos de potência são estimativas. Antes
                de instalar qualquer modificação, confirme a compatibilidade com o seu veículo e
                verifique a legislação local (homologação e certificação).
              </Text>
            </View>

            {activeTab === 'Performance' &&
              perfItems.map((item) => (
                <TuningCard key={item.id} item={item} />
              ))
            }
            {activeTab === 'Visual' && (
              <>
                {temImagemModificada && (
                  <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadImagemModificada}>
                    <Text style={styles.downloadButtonText}>⬇ Baixar imagem modificada</Text>
                  </TouchableOpacity>
                )}
                {visItems.map((item) => (
                  <TuningVisualCard key={item.id} item={item} />
                ))}
              </>
            )}
            {activeTab === 'Setup Completo' &&
                <TuningResult setupData={ai_setup} /> // Passamos os dados pro componente filho!
            }
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSetup} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="#FFF" />
            ): (
              <Text style={styles.saveButtonText}>Salvar esse Setup</Text>
            )}

          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 250,
    justifyContent: 'space-between',
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  iconButton: {
    padding: 8,
  },
  headerIcon: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heroContent: {
    padding: 16,
    paddingBottom: 24,
  },
  carName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 107, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 16,
  },
  badgeText: {
    color: '#FF6B00',
    fontSize: 12,
    fontWeight: 'bold',
  },
  disclaimer: {
    backgroundColor: 'rgba(255, 107, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.35)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  disclaimerText: {
    color: '#DDD',
    fontSize: 12,
    lineHeight: 18,
  },
  editButton: {
    padding: 6,
  },
  editButtonText: {
    color: '#FFB885',
    fontSize: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 16,
    marginRight: 24,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B00',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  downloadButton: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#FF6B00',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  downloadButtonText: {
    color: '#FF6B00',
    fontSize: 13,
    fontWeight: '700',
  },
  cardContainer: {
    backgroundColor: '#202020',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: RFValue(12),
    fontFamily: FONTS.Montserrat.bold
  },
  cardCategory: {
    color: '#FF6B00',
    fontSize: RFValue(10),
    fontWeight: '900',
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardColumn: {
    flex: 1,
  },
  label: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: '#FF6B00',
    fontSize: RFValue(12),
    marginRight: 6,
    marginTop: 2,
  },
  infoTextValue: {
    color: '#FFF',
    fontSize: RFValue(12),
    fontFamily: FONTS.Montserrat.bold,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  difficultyBars: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  bar: {
    height: 4,
    width: 24,
    borderRadius: 2,
    marginRight: 4,
  },
  barActive: {
    backgroundColor: '#FF6B00',
  },
  barInactive: {
    backgroundColor: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121212',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  saveButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
