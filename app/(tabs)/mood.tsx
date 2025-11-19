
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import Animated, { FadeInDown } from "react-native-reanimated";

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  time: string;
  note?: string;
}

const moods = [
  { emoji: '😊', label: 'Great', color: colors.success },
  { emoji: '🙂', label: 'Good', color: colors.primary },
  { emoji: '😐', label: 'Okay', color: colors.accent },
  { emoji: '😔', label: 'Low', color: colors.textSecondary },
  { emoji: '😢', label: 'Bad', color: colors.secondary },
];

export default function MoodScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodHistory] = useState<MoodEntry[]>([
    { id: '1', mood: 'Great', emoji: '😊', time: '9:00 AM', note: 'Had a great workout!' },
    { id: '2', mood: 'Good', emoji: '🙂', time: '2:00 PM', note: 'Productive work session' },
    { id: '3', mood: 'Okay', emoji: '😐', time: '6:00 PM' },
  ]);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <Text style={styles.title}>Mood Tracker</Text>
          <Text style={styles.subtitle}>How are you feeling today?</Text>
        </Animated.View>

        {/* Mood Selection */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.moodCard}>
          <Text style={styles.cardTitle}>Select Your Mood</Text>
          <View style={styles.moodGrid}>
            {moods.map((mood, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.moodButton,
                    selectedMood === mood.label && styles.moodButtonSelected,
                  ]}
                  onPress={() => setSelectedMood(mood.label)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
          {selectedMood && (
            <TouchableOpacity style={styles.saveButton}>
              <IconSymbol 
                ios_icon_name="checkmark.circle.fill" 
                android_material_icon_name="check-circle" 
                size={24} 
                color={colors.card}
              />
              <Text style={styles.saveButtonText}>Save Mood</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Mood Stats */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.statsCard}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>😊</Text>
              <Text style={styles.statCount}>12</Text>
              <Text style={styles.statLabel}>Great Days</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🙂</Text>
              <Text style={styles.statCount}>8</Text>
              <Text style={styles.statLabel}>Good Days</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>😐</Text>
              <Text style={styles.statCount}>3</Text>
              <Text style={styles.statLabel}>Okay Days</Text>
            </View>
          </View>
        </Animated.View>

        {/* Mood History */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.historySection}>
          <Text style={styles.sectionTitle}>Today&apos;s Log</Text>
          {moodHistory.map((entry, index) => (
            <React.Fragment key={index}>
              <View style={styles.historyCard}>
                <View style={styles.historyIcon}>
                  <Text style={styles.historyEmoji}>{entry.emoji}</Text>
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyMood}>{entry.mood}</Text>
                  <Text style={styles.historyTime}>{entry.time}</Text>
                  {entry.note && <Text style={styles.historyNote}>{entry.note}</Text>}
                </View>
              </View>
            </React.Fragment>
          ))}
        </Animated.View>

        {/* Wellness Tips */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <IconSymbol 
              ios_icon_name="lightbulb.fill" 
              android_material_icon_name="lightbulb" 
              size={24} 
              color={colors.accent}
            />
            <Text style={styles.tipsTitle}>Wellness Tips</Text>
          </View>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Take regular breaks throughout the day</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Practice deep breathing exercises</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Connect with friends and family</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Get enough sleep (7-9 hours)</Text>
            </View>
          </View>
        </Animated.View>

        {/* Symptoms Tracker */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.symptomsCard}>
          <Text style={styles.cardTitle}>Track Symptoms</Text>
          <Text style={styles.symptomsSubtitle}>Log any health symptoms you&apos;re experiencing</Text>
          <View style={styles.symptomsGrid}>
            <TouchableOpacity style={styles.symptomButton}>
              <IconSymbol 
                ios_icon_name="head.profile" 
                android_material_icon_name="face" 
                size={24} 
                color={colors.primary}
              />
              <Text style={styles.symptomText}>Headache</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.symptomButton}>
              <IconSymbol 
                ios_icon_name="bed.double.fill" 
                android_material_icon_name="hotel" 
                size={24} 
                color={colors.primary}
              />
              <Text style={styles.symptomText}>Fatigue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.symptomButton}>
              <IconSymbol 
                ios_icon_name="heart.fill" 
                android_material_icon_name="favorite" 
                size={24} 
                color={colors.primary}
              />
              <Text style={styles.symptomText}>Stress</Text>
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
  moodCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  moodButton: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0px 4px 12px rgba(41, 128, 185, 0.3)',
    elevation: 4,
  },
  saveButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '700',
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  statCount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
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
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  historyEmoji: {
    fontSize: 24,
  },
  historyInfo: {
    flex: 1,
  },
  historyMood: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  historyNote: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 16,
    color: colors.accent,
    marginRight: 8,
    fontWeight: '700',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  symptomsCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  symptomsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  symptomsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  symptomButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  symptomText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});
