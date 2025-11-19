
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useData } from '@/contexts/DataContext';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const moods = [
  { emoji: '😊', label: 'Great', color: colors.success, value: 5 },
  { emoji: '🙂', label: 'Good', color: colors.primary, value: 4 },
  { emoji: '😐', label: 'Okay', color: colors.accent, value: 3 },
  { emoji: '😔', label: 'Low', color: colors.textSecondary, value: 2 },
  { emoji: '😢', label: 'Bad', color: colors.secondary, value: 1 },
];

export default function MoodLogModal() {
  const { addMoodEntry } = useData();
  const [selectedMood, setSelectedMood] = useState<typeof moods[0] | null>(null);
  const [note, setNote] = useState('');

  const handleMoodSelect = (mood: typeof moods[0]) => {
    setSelectedMood(mood);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Mood selected:', mood.label);
  };

  const handleSave = () => {
    if (!selectedMood) {
      console.log('No mood selected');
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    addMoodEntry({
      mood: selectedMood.label,
      emoji: selectedMood.emoji,
      value: selectedMood.value,
      note: note.trim() || undefined,
      time: timeString,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log('Mood entry saved successfully');
    router.back();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.overlay}>
          <Animated.View entering={FadeIn} style={styles.backdrop}>
            <TouchableOpacity 
              style={styles.backdropTouchable}
              onPress={() => router.back()}
              activeOpacity={1}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.springify()} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.headerLeft}>
                <IconSymbol 
                  ios_icon_name="face.smiling"
                  android_material_icon_name="mood"
                  size={28} 
                  color={colors.primary}
                />
                <Text style={styles.modalTitle}>Log Your Mood</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.back()}
                style={styles.closeButton}
              >
                <IconSymbol 
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28} 
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.sectionLabel}>How are you feeling?</Text>
              <View style={styles.moodGrid}>
                {moods.map((mood, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      style={[
                        styles.moodButton,
                        selectedMood?.label === mood.label && [
                          styles.moodButtonSelected,
                          { borderColor: mood.color }
                        ],
                      ]}
                      onPress={() => handleMoodSelect(mood)}
                    >
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={[
                        styles.moodLabel,
                        selectedMood?.label === mood.label && { color: mood.color }
                      ]}>
                        {mood.label}
                      </Text>
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </View>

              {selectedMood && (
                <Animated.View entering={FadeInDown.delay(100)}>
                  <Text style={styles.sectionLabel}>Add a note (optional)</Text>
                  <TextInput
                    style={styles.noteInput}
                    placeholder="What's on your mind?"
                    placeholderTextColor={colors.textSecondary}
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onSubmitEditing={dismissKeyboard}
                  />
                </Animated.View>
              )}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  !selectedMood && styles.saveButtonDisabled
                ]}
                onPress={handleSave}
                disabled={!selectedMood}
              >
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={24} 
                  color={colors.card}
                />
                <Text style={styles.saveButtonText}>Save Mood</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
    boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.3)',
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  moodButton: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
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
  noteInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: colors.text,
    minHeight: 100,
    marginBottom: 24,
  },
  buttonContainer: {
    paddingTop: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0px 4px 12px rgba(102, 126, 234, 0.3)',
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '700',
  },
});
