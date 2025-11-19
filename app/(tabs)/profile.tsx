
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Modal, TextInput, Alert, Share, Linking, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { useData } from "@/contexts/DataContext";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export default function ProfileScreen() {
  const { 
    nickname,
    setNickname,
    weightGoal, 
    height,
    setWeightGoal,
    setHeight,
    getCurrentWeight,
    getBMI,
    getBMICategory,
    getWeightProgress,
    exportData,
  } = useData();

  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [tempNickname, setTempNickname] = useState(nickname);
  const [targetWeight, setTargetWeight] = useState('');
  const [newHeight, setNewHeight] = useState('');

  const currentWeight = getCurrentWeight();
  const bmi = getBMI();
  const bmiCategory = getBMICategory();
  const progress = getWeightProgress();

  useEffect(() => {
    if (showHeightModal) {
      setNewHeight(height.toString());
    }
  }, [showHeightModal, height]);

  useEffect(() => {
    if (showNicknameModal) {
      setTempNickname(nickname);
    }
  }, [showNicknameModal, nickname]);

  const handleSaveNickname = () => {
    Keyboard.dismiss();
    setNickname(tempNickname.trim());
    setShowNicknameModal(false);
    Alert.alert('Success', 'Nickname updated successfully!');
  };

  const handleSetGoal = () => {
    if (!targetWeight || isNaN(Number(targetWeight))) {
      Alert.alert('Error', 'Please enter a valid target weight');
      return;
    }

    Keyboard.dismiss();

    const now = new Date();
    const target = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    setWeightGoal({
      targetWeight: Number(targetWeight),
      startWeight: currentWeight || Number(targetWeight),
      startDate: now.toDateString(),
      targetDate: target.toDateString(),
    });

    setTargetWeight('');
    setShowGoalModal(false);
    Alert.alert('Success', 'Weight goal set successfully!');
  };

  const handleSetHeight = () => {
    const heightValue = newHeight.trim();
    
    if (!heightValue || isNaN(Number(heightValue))) {
      Alert.alert('Error', 'Please enter a valid height in centimeters');
      return;
    }

    const parsedHeight = Number(heightValue);
    
    if (parsedHeight < 50 || parsedHeight > 300) {
      Alert.alert('Error', 'Please enter a realistic height between 50 and 300 cm');
      return;
    }

    Keyboard.dismiss();
    setHeight(parsedHeight);
    setShowHeightModal(false);
    Alert.alert('Success', 'Height updated successfully!');
  };

  const handleExportData = async () => {
    try {
      const jsonData = exportData();
      const fileName = `balance_day_export_${new Date().toISOString().split('T')[0]}.json`;
      
      if (Platform.OS === 'web') {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        Alert.alert('Success', 'Data exported successfully!');
      } else {
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, jsonData);
        
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(fileUri);
        } else {
          await Share.share({
            message: jsonData,
            title: 'Balance Day Export',
          });
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  const handleContactUs = async () => {
    const email = 'support@balanceday.app';
    const subject = 'Balance Day Support';
    const body = 'Hi Balance Day team,\n\n';
    
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open email client. Please email us at support@balanceday.app');
      }
    } catch (error) {
      console.error('Contact us error:', error);
      Alert.alert('Error', 'Unable to open email client. Please email us at support@balanceday.app');
    }
  };

  const getBMIColor = () => {
    if (!bmi) return colors.textSecondary;
    if (bmi < 18.5) return colors.accent;
    if (bmi < 25) return colors.success;
    if (bmi < 30) return colors.warning;
    return colors.error;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <Text style={styles.title}>Balance Day</Text>
          <Text style={styles.subtitle}>Your wellness profile</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <IconSymbol 
                  ios_icon_name="person.fill" 
                  android_material_icon_name="person" 
                  size={40} 
                  color={colors.primary}
                />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.nicknameText}>
                {nickname || 'Set your nickname'}
              </Text>
              <TouchableOpacity onPress={() => setShowNicknameModal(true)}>
                <Text style={styles.editLink}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Current Stats</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <IconSymbol 
                ios_icon_name="scalemass.fill" 
                android_material_icon_name="monitor-weight" 
                size={28} 
                color={colors.primary}
              />
              <Text style={styles.statValue}>{currentWeight?.toFixed(1) || 'N/A'}</Text>
              <Text style={styles.statLabel}>Weight (kg)</Text>
            </View>
            <View style={styles.statBox}>
              <IconSymbol 
                ios_icon_name="arrow.up.arrow.down" 
                android_material_icon_name="height" 
                size={28} 
                color={colors.accent}
              />
              <Text style={styles.statValue}>{height}</Text>
              <Text style={styles.statLabel}>Height (cm)</Text>
            </View>
            <View style={styles.statBox}>
              <IconSymbol 
                ios_icon_name="heart.fill" 
                android_material_icon_name="favorite" 
                size={28} 
                color={colors.secondary}
              />
              <Text style={[styles.statValue, { color: getBMIColor() }]}>
                {bmi?.toFixed(1) || 'N/A'}
              </Text>
              <Text style={styles.statLabel}>BMI</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weight Goal</Text>
            <TouchableOpacity onPress={() => setShowGoalModal(true)}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          {weightGoal ? (
            <>
              <View style={styles.goalInfo}>
                <View style={styles.goalRow}>
                  <Text style={styles.goalLabel}>Target Weight</Text>
                  <Text style={styles.goalValue}>{weightGoal.targetWeight.toFixed(1)} kg</Text>
                </View>
                <View style={styles.goalRow}>
                  <Text style={styles.goalLabel}>Progress</Text>
                  <Text style={styles.goalValue}>{progress.toFixed(0)}%</Text>
                </View>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${Math.min(progress, 100)}%` }]} />
              </View>
              <Text style={styles.progressSubtext}>
                {((currentWeight || weightGoal.startWeight) - weightGoal.targetWeight).toFixed(1)} kg to go
              </Text>
            </>
          ) : (
            <Text style={styles.noGoalText}>No weight goal set</Text>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>BMI Category</Text>
            <TouchableOpacity onPress={() => setShowHeightModal(true)}>
              <Text style={styles.editLink}>Update Height</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bmiContainer}>
            <View style={[styles.bmiCategoryBadge, { backgroundColor: getBMIColor() }]}>
              <Text style={styles.bmiCategoryText}>{bmiCategory}</Text>
            </View>
          </View>
          <View style={styles.bmiScale}>
            <View style={styles.bmiScaleItem}>
              <View style={[styles.bmiScaleDot, { backgroundColor: colors.accent }]} />
              <Text style={styles.bmiScaleText}>Under</Text>
            </View>
            <View style={styles.bmiScaleItem}>
              <View style={[styles.bmiScaleDot, { backgroundColor: colors.success }]} />
              <Text style={styles.bmiScaleText}>Normal</Text>
            </View>
            <View style={styles.bmiScaleItem}>
              <View style={[styles.bmiScaleDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.bmiScaleText}>Over</Text>
            </View>
            <View style={styles.bmiScaleItem}>
              <View style={[styles.bmiScaleDot, { backgroundColor: colors.error }]} />
              <Text style={styles.bmiScaleText}>Obese</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)}>
          <TouchableOpacity style={styles.exportButton} onPress={handleExportData}>
            <IconSymbol 
              ios_icon_name="square.and.arrow.up.fill" 
              android_material_icon_name="share" 
              size={24} 
              color={colors.text}
            />
            <Text style={styles.exportButtonText}>Export All Data</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Export your data to analyze your progress, share with healthcare providers, or keep a backup.
          </Text>
        </View>

        <Animated.View entering={FadeInDown.delay(450)}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactUs}>
            <IconSymbol 
              ios_icon_name="envelope.fill" 
              android_material_icon_name="email" 
              size={24} 
              color={colors.text}
            />
            <Text style={styles.contactButtonText}>Contact Us</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.contactInfoCard}>
          <Text style={styles.contactInfoText}>
            Have questions or feedback? We&apos;d love to hear from you!
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showNicknameModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNicknameModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => {
            Keyboard.dismiss();
            setShowNicknameModal(false);
          }}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setShowNicknameModal(false)}>
                  <IconSymbol 
                    ios_icon_name="xmark.circle.fill" 
                    android_material_icon_name="cancel" 
                    size={28} 
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nickname</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your nickname"
                  placeholderTextColor={colors.textSecondary}
                  value={tempNickname}
                  onChangeText={setTempNickname}
                  returnKeyType="done"
                  onSubmitEditing={handleSaveNickname}
                  blurOnSubmit={true}
                />
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSaveNickname}>
                <Text style={styles.submitButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showGoalModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGoalModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => {
            Keyboard.dismiss();
            setShowGoalModal(false);
          }}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Set Weight Goal</Text>
                <TouchableOpacity onPress={() => setShowGoalModal(false)}>
                  <IconSymbol 
                    ios_icon_name="xmark.circle.fill" 
                    android_material_icon_name="cancel" 
                    size={28} 
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target Weight (kg) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 70"
                  placeholderTextColor={colors.textSecondary}
                  value={targetWeight}
                  onChangeText={setTargetWeight}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={handleSetGoal}
                  blurOnSubmit={true}
                />
              </View>

              <View style={styles.goalInfoBox}>
                <Text style={styles.goalInfoText}>
                  Current Weight: {currentWeight?.toFixed(1) || 'N/A'} kg
                </Text>
                <Text style={styles.goalInfoText}>
                  Goal will be set for 90 days from today
                </Text>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSetGoal}>
                <Text style={styles.submitButtonText}>Set Goal</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showHeightModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHeightModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => {
            Keyboard.dismiss();
            setShowHeightModal(false);
          }}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Height</Text>
                <TouchableOpacity onPress={() => setShowHeightModal(false)}>
                  <IconSymbol 
                    ios_icon_name="xmark.circle.fill" 
                    android_material_icon_name="cancel" 
                    size={28} 
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Height (cm) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 170"
                  placeholderTextColor={colors.textSecondary}
                  value={newHeight}
                  onChangeText={setNewHeight}
                  keyboardType="numeric"
                  autoFocus={true}
                  returnKeyType="done"
                  onSubmitEditing={handleSetHeight}
                  blurOnSubmit={true}
                />
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoBoxText}>
                  Current height: {height} cm
                </Text>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSetHeight}>
                <Text style={styles.submitButtonText}>Update Height</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  contentContainerWithTabBar: {
    paddingTop: 48,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  nicknameText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  editLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  goalInfo: {
    marginBottom: 16,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  goalValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 6,
  },
  progressSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  noGoalText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  bmiContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bmiCategoryBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bmiCategoryText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  bmiScale: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bmiScaleItem: {
    alignItems: 'center',
    gap: 6,
  },
  bmiScaleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  bmiScaleText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  exportButton: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    boxShadow: '0px 4px 16px rgba(102, 126, 234, 0.3)',
    elevation: 4,
  },
  exportButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    boxShadow: '0px 4px 16px rgba(102, 126, 234, 0.3)',
    elevation: 4,
  },
  contactButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  contactInfoCard: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  contactInfoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.backgroundLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    boxShadow: '0px 4px 12px rgba(102, 126, 234, 0.4)',
    elevation: 4,
  },
  submitButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  goalInfoBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  goalInfoText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  infoBoxText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
});
