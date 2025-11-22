
import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';

export function usePedometer() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [todayStepCount, setTodayStepCount] = useState(0);
  const [stepOffset, setStepOffset] = useState(0);

  useEffect(() => {
    let subscription: any = null;

    const subscribe = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(isAvailable);
        console.log('Pedometer available:', isAvailable);

        if (isAvailable) {
          // Get today's steps (from midnight to now)
          const end = new Date();
          const start = new Date();
          start.setHours(0, 0, 0, 0); // Set to midnight

          try {
            const todayStepCountResult = await Pedometer.getStepCountAsync(start, end);
            if (todayStepCountResult) {
              setTodayStepCount(todayStepCountResult.steps);
              setCurrentStepCount(Math.max(0, todayStepCountResult.steps - stepOffset));
              console.log('Today steps:', todayStepCountResult.steps);
            }
          } catch (error) {
            console.log('Error getting step count:', error);
          }

          // Watch for step count updates
          subscription = Pedometer.watchStepCount(result => {
            console.log('Step count update:', result.steps);
            setCurrentStepCount(prev => Math.max(0, prev + result.steps));
          });
        }
      } catch (error) {
        console.log('Error setting up pedometer:', error);
      }
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [stepOffset]);

  const resetSteps = () => {
    console.log('Resetting steps. Current count:', currentStepCount);
    setStepOffset(todayStepCount);
    setCurrentStepCount(0);
  };

  return {
    isPedometerAvailable,
    currentStepCount,
    todayStepCount,
    resetSteps,
  };
}
