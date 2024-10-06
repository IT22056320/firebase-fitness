import React from 'react';
import { Stack } from 'expo-router';
import HomeHeader from '../../components/HomeHeader';
import MeditationHome from '../(app)/MeditationHome';
import MeditationDetails from '../(app)/MeditationDetails';
import TimerSession from '../(app)/TimerSession';


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
        name="avatarC"
        options={{
          headerShown: false,
        }}
      />

<Stack.Screen
        name="MeditationHome"
        options={{ title: 'Meditation' }}
      />
      <Stack.Screen
        name="MeditationDetails"
        options={{ title: 'Session Details' }}
      />
      <Stack.Screen
        name="TimerSession"
        options={{ title: 'Timer Session' }}
      />


{/* Saved Sessions Screen */}
<Stack.Screen
        name="SavedSessions"
        
        options={{ title: 'Saved Sessions' }}
      />

    </Stack>
  );
}
