
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Activity {
  id: string;
  name: string;
  duration: number;
  calories: number;
  time: string;
  icon: string;
  androidIcon: string;
}

export default function ActivityScreen() {
  const [activities] = useState<Activity[]>([
    { id: '1', name: 'Morning Run', duration: 30, calories: 320, time: '7:00 AM', icon: 'figure.run', androidIcon: 'directions-run' },
    { id: '2', name: 'Yoga Session', duration: 45, calories: 180, time: '6:00 PM', icon: 'figure.yoga', androidIcon: 'self-improvement' },
  ]);

  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);
  const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0);
  const stepsGoal = 10000;
  const currentSteps = 7234;
  const stepsPercentage = (currentSteps / stepsGoal) * 100;

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
              <Text style={styles.stepsCount}>{currentSteps.toLocaleString()}</Text>
              <Text style={styles.stepsGoal}>/ {stepsGoal.toLocaleString()} steps</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${Math.min(stepsPercentage, 100)}%` }]} />
          </View>
          <Text style={styles.remainingText}>
            {stepsGoal - currentSteps > 0 
              ? `${(stepsGoal - currentSteps).toLocaleString()} steps to go!`
              : 'Goal reached! 🎉'}
          </Text>
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
          <TouchableOpacity style={styles.addButton}>
            <IconSymbol 
              ios_icon_name="plus.circle.fill" 
              android_material_icon_name="add-circle" 
              size={24} 
              color={colors.card}
            />
            <Text style={styles.addButtonText}>Log Activity</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Activities List */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.activitiesSection}>
          <Text style={styles.sectionTitle}>Today&apos;s Activities</Text>
          {activities.map((activity, index) => (
            <React.Fragment key={index}>
              <View style={styles.activityCard}>
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
            </React.Fragment>
          ))}
        </Animated.View>

        {/* Quick Activities */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.quickActivities}>
          <Text style={styles.sectionTitle}>Quick Log</Text>
          <View style={styles.quickGrid}>
            <TouchableOpacity style={styles.quickCard}>
              <IconSymbol 
                ios_icon_name="figure.run" 
                android_material_icon_name="directions-run" 
                size={32} 
                color={colors.secondary}
              />
              <Text style={styles.quickText}>Running</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard}>
              <IconSymbol 
                ios_icon_name="figure.walk" 
                android_material_icon_name="directions-walk" 
                size={32} 
                color={colors.accent}
              />
              <Text style={styles.quickText}>Walking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard}>
              <IconSymbol 
                ios_icon_name="dumbbell.fill" 
                android_material_icon_name="fitness-center" 
                size={32} 
                color={colors.primary}
              />
              <Text style={styles.quickText}>Gym</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Motivation Card */}
        <Animated.View entering={FadeInDown.delay(700)} style={styles.motivationCard}>
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
            You&apos;re 72% towards your daily step goal. A short walk after dinner will help you reach it!
          </Text>
        </Animated.View>
      </ScrollView>
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
  remainingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
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
  activitiesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
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
  quickActivities: {
    marginBottom: 24,
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
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
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
});
