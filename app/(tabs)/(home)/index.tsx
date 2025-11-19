
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width } = Dimensions.get('window');

interface DailyStats {
  calories: { current: number; goal: number };
  water: { current: number; goal: number };
  steps: { current: number; goal: number };
  weight: number;
}

export default function HomeScreen() {
  const [dailyStats] = useState<DailyStats>({
    calories: { current: 1450, goal: 2000 },
    water: { current: 6, goal: 8 },
    steps: { current: 7234, goal: 10000 },
    weight: 165.5,
  });

  const caloriePercentage = (dailyStats.calories.current / dailyStats.calories.goal) * 100;
  const waterPercentage = (dailyStats.water.current / dailyStats.water.goal) * 100;
  const stepsPercentage = (dailyStats.steps.current / dailyStats.steps.goal) * 100;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <Text style={styles.greeting}>Good Morning!</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </Animated.View>

        {/* Main Calorie Card */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.mainCard}>
          <View style={styles.calorieHeader}>
            <IconSymbol 
              ios_icon_name="flame.fill" 
              android_material_icon_name="local-fire-department" 
              size={32} 
              color={colors.secondary}
            />
            <Text style={styles.mainCardTitle}>Daily Calories</Text>
          </View>
          <View style={styles.calorieContent}>
            <Text style={styles.calorieNumber}>{dailyStats.calories.current}</Text>
            <Text style={styles.calorieGoal}>/ {dailyStats.calories.goal} kcal</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${Math.min(caloriePercentage, 100)}%` }]} />
          </View>
          <Text style={styles.remainingText}>
            {dailyStats.calories.goal - dailyStats.calories.current > 0 
              ? `${dailyStats.calories.goal - dailyStats.calories.current} kcal remaining`
              : 'Goal reached!'}
          </Text>
        </Animated.View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(300)} style={styles.statCard}>
            <IconSymbol 
              ios_icon_name="drop.fill" 
              android_material_icon_name="water-drop" 
              size={28} 
              color={colors.primary}
            />
            <Text style={styles.statValue}>{dailyStats.water.current}/{dailyStats.water.goal}</Text>
            <Text style={styles.statLabel}>Glasses</Text>
            <View style={styles.miniProgressBar}>
              <View style={[styles.miniProgress, { width: `${Math.min(waterPercentage, 100)}%`, backgroundColor: colors.primary }]} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(350)} style={styles.statCard}>
            <IconSymbol 
              ios_icon_name="figure.walk" 
              android_material_icon_name="directions-walk" 
              size={28} 
              color={colors.accent}
            />
            <Text style={styles.statValue}>{dailyStats.steps.current.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Steps</Text>
            <View style={styles.miniProgressBar}>
              <View style={[styles.miniProgress, { width: `${Math.min(stepsPercentage, 100)}%`, backgroundColor: colors.accent }]} />
            </View>
          </Animated.View>
        </View>

        {/* Today's Meals */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Meals</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mealCard}>
            <View style={styles.mealIcon}>
              <IconSymbol 
                ios_icon_name="sunrise.fill" 
                android_material_icon_name="wb-sunny" 
                size={24} 
                color={colors.accent}
              />
            </View>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>Breakfast</Text>
              <Text style={styles.mealDescription}>Oatmeal with berries</Text>
            </View>
            <Text style={styles.mealCalories}>350 kcal</Text>
          </View>

          <View style={styles.mealCard}>
            <View style={styles.mealIcon}>
              <IconSymbol 
                ios_icon_name="sun.max.fill" 
                android_material_icon_name="wb-sunny" 
                size={24} 
                color={colors.primary}
              />
            </View>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>Lunch</Text>
              <Text style={styles.mealDescription}>Grilled chicken salad</Text>
            </View>
            <Text style={styles.mealCalories}>550 kcal</Text>
          </View>

          <View style={styles.mealCard}>
            <View style={styles.mealIcon}>
              <IconSymbol 
                ios_icon_name="moon.stars.fill" 
                android_material_icon_name="nightlight" 
                size={24} 
                color={colors.secondary}
              />
            </View>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>Dinner</Text>
              <Text style={styles.mealDescription}>Salmon with vegetables</Text>
            </View>
            <Text style={styles.mealCalories}>550 kcal</Text>
          </View>
        </Animated.View>

        {/* Health Insights */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <IconSymbol 
              ios_icon_name="heart.fill" 
              android_material_icon_name="favorite" 
              size={24} 
              color={colors.secondary}
            />
            <Text style={styles.insightTitle}>Health Insight</Text>
          </View>
          <Text style={styles.insightText}>
            You&apos;re doing great! You&apos;ve maintained a balanced diet for 5 days in a row. Keep up the good work!
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
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  mainCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  calorieHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  calorieContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  calorieNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
  },
  calorieGoal: {
    fontSize: 20,
    color: colors.textSecondary,
    marginLeft: 8,
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
    backgroundColor: colors.secondary,
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
  },
  miniProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.background,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  miniProgress: {
    height: '100%',
    borderRadius: 2,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  mealCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  mealIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  mealDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  insightCard: {
    backgroundColor: colors.highlight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  insightText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
