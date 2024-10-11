import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GuidedMeditationSession() {
  const router = useRouter();
  const globalRoute = useGlobalSearchParams();

  const instructions = globalRoute?.instructions || 'No instructions provided';
  const description = globalRoute?.description || 'No description available';
  const image = globalRoute?.image;
  const reward = globalRoute?.reward;
  const challengeId = globalRoute?.challengeId;

  const completeChallenge = async () => {
    try {
      const storedChallenges = await AsyncStorage.getItem('challenges');
      if (storedChallenges) {
        const challenges = JSON.parse(storedChallenges);
        const updatedChallenges = challenges.map((challenge) => {
          if (challenge.id === challengeId) {
            // Increment the number of completed sessions
            challenge.challenge.sessionsCompleted = (challenge.challenge.sessionsCompleted || 0) + 1;

            // If the completed sessions meet the challenge goal, mark it as completed
            if (challenge.challenge.sessionsCompleted >= challenge.challenge.goal) {
              challenge.challenge.completed = true;
              challenge.challenge.active = false;
              Alert.alert('Challenge Complete', `Congratulations! You've earned the ${reward}!`);
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

  const handleSessionComplete = () => {
    completeChallenge();  // Increment sessionsCompleted and check if challenge is completed
    router.back();  // Navigate back after completion
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Guided Meditation</Text>

      {image && <Image source={image} style={styles.meditationImage} />}

      <Text style={styles.descriptionText}>{description}</Text>

      <Text style={styles.instructionsText}>{instructions}</Text>

      <View style={styles.buttonContainer}>
        <Button title="I Completed It" onPress={handleSessionComplete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
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
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
