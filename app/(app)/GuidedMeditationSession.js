import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
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
            challenge.challenge.sessionsCompleted = (challenge.challenge.sessionsCompleted || 0) + 1;
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
    completeChallenge();
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Guided Meditation</Text>

      {image && <Image source={image} style={styles.meditationImage} />}

      <Text style={styles.descriptionText}>{description}</Text>

      <Text style={styles.instructionsText}>{instructions}</Text>

      <View style={styles.buttonContainer}>
        {/* Custom Button */}
        <TouchableOpacity style={styles.buttonStyle} onPress={handleSessionComplete}>
          <Text style={styles.buttonText}>I Completed It</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F0E6FE' },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  meditationImage: { width: '100%', height: 250, borderRadius: 10, marginBottom: 20 },
  descriptionText: { fontSize: 18, lineHeight: 28, color: '#4B5563', marginBottom: 20 },
  instructionsText: { fontSize: 18, lineHeight: 28, color: '#4B5563', marginBottom: 20 },
  buttonContainer: { marginTop: 20, alignItems: 'center',paddingBottom:40 },
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
