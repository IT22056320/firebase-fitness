import React from 'react';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      {/* Profile Main Screen */}
      <Stack.Screen
        name="index" // This corresponds to profile/index.js
        options={{
          headerShown: false, // Hide the header for the profile main screen
        }}
      />

      {/* Avatar Creator Screen */}
      <Stack.Screen
        name="avatarCreator"
        options={{
          headerShown: false, // No header for avatar creator
        }}
      />

=


    </Stack>
  );
}
