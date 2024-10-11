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
        name="SignIn"
      />
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
        name="TimerSession"
        options={{ title: 'Timer Session' }}
      />
      <Stack.Screen
        name="GuidedMeditationSession"
        options={{ title: 'Guided Session' }}
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
  name="FavoritesPage"
  options={{ title: 'Favorites' }}
/>


{/* Saved Sessions Screen */}
<Stack.Screen
        name="SavedSessions"
        
        options={{ title: 'Saved Sessions' }}
      />
<Stack.Screen
        name="CustomGoals"
        options={{
          headerShown: false, // No header for avatar creator
        }}
      />


<Stack.Screen
        name="BloodPressureHeartRate"
        options={{
          headerShown: false, // No header for avatar creator
        }}
      />
    </Stack>
  );
}
