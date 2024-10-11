import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useGlobalSearchParams } from 'expo-router';

export default function TimerSession() {
  const router = useRouter();
  const globalRoute = useGlobalSearchParams(); // Use this to get query parameters

  const duration = globalRoute?.duration || 5; // Retrieve duration from query param
  const challengeId = globalRoute?.challengeId; // Retrieve challengeId from query param
  const instructions = globalRoute?.instructions; // Retrieve instructions from query param
  const description = globalRoute?.description; // Retrieve description from query param
  const image = globalRoute?.image; // Retrieve image from query param (this can be a local asset or uri)

  const [secondsRemaining, setSecondsRemaining] = useState(duration * 60); // Convert minutes to seconds

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
    completeChallenge(); // Mark the challenge as completed
    Alert.alert('Session Complete', 'Congratulations! You have completed the timer meditation!');
    router.back(); // Navigate back after session ends
  };

  useEffect(() => {
    if (secondsRemaining === 0) {
      handleSessionEnd();
    }
  }, [secondsRemaining]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Timer Meditation</Text>

      {/* Load image based on whether it's a local asset or a URI */}
      {typeof image === 'string' ? (
        <Image source={{ uri: image }} style={styles.meditationImage} />
      ) : (
        <Image source={image} style={styles.meditationImage} />
      )}

      <Text style={styles.descriptionText}>{description}</Text>
      <Text style={styles.instructionsText}>{instructions}</Text>

      <Text style={styles.timerText}>
        {Math.floor(secondsRemaining / 60)}:{String(secondsRemaining % 60).padStart(2, '0')}
      </Text>

      <Button title="End Session" onPress={handleSessionEnd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  meditationImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#4B5563',
    marginBottom: 20,
  },
  instructionsText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#4B5563',
    marginBottom: 20,
  },
});
