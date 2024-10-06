import React from 'react';
import { Stack } from 'expo-router';
import HomeHeader from '../../components/HomeHeader';

export default function _layout() {
  return (
    <Stack>
      {/* Home screen */}
      <Stack.Screen
        name="Home"
        options={{
          header: () => <HomeHeader />,
        }}
      />
  <Stack.Screen
        name="fitnessJournal"
        options={{ headerTitle: 'Fitness Journal' }}
      />
      {/* Exercises modal screen */}
      <Stack.Screen
        name="exercises"
        options={{
          presentation: 'fullScreenModal',
        }}
      />

      {/* Profile Screen */}
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false, // Removes the header
        }}
      />

      {/* Settings Screen */}
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false, // Removes the header
        }}
      />

      {/* BMI Calculator Screen */}
      <Stack.Screen
        name="bmiCalculator"
        options={{
          headerShown: false, // Removes the header
        }}
      />

      {/* Avatar Creator Screen */}
      <Stack.Screen
        name="avatarCreator"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
