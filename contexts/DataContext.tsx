
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

interface DataContextType {
  meals: Meal[];
  activities: Activity[];
  symptoms: Symptom[];
  addMeal: (meal: Omit<Meal, 'id' | 'date'>) => void;
  deleteMeal: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => void;
  deleteActivity: (id: string) => void;
  addSymptom: (symptom: Omit<Symptom, 'id' | 'date'>) => void;
  deleteSymptom: (id: string) => void;
  getTodaysMeals: () => Meal[];
  getTodaysActivities: () => Activity[];
  getTodaysSymptoms: () => Symptom[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
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

  return (
    <DataContext.Provider
      value={{
        meals,
        activities,
        symptoms,
        addMeal,
        deleteMeal,
        addActivity,
        deleteActivity,
        addSymptom,
        deleteSymptom,
        getTodaysMeals,
        getTodaysActivities,
        getTodaysSymptoms,
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
