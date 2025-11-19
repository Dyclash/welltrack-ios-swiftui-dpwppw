
import React from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useData } from "@/contexts/DataContext";
import { usePedometer } from "@/hooks/usePedometer";

interface DailyStats {
  calories: { current: number; goal: number };
  water: { current: number; goal: number };
  steps: { current: number; goal: number };
  weight: number;
}

export default function HomeScreen() {
  const { getTodaysMeals, getTodaysActivities } = useData();
  const { currentStepCount, isPedometerAvailable } = usePedometer();
  const todaysMeals = getTodaysMeals();
  const todaysActivities = getTodaysActivities();

  const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const calorieGoal = 2000;

  const [dailyStats] = React.useState<DailyStats>({
    calories: { current: totalCalories, goal: calorieGoal },
    water: { current: 6, goal: 8 },
    steps: { current: currentStepCount, goal: 10000 },
    weight: 165.5,
  });

  const caloriePercentage = (totalCalories / calorieGoal) * 100;
  const waterPercentage = (dailyStats.water.current / dailyStats.water.goal) * 100;
  const stepsGoal = 10000;
  const stepsPercentage = (currentStepCount / stepsGoal) * 100;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
          </View>
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
            <Text style={styles.calorieNumber}>{totalCalories}</Text>
            <Text style={styles.calorieGoal}>/ {calorieGoal} kcal</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${Math.min(caloriePercentage, 100)}%` }]} />
          </View>
          <Text style={styles.remainingText}>
            {calorieGoal - totalCalories > 0 
              ? `${calorieGoal - totalCalories} kcal remaining`
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
            <Text style={styles.statValue}>
              {isPedometerAvailable ? currentStepCount.toLocaleString() : 'N/A'}
            </Text>
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
          
          {todaysMeals.length === 0 ? (
            <View style={styles.emptyCard}>
              <IconSymbol 
                ios_icon_name="fork.knife" 
                android_material_icon_name="restaurant" 
                size={32} 
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No meals logged yet</Text>
            </View>
          ) : (
            todaysMeals.slice(0, 3).map((meal, index) => (
              <React.Fragment key={index}>
                <View style={styles.mealCard}>
                  <View style={styles.mealIcon}>
                    <IconSymbol 
                      ios_icon_name="fork.knife" 
                      android_material_icon_name="restaurant" 
                      size={24} 
                      color={index === 0 ? colors.accent : index === 1 ? colors.primary : colors.secondary}
                    />
                  </View>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealDescription}>{meal.time}</Text>
                  </View>
                  <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                </View>
              </React.Fragment>
            ))
          )}
        </Animated.View>

        {/* Today's Activities */}
        <Animated.View entering={FadeInDown.delay(450)} style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Activities</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {todaysActivities.length === 0 ? (
            <View style={styles.emptyCard}>
              <IconSymbol 
                ios_icon_name="figure.run" 
                android_material_icon_name="directions-run" 
                size={32} 
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No activities logged yet</Text>
            </View>
          ) : (
            todaysActivities.slice(0, 2).map((activity, index) => (
              <React.Fragment key={index}>
                <View style={styles.mealCard}>
                  <View style={styles.mealIcon}>
                    <IconSymbol 
                      ios_icon_name={activity.icon} 
                      android_material_icon_name={activity.androidIcon} 
                      size={24} 
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{activity.name}</Text>
                    <Text style={styles.mealDescription}>{activity.duration} min • {activity.time}</Text>
                  </View>
                  <Text style={styles.mealCalories}>{activity.calories} kcal</Text>
                </View>
              </React.Fragment>
            ))
          )}
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
            You&apos;re doing great! You&apos;ve logged {todaysMeals.length} meal{todaysMeals.length !== 1 ? 's' : ''} and {todaysActivities.length} activit{todaysActivities.length !== 1 ? 'ies' : 'y'} today. Keep up the good work!
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
    fontWeight: '500',
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
