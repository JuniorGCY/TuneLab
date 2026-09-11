import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { FONTS } from '@/constants/fonts';

import { TuningCard } from '@/features/ai-turning/components/TuningCard';
import { TuningVisualCard } from '@/features/ai-turning/components/TuningVisualCard'
import { TuningResult } from '@/features/ai-turning/components/TuningResult';

import { RFValue } from 'react-native-responsive-fontsize';

const performanceData = [
  {
    id: '1',
    title: 'Stage 1 Remap',
    category: 'ECU',
    gains: '+35hp /\n+55Nm',
    cost: '~R$ 2.500',
    difficulty: 1, // 1 de 3
  },
  {
    id: '2',
    title: 'Cold Air Intake',
    category: 'INTAKE',
    gains: '+8hp / Melhor\nronco',
    cost: '~R$ 1.800',
    difficulty: 2, // 2 de 3
  },
  {
    id: '3',
    title: 'Downpipe High-Flow',
    category: 'EXHAUST',
    gains: '+15hp',
    cost: '~R$ 3.200',
    difficulty: 2, // 2 de 
  },
];

const visualData = [
  {
    id: '1',
    title: 'Body Kit Aerodinamico',
    effect: 'Downforce + Visual Agressivo',
    category: 'AERO',
    cost: '~R$ 4.200',
    difficulty: 2,
  },
  {
    id: '2',
    title: 'Rodas Enkei RPF1 18',
    effect: '-4KG por roda/rebaixo 30mm',
    category: 'Stance',
    cost: '~R$ 6.800',
    difficulty: 2,
  },
  {
    id: '3',
    title: 'Farois Full LED Vland Smoke',
    effect: 'Estética Dark + iluminacao 6000k',
    category: 'Lighting',
    cost: '~R$ 2.900',
    difficulty: 1,
  },
];

export default function AITuningAnalysisModal({ visible, onClose }) {
  const [activeTab, setActiveTab] = useState('Performance');

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
            source={{ uri: 'https://via.placeholder.com/800x600/1e1e1e/888888?text=Honda+Civic' }} // Substitua pela imagem real
            style={styles.heroImage}
            imageStyle={{ opacity: 0.6 }}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                <Text style={styles.headerIcon}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Analise completa</Text>
            </View>

            <View style={styles.heroContent}>
              <Text style={styles.carName}>Honda Civic Si 2018</Text>
              <View style={styles.badgesRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Precisão IA: 98%</Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Corrigir modelo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          <View style={styles.tabsContainer}>
            {['Visual', 'Performance', 'Setup Completo'].map((tab) => (
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
            {activeTab === 'Performance' && 
              performanceData.map((item) => (
                <TuningCard key={item.id} item={item} />
              ))
            }
            {activeTab === 'Visual' && 
              visualData.map((item) => (
                <TuningVisualCard key={item.id} item={item} />
              ))
            }
            {activeTab === 'Setup Completo' && 
                <TuningResult />
            }
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>SALVAR ESTE SETUP</Text>
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