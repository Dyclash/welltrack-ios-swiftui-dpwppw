
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

export default function FoodScreen() {
  const [meals] = useState<Meal[]>([
    { id: '1', name: 'Oatmeal with berries', calories: 350, protein: 12, carbs: 58, fat: 8, time: '8:30 AM' },
    { id: '2', name: 'Grilled chicken salad', calories: 550, protein: 45, carbs: 32, fat: 22, time: '12:45 PM' },
    { id: '3', name: 'Salmon with vegetables', calories: 550, protein: 42, carbs: 28, fat: 26, time: '7:00 PM' },
  ]);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <Text style={styles.title}>Food Diary</Text>
          <Text style={styles.subtitle}>Track your daily nutrition</Text>
        </Animated.View>

        {/* Nutrition Summary */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today&apos;s Nutrition</Text>
          <View style={styles.macroGrid}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totalCalories}</Text>
              <Text style={styles.macroLabel}>Calories</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: colors.secondary }]}>{totalProtein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: colors.accent }]}>{totalCarbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: colors.primary }]}>{totalFat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </Animated.View>

        {/* Add Meal Button */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <TouchableOpacity style={styles.addButton}>
            <IconSymbol 
              ios_icon_name="plus.circle.fill" 
              android_material_icon_name="add-circle" 
              size={24} 
              color={colors.card}
            />
            <Text style={styles.addButtonText}>Log New Meal</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Meals List */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Today&apos;s Meals</Text>
          {meals.map((meal, index) => (
            <React.Fragment key={index}>
              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <View style={styles.mealTitleContainer}>
                    <IconSymbol 
                      ios_icon_name="fork.knife" 
                      android_material_icon_name="restaurant" 
                      size={20} 
                      color={colors.primary}
                    />
                    <View style={styles.mealTextContainer}>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <Text style={styles.mealTime}>{meal.time}</Text>
                    </View>
                  </View>
                  <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                </View>
                <View style={styles.macroRow}>
                  <View style={styles.macroTag}>
                    <Text style={styles.macroTagText}>P: {meal.protein}g</Text>
                  </View>
                  <View style={styles.macroTag}>
                    <Text style={styles.macroTagText}>C: {meal.carbs}g</Text>
                  </View>
                  <View style={styles.macroTag}>
                    <Text style={styles.macroTagText}>F: {meal.fat}g</Text>
                  </View>
                </View>
              </View>
            </React.Fragment>
          ))}
        </Animated.View>

        {/* Quick Add Section */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.quickAddSection}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddGrid}>
            <TouchableOpacity style={styles.quickAddCard}>
              <IconSymbol 
                ios_icon_name="cup.and.saucer.fill" 
                android_material_icon_name="coffee" 
                size={32} 
                color={colors.accent}
              />
              <Text style={styles.quickAddText}>Snack</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAddCard}>
              <IconSymbol 
                ios_icon_name="drop.fill" 
                android_material_icon_name="water-drop" 
                size={32} 
                color={colors.primary}
              />
              <Text style={styles.quickAddText}>Water</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAddCard}>
              <IconSymbol 
                ios_icon_name="camera.fill" 
                android_material_icon_name="camera-alt" 
                size={32} 
                color={colors.secondary}
              />
              <Text style={styles.quickAddText}>Scan</Text>
            </TouchableOpacity>
          </View>
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
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
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
  mealsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mealTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  mealTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  mealCalories: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 8,
  },
  macroTag: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  macroTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  quickAddSection: {
    marginBottom: 24,
  },
  quickAddGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAddCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  quickAddText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
});
