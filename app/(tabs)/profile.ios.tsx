
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { useData } from "@/contexts/DataContext";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { 
    weightEntries, 
    weightGoal, 
    milestones, 
    height,
    addWeightEntry, 
    deleteWeightEntry,
    setWeightGoal,
    setHeight,
    getCurrentWeight,
    getBMI,
    getBMICategory,
    getWeightProgress
  } = useData();

  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [weightNote, setWeightNote] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [newHeight, setNewHeight] = useState(height.toString());

  const currentWeight = getCurrentWeight();
  const bmi = getBMI();
  const bmiCategory = getBMICategory();
  const progress = getWeightProgress();

  const handleAddWeight = () => {
    if (!newWeight || isNaN(Number(newWeight))) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    addWeightEntry({
      weight: Number(newWeight),
      note: weightNote.trim() || undefined,
    });

    setNewWeight('');
    setWeightNote('');
    setShowAddWeightModal(false);
    Alert.alert('Success', 'Weight logged successfully!');
  };

  const handleDeleteWeight = (id: string) => {
    Alert.alert(
      'Delete Weight Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteWeightEntry(id)
        },
      ]
    );
  };

  const handleSetGoal = () => {
    if (!targetWeight || isNaN(Number(targetWeight))) {
      Alert.alert('Error', 'Please enter a valid target weight');
      return;
    }

    const now = new Date();
    const target = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days from now

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
    if (!newHeight || isNaN(Number(newHeight))) {
      Alert.alert('Error', 'Please enter a valid height');
      return;
    }

    setHeight(Number(newHeight));
    setShowHeightModal(false);
    Alert.alert('Success', 'Height updated successfully!');
  };

  const getBMIColor = () => {
    if (!bmi) return colors.textSecondary;
    if (bmi < 18.5) return colors.accent;
    if (bmi < 25) return colors.success;
    if (bmi < 30) return colors.warning;
    return colors.error;
  };

  const getChartData = () => {
    const sorted = [...weightEntries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted.slice(-10); // Last 10 entries
  };

  const chartData = getChartData();
  const maxWeight = Math.max(...chartData.map(e => e.weight), weightGoal?.targetWeight || 0);
  const minWeight = Math.min(...chartData.map(e => e.weight), weightGoal?.targetWeight || 100);
  const weightRange = maxWeight - minWeight || 10;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <Text style={styles.title}>Weight Tracker</Text>
          <Text style={styles.subtitle}>Monitor your progress</Text>
        </Animated.View>

        {/* Current Stats */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="scalemass.fill" 
                android_material_icon_name="monitor-weight" 
                size={32} 
                color={colors.primary}
              />
              <Text style={styles.statValue}>{currentWeight?.toFixed(1) || 'N/A'}</Text>
              <Text style={styles.statLabel}>Current Weight (kg)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="target" 
                android_material_icon_name="flag" 
                size={32} 
                color={colors.accent}
              />
              <Text style={styles.statValue}>{weightGoal?.targetWeight.toFixed(1) || 'N/A'}</Text>
              <Text style={styles.statLabel}>Target Weight (kg)</Text>
            </View>
          </View>
        </Animated.View>

        {/* BMI Card */}
        <Animated.View entering={FadeInDown.delay(250)} style={styles.bmiCard}>
          <View style={styles.bmiHeader}>
            <Text style={styles.cardTitle}>Body Mass Index (BMI)</Text>
            <TouchableOpacity onPress={() => setShowHeightModal(true)}>
              <Text style={styles.editText}>Edit Height</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bmiContent}>
            <View style={styles.bmiValueContainer}>
              <Text style={[styles.bmiValue, { color: getBMIColor() }]}>
                {bmi?.toFixed(1) || 'N/A'}
              </Text>
              <View style={[styles.bmiCategoryBadge, { backgroundColor: getBMIColor() }]}>
                <Text style={styles.bmiCategoryText}>{bmiCategory}</Text>
              </View>
            </View>
            <Text style={styles.heightText}>Height: {height} cm</Text>
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

        {/* Progress Card */}
        {weightGoal && (
          <Animated.View entering={FadeInDown.delay(300)} style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.cardTitle}>Goal Progress</Text>
              <TouchableOpacity onPress={() => setShowGoalModal(true)}>
                <Text style={styles.editText}>Edit Goal</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressText}>{progress.toFixed(0)}% Complete</Text>
              <Text style={styles.progressText}>
                {(weightGoal.startWeight - (currentWeight || weightGoal.startWeight)).toFixed(1)} kg lost
              </Text>
            </View>
            <Text style={styles.progressSubtext}>
              {((currentWeight || weightGoal.startWeight) - weightGoal.targetWeight).toFixed(1)} kg to go
            </Text>
          </Animated.View>
        )}

        {/* Weight Chart */}
        <Animated.View entering={FadeInDown.delay(350)} style={styles.chartCard}>
          <Text style={styles.cardTitle}>Weight Trend</Text>
          <View style={styles.chart}>
            {chartData.length > 0 ? (
              <>
                {/* Y-axis labels */}
                <View style={styles.yAxis}>
                  <Text style={styles.yAxisLabel}>{maxWeight.toFixed(0)}</Text>
                  <Text style={styles.yAxisLabel}>{((maxWeight + minWeight) / 2).toFixed(0)}</Text>
                  <Text style={styles.yAxisLabel}>{minWeight.toFixed(0)}</Text>
                </View>
                
                {/* Chart area */}
                <View style={styles.chartArea}>
                  {/* Goal line */}
                  {weightGoal && (
                    <View 
                      style={[
                        styles.goalLine,
                        { 
                          bottom: `${((weightGoal.targetWeight - minWeight) / weightRange) * 100}%` 
                        }
                      ]}
                    >
                      <View style={styles.goalLineDash} />
                      <Text style={styles.goalLineText}>Goal</Text>
                    </View>
                  )}
                  
                  {/* Data points */}
                  <View style={styles.dataPoints}>
                    {chartData.map((entry, index) => {
                      const heightPercent = ((entry.weight - minWeight) / weightRange) * 100;
                      const leftPercent = (index / (chartData.length - 1)) * 100;
                      
                      return (
                        <React.Fragment key={index}>
                          <View
                            style={[
                              styles.dataPoint,
                              {
                                bottom: `${heightPercent}%`,
                                left: `${leftPercent}%`,
                              }
                            ]}
                          >
                            <View style={styles.dataPointDot} />
                          </View>
                          {index < chartData.length - 1 && (
                            <View
                              style={[
                                styles.dataLine,
                                {
                                  bottom: `${heightPercent}%`,
                                  left: `${leftPercent}%`,
                                  width: `${100 / (chartData.length - 1)}%`,
                                  transform: [
                                    {
                                      rotate: `${Math.atan2(
                                        ((chartData[index + 1].weight - minWeight) / weightRange - (entry.weight - minWeight) / weightRange) * 150,
                                        (width - 120) / (chartData.length - 1)
                                      )}rad`
                                    }
                                  ]
                                }
                              ]}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyChartText}>No weight data yet</Text>
              </View>
            )}
          </View>
          <View style={styles.xAxis}>
            {chartData.slice(0, 5).map((entry, index) => (
              <React.Fragment key={index}>
                <Text style={styles.xAxisLabel}>
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Animated.View entering={FadeInDown.delay(400)} style={styles.actionButtonWrapper}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setShowAddWeightModal(true)}>
              <IconSymbol 
                ios_icon_name="plus.circle.fill" 
                android_material_icon_name="add-circle" 
                size={24} 
                color={colors.card}
              />
              <Text style={styles.primaryButtonText}>Log Weight</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(450)} style={styles.actionButtonWrapper}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowGoalModal(true)}>
              <IconSymbol 
                ios_icon_name="target" 
                android_material_icon_name="flag" 
                size={24} 
                color={colors.primary}
              />
              <Text style={styles.secondaryButtonText}>Set Goal</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Milestones */}
        {milestones.length > 0 && (
          <Animated.View entering={FadeInDown.delay(500)} style={styles.milestonesSection}>
            <Text style={styles.sectionTitle}>Milestones 🎉</Text>
            {milestones.slice().reverse().map((milestone, index) => (
              <React.Fragment key={index}>
                <View style={styles.milestoneCard}>
                  <View style={styles.milestoneIcon}>
                    <IconSymbol 
                      ios_icon_name="star.fill" 
                      android_material_icon_name="star" 
                      size={24} 
                      color={colors.accent}
                    />
                  </View>
                  <View style={styles.milestoneInfo}>
                    <Text style={styles.milestoneMessage}>{milestone.message}</Text>
                    <Text style={styles.milestoneDate}>
                      {new Date(milestone.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                  <Text style={styles.milestoneWeight}>{milestone.weight.toFixed(1)} kg</Text>
                </View>
              </React.Fragment>
            ))}
          </Animated.View>
        )}

        {/* Weight History */}
        <Animated.View entering={FadeInDown.delay(550)} style={styles.historySection}>
          <Text style={styles.sectionTitle}>Weight History</Text>
          {weightEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol 
                ios_icon_name="scalemass" 
                android_material_icon_name="monitor-weight" 
                size={48} 
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No weight entries yet</Text>
              <Text style={styles.emptySubtext}>Tap &quot;Log Weight&quot; to add your first entry</Text>
            </View>
          ) : (
            [...weightEntries].reverse().map((entry, index) => (
              <React.Fragment key={index}>
                <View style={styles.historyCard}>
                  <View style={styles.historyIcon}>
                    <IconSymbol 
                      ios_icon_name="scalemass.fill" 
                      android_material_icon_name="monitor-weight" 
                      size={24} 
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyWeight}>{entry.weight.toFixed(1)} kg</Text>
                    <Text style={styles.historyDate}>
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })} • {entry.time}
                    </Text>
                    {entry.note && <Text style={styles.historyNote}>{entry.note}</Text>}
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteWeight(entry.id)}
                  >
                    <IconSymbol 
                      ios_icon_name="trash.fill" 
                      android_material_icon_name="delete" 
                      size={20} 
                      color={colors.error}
                    />
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            ))
          )}
        </Animated.View>
      </ScrollView>

      {/* Add Weight Modal */}
      <Modal
        visible={showAddWeightModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddWeightModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Weight</Text>
              <TouchableOpacity onPress={() => setShowAddWeightModal(false)}>
                <IconSymbol 
                  ios_icon_name="xmark.circle.fill" 
                  android_material_icon_name="cancel" 
                  size={28} 
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (kg) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 75.5"
                placeholderTextColor={colors.textSecondary}
                value={newWeight}
                onChangeText={setNewWeight}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Note (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add a note..."
                placeholderTextColor={colors.textSecondary}
                value={weightNote}
                onChangeText={setWeightNote}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleAddWeight}>
              <Text style={styles.submitButtonText}>Save Weight</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Set Goal Modal */}
      <Modal
        visible={showGoalModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
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
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.goalInfo}>
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
        </View>
      </Modal>

      {/* Set Height Modal */}
      <Modal
        visible={showHeightModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHeightModal(false)}
      >
        <View style={styles.modalOverlay}>
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
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSetHeight}>
              <Text style={styles.submitButtonText}>Update Height</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  bmiCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  bmiHeader: {
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
  editText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  bmiContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bmiValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: '800',
  },
  bmiCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bmiCategoryText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.card,
  },
  heightText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
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
    gap: 4,
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
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  chart: {
    height: 200,
    marginTop: 16,
    flexDirection: 'row',
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.accent,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalLineDash: {
    flex: 1,
  },
  goalLineText: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: '600',
    backgroundColor: colors.background,
    paddingHorizontal: 4,
  },
  dataPoints: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dataPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    marginLeft: -6,
    marginBottom: -6,
  },
  dataPointDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.card,
  },
  dataLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: colors.primary,
    transformOrigin: 'left center',
  },
  emptyChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingLeft: 40,
  },
  xAxisLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButtonWrapper: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0px 4px 12px rgba(41, 128, 185, 0.3)',
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  milestonesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  milestoneCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  milestoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneMessage: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  milestoneDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  milestoneWeight: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
  },
  historySection: {
    marginBottom: 24,
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyWeight: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  historyNote: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: colors.card,
    borderRadius: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
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
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    boxShadow: '0px 4px 12px rgba(41, 128, 185, 0.3)',
    elevation: 4,
  },
  submitButtonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: '700',
  },
  goalInfo: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  goalInfoText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});
