
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useData } from "@/contexts/DataContext";

export default function FoodScreen() {
  const { getTodaysMeals, addMeal, deleteMeal } = useData();
  const meals = getTodaysMeals();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  const handleAddMeal = () => {
    if (!mealName.trim()) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }
    if (!calories || isNaN(Number(calories))) {
      Alert.alert('Error', 'Please enter valid calories');
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    addMeal({
      name: mealName.trim(),
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      time: timeString,
    });

    // Reset form
    setMealName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setShowAddModal(false);
  };

  const handleDeleteMeal = (id: string, name: string) => {
    Alert.alert(
      'Delete Meal',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteMeal(id)
        },
      ]
    );
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
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
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
          {meals.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol 
                ios_icon_name="fork.knife" 
                android_material_icon_name="restaurant" 
                size={48} 
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No meals logged yet</Text>
              <Text style={styles.emptySubtext}>Tap the button above to add your first meal</Text>
            </View>
          ) : (
            meals.map((meal, index) => (
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
                    <View style={styles.mealRightContainer}>
                      <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDeleteMeal(meal.id, meal.name)}
                      >
                        <IconSymbol 
                          ios_icon_name="trash.fill" 
                          android_material_icon_name="delete" 
                          size={20} 
                          color={colors.error}
                        />
                      </TouchableOpacity>
                    </View>
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
            ))
          )}
        </Animated.View>
      </ScrollView>

      {/* Add Meal Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log New Meal</Text>
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
                <Text style={styles.inputLabel}>Meal Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Chicken Salad"
                  placeholderTextColor={colors.textSecondary}
                  value={mealName}
                  onChangeText={setMealName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Calories *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 350"
                  placeholderTextColor={colors.textSecondary}
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Protein (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 25"
                  placeholderTextColor={colors.textSecondary}
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Carbs (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 40"
                  placeholderTextColor={colors.textSecondary}
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fat (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 15"
                  placeholderTextColor={colors.textSecondary}
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleAddMeal}>
                <Text style={styles.submitButtonText}>Add Meal</Text>
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
  mealRightContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  mealCalories: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  deleteButton: {
    padding: 4,
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
