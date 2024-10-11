import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useGlobalSearchParams } from 'expo-router';

// Import a static timer image
const timerImage = require('../../assets/images/clock.webp'); // Make sure you have this image in your assets folder

export default function TimerSession() {
  const router = useRouter();
  const globalRoute = useGlobalSearchParams();

  const duration = globalRoute?.duration || 5;
  const challengeId = globalRoute?.challengeId;
  const instructions = globalRoute?.instructions || 'No instructions provided';
  const description = globalRoute?.description || 'No description available';

  const [secondsRemaining, setSecondsRemaining] = useState(duration * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const completeChallenge = async () => {
    try {
      const storedChallenges = await AsyncStorage.getItem('challenges');
      if (storedChallenges) {
        const challenges = JSON.parse(storedChallenges);
        const updatedChallenges = challenges.map((challenge) => {
          if (challenge.id === challengeId) {
            challenge.challenge.sessionsCompleted = (challenge.challenge.sessionsCompleted || 0) + 1;
            if (challenge.challenge.sessionsCompleted >= challenge.challenge.goal) {
              challenge.challenge.completed = true;
              challenge.challenge.active = false;
              Alert.alert('Challenge Complete', 'Congratulations! You completed the challenge.');
            }
          }
          return challenge;
        });
        await AsyncStorage.setItem('challenges', JSON.stringify(updatedChallenges));
      }
    } catch (error) {
      console.error('Failed to complete challenge:', error);
    }
  };

  const handleSessionEnd = () => {
    completeChallenge();
    Alert.alert('Session Complete', 'Congratulations! You have completed the timer meditation!');
    router.back();
  };

  useEffect(() => {
    if (secondsRemaining === 0) {
      handleSessionEnd();
    }
  }, [secondsRemaining]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerText}>Timer Meditation</Text>
      
      {/* Static Timer Image */}
      <Image source={timerImage} style={styles.meditationImage} />

      <Text style={styles.descriptionText}>{description}</Text>
      <Text style={styles.instructionsText}>{instructions}</Text>
      <Text style={styles.timerText}>{Math.floor(secondsRemaining / 60)}:{String(secondsRemaining % 60).padStart(2, '0')}</Text>
      
      <TouchableOpacity style={styles.buttonStyle} onPress={handleSessionEnd}>
  <Text style={styles.buttonText}>End Session</Text>
</TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  contentContainer: {
    paddingBottom: 50, // Added padding to ensure the button is visible
  },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  meditationImage: { width: '100%', height: 250, borderRadius: 10, marginBottom: 20 },
  descriptionText: { fontSize: 18, lineHeight: 28, color: '#4B5563', marginBottom: 20 },
  instructionsText: { fontSize: 18, lineHeight: 28, color: '#4B5563', marginBottom: 20 },
  timerText: { fontSize: 48, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
  buttonContainer: {
    marginTop: 20,
    paddingBottom: 20, // Extra padding to make sure the button is not hidden
    alignItems: 'center', // Center the button horizontally
  },
  buttonStyle: {
    backgroundColor: '#6E44FF', // Beautiful purple color
    paddingVertical: 12, // Vertical padding for a nice button size
    paddingHorizontal: 30, // Horizontal padding for a wider button
    borderRadius: 25, // Rounded corners for a modern look
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Offset to position the shadow
    shadowOpacity: 0.3, // Shadow opacity for subtle effect
    shadowRadius: 4, // Blur effect for the shadow
    elevation: 5, // Elevation for Android shadow effect
  },
  buttonText: {
    color: '#FFFFFF', // White text for good contrast
    fontSize: 18, // Larger font size for better readability
    fontWeight: 'bold', // Bold text for emphasis
    textAlign: 'center', // Center the text inside the button
  },
  
});
