
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function WaterScreen() {
  const [waterCount, setWaterCount] = useState(6);
  const waterGoal = 8;
  const percentage = (waterCount / waterGoal) * 100;

  const addWater = () => {
    setWaterCount(prev => Math.min(prev + 1, 20));
  };

  const removeWater = () => {
    setWaterCount(prev => Math.max(prev - 1, 0));
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
          <Text style={styles.title}>Water Intake</Text>
          <Text style={styles.subtitle}>Stay hydrated throughout the day</Text>
        </Animated.View>

        {/* Main Water Card */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.mainCard}>
          <View style={styles.waterIconContainer}>
            <IconSymbol 
              ios_icon_name="drop.fill" 
              android_material_icon_name="water-drop" 
              size={80} 
              color={colors.primary}
            />
          </View>
          <Text style={styles.waterCount}>{waterCount}</Text>
          <Text style={styles.waterGoal}>/ {waterGoal} glasses</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.min(percentage, 100)}%` }]} />
            </View>
            <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={removeWater}
            >
              <IconSymbol 
                ios_icon_name="minus.circle.fill" 
                android_material_icon_name="remove-circle" 
                size={32} 
                color={colors.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addWaterButton}
              onPress={addWater}
            >
              <IconSymbol 
                ios_icon_name="plus" 
                android_material_icon_name="add" 
                size={32} 
                color={colors.card}
              />
              <Text style={styles.addWaterText}>Add Glass</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={addWater}
            >
              <IconSymbol 
                ios_icon_name="plus.circle.fill" 
                android_material_icon_name="add-circle" 
                size={32} 
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Water History */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.historySection}>
          <Text style={styles.sectionTitle}>Today&apos;s Log</Text>
          <View style={styles.glassGrid}>
            {Array.from({ length: waterGoal }).map((_, index) => (
              <React.Fragment key={index}>
                <View style={[styles.glassItem, index < waterCount && styles.glassItemFilled]}>
                  <IconSymbol 
                    ios_icon_name={index < waterCount ? "drop.fill" : "drop"} 
                    android_material_icon_name="water-drop" 
                    size={24} 
                    color={index < waterCount ? colors.primary : colors.textSecondary}
                  />
                </View>
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        {/* Benefits Card */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.benefitsCard}>
          <View style={styles.benefitsHeader}>
            <IconSymbol 
              ios_icon_name="heart.fill" 
              android_material_icon_name="favorite" 
              size={24} 
              color={colors.secondary}
            />
            <Text style={styles.benefitsTitle}>Hydration Benefits</Text>
          </View>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitBullet}>•</Text>
              <Text style={styles.benefitText}>Improves energy and brain function</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitBullet}>•</Text>
              <Text style={styles.benefitText}>Helps maintain healthy skin</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitBullet}>•</Text>
              <Text style={styles.benefitText}>Supports digestion and metabolism</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitBullet}>•</Text>
              <Text style={styles.benefitText}>Regulates body temperature</Text>
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard} onPress={() => setWaterCount(prev => Math.min(prev + 1, 20))}>
              <Text style={styles.quickActionValue}>1</Text>
              <Text style={styles.quickActionLabel}>Glass</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard} onPress={() => setWaterCount(prev => Math.min(prev + 2, 20))}>
              <Text style={styles.quickActionValue}>2</Text>
              <Text style={styles.quickActionLabel}>Glasses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard} onPress={() => setWaterCount(prev => Math.min(prev + 4, 20))}>
              <Text style={styles.quickActionValue}>4</Text>
              <Text style={styles.quickActionLabel}>Glasses</Text>
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
  mainCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    alignItems: 'center',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  waterIconContainer: {
    marginBottom: 16,
  },
  waterCount: {
    fontSize: 64,
    fontWeight: '800',
    color: colors.text,
  },
  waterGoal: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressBarBg: {
    height: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  controlButton: {
    padding: 8,
  },
  addWaterButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0px 4px 12px rgba(41, 128, 185, 0.3)',
    elevation: 4,
  },
  addWaterText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: '700',
  },
  historySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  glassGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  glassItem: {
    width: 70,
    height: 70,
    backgroundColor: colors.card,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  glassItemFilled: {
    backgroundColor: colors.highlight,
    borderColor: colors.primary,
  },
  benefitsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitBullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
    fontWeight: '700',
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  quickActions: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  quickActionValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  quickActionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
