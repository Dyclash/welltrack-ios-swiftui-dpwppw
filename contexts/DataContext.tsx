
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  date: string;
}

export interface Activity {
  id: string;
  name: string;
  duration: number;
  calories: number;
  time: string;
  date: string;
  icon: string;
  androidIcon: string;
}

export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  note?: string;
  time: string;
  date: string;
  icon: string;
  androidIcon: string;
}

export interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  value: number;
  note?: string;
  time: string;
  date: string;
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  time: string;
  note?: string;
}

export interface WeightGoal {
  targetWeight: number;
  startWeight: number;
  startDate: string;
  targetDate: string;
}

export interface Milestone {
  id: string;
  weight: number;
  date: string;
  message: string;
}

interface DataContextType {
  meals: Meal[];
  activities: Activity[];
  symptoms: Symptom[];
  moodEntries: MoodEntry[];
  weightEntries: WeightEntry[];
  weightGoal: WeightGoal | null;
  milestones: Milestone[];
  height: number;
  nickname: string;
  addMeal: (meal: Omit<Meal, 'id' | 'date'>) => void;
  deleteMeal: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => void;
  deleteActivity: (id: string) => void;
  addSymptom: (symptom: Omit<Symptom, 'id' | 'date'>) => void;
  deleteSymptom: (id: string) => void;
  addMoodEntry: (mood: Omit<MoodEntry, 'id' | 'date'>) => void;
  deleteMoodEntry: (id: string) => void;
  addWeightEntry: (entry: Omit<WeightEntry, 'id' | 'date' | 'time'>) => void;
  deleteWeightEntry: (id: string) => void;
  setWeightGoal: (goal: WeightGoal) => void;
  setHeight: (height: number) => void;
  setNickname: (nickname: string) => void;
  getCurrentWeight: () => number | null;
  getBMI: () => number | null;
  getBMICategory: () => string;
  getWeightProgress: () => number;
  getTodaysMeals: () => Meal[];
  getTodaysActivities: () => Activity[];
  getTodaysSymptoms: () => Symptom[];
  getTodaysMoodEntries: () => MoodEntry[];
  exportData: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [nickname, setNicknameState] = useState<string>('');
  const [meals, setMeals] = useState<Meal[]>([
    { 
      id: '1', 
      name: 'Oatmeal with berries', 
      calories: 350, 
      protein: 12, 
      carbs: 58, 
      fat: 8, 
      time: '8:30 AM',
      date: new Date().toDateString()
    },
    { 
      id: '2', 
      name: 'Grilled chicken salad', 
      calories: 550, 
      protein: 45, 
      carbs: 32, 
      fat: 22, 
      time: '12:45 PM',
      date: new Date().toDateString()
    },
    { 
      id: '3', 
      name: 'Salmon with vegetables', 
      calories: 550, 
      protein: 42, 
      carbs: 28, 
      fat: 26, 
      time: '7:00 PM',
      date: new Date().toDateString()
    },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    { 
      id: '1', 
      name: 'Morning Run', 
      duration: 30, 
      calories: 320, 
      time: '7:00 AM', 
      icon: 'figure.run', 
      androidIcon: 'directions-run',
      date: new Date().toDateString()
    },
    { 
      id: '2', 
      name: 'Yoga Session', 
      duration: 45, 
      calories: 180, 
      time: '6:00 PM', 
      icon: 'figure.yoga', 
      androidIcon: 'self-improvement',
      date: new Date().toDateString()
    },
  ]);

  const [symptoms, setSymptoms] = useState<Symptom[]>([]);

  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  const [height, setHeightState] = useState<number>(170);

  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([
    {
      id: '1',
      weight: 75.5,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toDateString(),
      time: '8:00 AM',
      note: 'Starting weight'
    },
    {
      id: '2',
      weight: 74.8,
      date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toDateString(),
      time: '8:15 AM',
    },
    {
      id: '3',
      weight: 74.2,
      date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toDateString(),
      time: '8:10 AM',
    },
    {
      id: '4',
      weight: 73.8,
      date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toDateString(),
      time: '8:05 AM',
    },
    {
      id: '5',
      weight: 73.5,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toDateString(),
      time: '8:20 AM',
    },
    {
      id: '6',
      weight: 73.2,
      date: new Date().toDateString(),
      time: '8:00 AM',
      note: 'Feeling great!'
    },
  ]);

  const [weightGoal, setWeightGoalState] = useState<WeightGoal | null>({
    targetWeight: 70,
    startWeight: 75.5,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toDateString(),
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toDateString(),
  });

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      weight: 75,
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toDateString(),
      message: 'Lost first 0.5 kg! 🎉'
    },
    {
      id: '2',
      weight: 74,
      date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toDateString(),
      message: 'Down 1.5 kg from start! 💪'
    },
    {
      id: '3',
      weight: 73,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toDateString(),
      message: 'Amazing progress! 2.5 kg lost! 🌟'
    },
  ]);

  const addMeal = (meal: Omit<Meal, 'id' | 'date'>) => {
    const newMeal: Meal = {
      ...meal,
      id: Date.now().toString(),
      date: new Date().toDateString(),
    };
    setMeals(prev => [...prev, newMeal]);
    console.log('Meal added:', newMeal);
  };

  const deleteMeal = (id: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== id));
    console.log('Meal deleted:', id);
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'date'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      date: new Date().toDateString(),
    };
    setActivities(prev => [...prev, newActivity]);
    console.log('Activity added:', newActivity);
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
    console.log('Activity deleted:', id);
  };

  const addSymptom = (symptom: Omit<Symptom, 'id' | 'date'>) => {
    const newSymptom: Symptom = {
      ...symptom,
      id: Date.now().toString(),
      date: new Date().toDateString(),
    };
    setSymptoms(prev => [...prev, newSymptom]);
    console.log('Symptom added:', newSymptom);
  };

  const deleteSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(symptom => symptom.id !== id));
    console.log('Symptom deleted:', id);
  };

  const addMoodEntry = (mood: Omit<MoodEntry, 'id' | 'date'>) => {
    const newMoodEntry: MoodEntry = {
      ...mood,
      id: Date.now().toString(),
      date: new Date().toDateString(),
    };
    setMoodEntries(prev => [...prev, newMoodEntry]);
    console.log('Mood entry added:', newMoodEntry);
  };

  const deleteMoodEntry = (id: string) => {
    setMoodEntries(prev => prev.filter(entry => entry.id !== id));
    console.log('Mood entry deleted:', id);
  };

  const addWeightEntry = (entry: Omit<WeightEntry, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    const newEntry: WeightEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toDateString(),
      time: timeString,
    };
    
    setWeightEntries(prev => {
      const updated = [...prev, newEntry].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      return updated;
    });

    const currentWeight = newEntry.weight;
    const startWeight = weightGoal?.startWeight || currentWeight;
    const weightLost = startWeight - currentWeight;

    if (weightLost >= 0.5 && weightLost < 1) {
      const milestoneExists = milestones.some(m => m.weight === Math.floor(currentWeight));
      if (!milestoneExists) {
        const newMilestone: Milestone = {
          id: Date.now().toString(),
          weight: currentWeight,
          date: new Date().toDateString(),
          message: 'Lost first 0.5 kg! 🎉'
        };
        setMilestones(prev => [...prev, newMilestone]);
      }
    } else if (weightLost >= 1) {
      const milestoneWeight = Math.floor(currentWeight);
      const milestoneExists = milestones.some(m => m.weight === milestoneWeight);
      if (!milestoneExists) {
        const newMilestone: Milestone = {
          id: Date.now().toString(),
          weight: currentWeight,
          date: new Date().toDateString(),
          message: `Down ${weightLost.toFixed(1)} kg from start! 💪`
        };
        setMilestones(prev => [...prev, newMilestone]);
      }
    }

    console.log('Weight entry added:', newEntry);
  };

  const deleteWeightEntry = (id: string) => {
    setWeightEntries(prev => prev.filter(entry => entry.id !== id));
    console.log('Weight entry deleted:', id);
  };

  const setWeightGoal = (goal: WeightGoal) => {
    setWeightGoalState(goal);
    console.log('Weight goal set:', goal);
  };

  const setHeight = (newHeight: number) => {
    setHeightState(newHeight);
    console.log('Height set:', newHeight);
  };

  const setNickname = (newNickname: string) => {
    setNicknameState(newNickname);
    console.log('Nickname set:', newNickname);
  };

  const getCurrentWeight = (): number | null => {
    if (weightEntries.length === 0) return null;
    const sorted = [...weightEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0].weight;
  };

  const getBMI = (): number | null => {
    const currentWeight = getCurrentWeight();
    if (!currentWeight || !height) return null;
    const heightInMeters = height / 100;
    return currentWeight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (): string => {
    const bmi = getBMI();
    if (!bmi) return 'Unknown';
    
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getWeightProgress = (): number => {
    if (!weightGoal) return 0;
    const currentWeight = getCurrentWeight();
    if (!currentWeight) return 0;

    const totalToLose = weightGoal.startWeight - weightGoal.targetWeight;
    const lostSoFar = weightGoal.startWeight - currentWeight;
    
    if (totalToLose === 0) return 100;
    return Math.min((lostSoFar / totalToLose) * 100, 100);
  };

  const getTodaysMeals = () => {
    const today = new Date().toDateString();
    return meals.filter(meal => meal.date === today);
  };

  const getTodaysActivities = () => {
    const today = new Date().toDateString();
    return activities.filter(activity => activity.date === today);
  };

  const getTodaysSymptoms = () => {
    const today = new Date().toDateString();
    return symptoms.filter(symptom => symptom.date === today);
  };

  const getTodaysMoodEntries = () => {
    const today = new Date().toDateString();
    return moodEntries.filter(entry => entry.date === today);
  };

  const exportData = (): string => {
    const data = {
      exportDate: new Date().toISOString(),
      nickname: nickname || 'User',
      profile: {
        height,
        currentWeight: getCurrentWeight(),
        bmi: getBMI(),
        bmiCategory: getBMICategory(),
      },
      weightGoal,
      weightEntries,
      milestones,
      meals,
      activities,
      symptoms,
      moodEntries,
      summary: {
        totalMeals: meals.length,
        totalActivities: activities.length,
        totalSymptoms: symptoms.length,
        totalMoodEntries: moodEntries.length,
        totalWeightEntries: weightEntries.length,
        weightProgress: getWeightProgress(),
      }
    };
    return JSON.stringify(data, null, 2);
  };

  return (
    <DataContext.Provider
      value={{
        meals,
        activities,
        symptoms,
        moodEntries,
        weightEntries,
        weightGoal,
        milestones,
        height,
        nickname,
        addMeal,
        deleteMeal,
        addActivity,
        deleteActivity,
        addSymptom,
        deleteSymptom,
        addMoodEntry,
        deleteMoodEntry,
        addWeightEntry,
        deleteWeightEntry,
        setWeightGoal,
        setHeight,
        setNickname,
        getCurrentWeight,
        getBMI,
        getBMICategory,
        getWeightProgress,
        getTodaysMeals,
        getTodaysActivities,
        getTodaysSymptoms,
        getTodaysMoodEntries,
        exportData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
