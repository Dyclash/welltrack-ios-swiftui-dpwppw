
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useData } from "@/contexts/DataContext";
import { usePedometer } from "@/hooks/usePedometer";

const activityTypes = [
  { name: 'Running', icon: 'figure.run', androidIcon: 'directions-run', defaultDuration: 30, defaultCalories: 300 },
  { name: 'Walking', icon: 'figure.walk', androidIcon: 'directions-walk', defaultDuration: 45, defaultCalories: 150 },
  { name: 'Cycling', icon: 'bicycle', androidIcon: 'directions-bike', defaultDuration: 40, defaultCalories: 280 },
  { name: 'Swimming', icon: 'figure.pool.swim', androidIcon: 'pool', defaultDuration: 30, defaultCalories: 250 },
  { name: 'Yoga', icon: 'figure.yoga', androidIcon: 'self-improvement', defaultDuration: 45, defaultCalories: 180 },
  { name: 'Gym', icon: 'dumbbell.fill', androidIcon: 'fitness-center', defaultDuration: 60, defaultCalories: 350 },
];

export default function ActivityScreen() {
  const { getTodaysActivities, addActivity, deleteActivity } = useData();
  const { currentStepCount, isPedometerAvailable, resetSteps } = usePedometer();
  const activities = getTodaysActivities();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [selectedType, setSelectedType] = useState(activityTypes[0]);

  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);
  const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0);
  const stepsGoal = 10000;
  const stepsPercentage = (currentStepCount / stepsGoal) * 100;

  const handleAddActivity = () => {
    if (!activityName.trim()) {
      Alert.alert('Error', 'Please enter an activity name');
      return;
    }
    if (!duration || isNaN(Number(duration))) {
      Alert.alert('Error', 'Please enter valid duration');
      return;
    }
    if (!calories || isNaN(Number(calories))) {
      Alert.alert('Error', 'Please enter valid calories');
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    addActivity({
      name: activityName.trim(),
      duration: Number(duration),
      calories: Number(calories),
      time: timeString,
      icon: selectedType.icon,
      androidIcon: selectedType.androidIcon,
    });

    // Reset form
    setActivityName('');
    setDuration('');
    setCalories('');
    setSelectedType(activityTypes[0]);
    setShowAddModal(false);
  };

  const handleDeleteActivity = (id: string, name: string) => {
    console.log('Delete activity button pressed - ID:', id, 'Name:', name);
    Alert.alert(
      'Delete Activity',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            console.log('Confirmed deletion for activity ID:', id);
            deleteActivity(id);
          }
        },
      ]
    );
  };

  const handleResetSteps = () => {
    Alert.alert(
      'Reset Steps',
      'Are you sure you want to reset your step count to zero? This will only reset the displayed count, not your device\'s actual step data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetSteps();
            Alert.alert('Success', 'Step count has been reset to zero');
          }
        },
      ]
    );
  };

  const handleQuickAdd = (type: typeof activityTypes[0]) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    addActivity({
      name: type.name,
      duration: type.defaultDuration,
      calories: type.defaultCalories,
      time: timeString,
      icon: type.icon,
      androidIcon: type.androidIcon,
    });

    Alert.alert('Success', `${type.name} activity added!`);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <Text style={styles.title}>Activity</Text>
          <Text style={styles.subtitle}>Track your fitness journey</Text>
        </Animated.View>

        {/* Steps Card */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.stepsCard}>
          <View style={styles.stepsHeader}>
            <IconSymbol 
              ios_icon_name="figure.walk" 
              android_material_icon_name="directions-walk" 
              size={40} 
              color={colors.accent}
            />
            <View style={styles.stepsInfo}>
              <Text style={styles.stepsCount}>
                {isPedometerAvailable ? currentStepCount.toLocaleString() : 'N/A'}
              </Text>
              <Text style={styles.stepsGoal}>/ {stepsGoal.toLocaleString()} steps</Text>
            </View>
            {isPedometerAvailable && (
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={handleResetSteps}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <IconSymbol 
                  ios_icon_name="arrow.counterclockwise" 
                  android_material_icon_name="refresh" 
                  size={20} 
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${Math.min(stepsPercentage, 100)}%` }]} />
          </View>
          <View style={styles.stepsFooter}>
            <Text style={styles.remainingText}>
              {isPedometerAvailable ? (
                stepsGoal - currentStepCount > 0 
                  ? `${(stepsGoal - currentStepCount).toLocaleString()} steps to go!`
                  : 'Goal reached! 🎉'
              ) : (
                'Pedometer not available on this device'
              )}
            </Text>
            {isPedometerAvailable && (
              <TouchableOpacity onPress={handleResetSteps}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(300)} style={styles.statCard}>
            <IconSymbol 
              ios_icon_name="flame.fill" 
              android_material_icon_name="local-fire-department" 
              size={28} 
              color={colors.secondary}
            />
            <Text style={styles.statValue}>{totalCalories}</Text>
            <Text style={styles.statLabel}>Calories Burned</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(350)} style={styles.statCard}>
            <IconSymbol 
              ios_icon_name="clock.fill" 
              android_material_icon_name="schedule" 
              size={28} 
              color={colors.primary}
            />
            <Text style={styles.statValue}>{totalDuration}</Text>
            <Text style={styles.statLabel}>Minutes Active</Text>
          </Animated.View>
        </View>

        {/* Add Activity Button */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
            <IconSymbol 
              ios_icon_name="plus.circle.fill" 
              android_material_icon_name="add-circle" 
              size={24} 
              color={colors.card}
            />
            <Text style={styles.addButtonText}>Log Activity</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Activities */}
        <Animated.View entering={FadeInDown.delay(450)} style={styles.quickActivities}>
          <Text style={styles.sectionTitle}>Quick Log</Text>
          <Text style={styles.quickSubtitle}>Tap to instantly log an activity</Text>
          <View style={styles.quickGrid}>
            {activityTypes.slice(0, 3).map((type, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity 
                  style={styles.quickCard}
                  onPress={() => handleQuickAdd(type)}
                >
                  <IconSymbol 
                    ios_icon_name={type.icon} 
                    android_material_icon_name={type.androidIcon} 
                    size={32} 
                    color={index === 0 ? colors.secondary : index === 1 ? colors.accent : colors.primary}
                  />
                  <Text style={styles.quickText}>{type.name}</Text>
                  <Text style={styles.quickDetails}>{type.defaultDuration} min</Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        {/* Activities List */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.activitiesSection}>
          <Text style={styles.sectionTitle}>Today&apos;s Activities</Text>
          {activities.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol 
                ios_icon_name="figure.run" 
                android_material_icon_name="directions-run" 
                size={48} 
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No activities logged yet</Text>
              <Text style={styles.emptySubtext}>Use Quick Log or tap the button above to add your first activity</Text>
            </View>
          ) : (
            activities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <View style={styles.activityCard}>
                  <View style={styles.activityContent}>
                    <View style={styles.activityIcon}>
                      <IconSymbol 
                        ios_icon_name={activity.icon} 
                        android_material_icon_name={activity.androidIcon} 
                        size={24} 
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityName}>{activity.name}</Text>
                      <Text style={styles.activityTime}>{activity.time}</Text>
                    </View>
                    <View style={styles.activityStats}>
                      <Text style={styles.activityDuration}>{activity.duration} min</Text>
                      <Text style={styles.activityCalories}>{activity.calories} kcal</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => {
                      console.log('Delete button tapped for:', activity.id, activity.name);
                      handleDeleteActivity(activity.id, activity.name);
                    }}
                    activeOpacity={0.7}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
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

        {/* Motivation Card */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.motivationCard}>
          <View style={styles.motivationHeader}>
            <IconSymbol 
              ios_icon_name="star.fill" 
              android_material_icon_name="star" 
              size={24} 
              color={colors.accent}
            />
            <Text style={styles.motivationTitle}>Keep Moving!</Text>
          </View>
          <Text style={styles.motivationText}>
            {isPedometerAvailable && currentStepCount > 0 
              ? `You're ${Math.round(stepsPercentage)}% towards your daily step goal. ${stepsPercentage < 100 ? 'A short walk after dinner will help you reach it!' : 'Amazing work! 🎉'}`
              : 'Stay active and log your workouts to track your progress!'}
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Add Activity Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Activity</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <IconSymbol 
                  ios_icon_name="xmark.circle.fill" 
                  android_material_icon_name="cancel" 
                  size={28} 
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Activity Type</Text>
                <View style={styles.typeGrid}>
                  {activityTypes.map((type, index) => (
                    <React.Fragment key={index}>
                      <TouchableOpacity
                        style={[
                          styles.typeCard,
                          selectedType.name === type.name && styles.typeCardSelected
                        ]}
                        onPress={() => {
                          setSelectedType(type);
                          setActivityName(type.name);
                          setDuration(type.defaultDuration.toString());
                          setCalories(type.defaultCalories.toString());
                        }}
                      >
                        <IconSymbol 
                          ios_icon_name={type.icon} 
                          android_material_icon_name={type.androidIcon} 
                          size={24} 
                          color={selectedType.name === type.name ? colors.card : colors.primary}
                        />
                        <Text style={[
                          styles.typeText,
                          selectedType.name === type.name && styles.typeTextSelected
                        ]}>
                          {type.name}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Activity Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Morning Run"
                  placeholderTextColor={colors.textSecondary}
                  value={activityName}
                  onChangeText={setActivityName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Duration (minutes) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 30"
                  placeholderTextColor={colors.textSecondary}
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Calories Burned *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 250"
                  placeholderTextColor={colors.textSecondary}
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleAddActivity}>
                <Text style={styles.submitButtonText}>Add Activity</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
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
  stepsCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepsInfo: {
    marginLeft: 16,
    flex: 1,
  },
  stepsCount: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
  },
  stepsGoal: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: colors.accent,
    borderRadius: 6,
  },
  stepsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    flex: 1,
  },
  resetText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
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
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(41, 128, 185, 0.3)',
    elevation: 4,
  },
  addButtonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  quickActivities: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  quickSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    fontWeight: '500',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  quickText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  quickDetails: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  activitiesSection: {
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activityStats: {
    alignItems: 'flex-end',
  },
  activityDuration: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  activityCalories: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  motivationCard: {
    backgroundColor: colors.highlight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  motivationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  motivationText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
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
    paddingHorizontal: 20,
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
    maxHeight: '80%',
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
  modalScroll: {
    maxHeight: 500,
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  typeTextSelected: {
    color: colors.card,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: '700',
  },
});
