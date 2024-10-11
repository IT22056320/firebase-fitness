import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';

const meditationSessionsData = [
  { id: '1', title: 'Mindful Breathing', duration: '1', level: 'Beginner', category: 'Focus', image: require('../../assets/images/D1.jpeg'), type: 'timer', description: 'A focused breathing session aimed at enhancing concentration and relaxation.', challenge: { goal: 5, reward: 'Relaxation Badge', completed: false, active: false } },
  { id: '2', title: 'Gratitude Meditation', duration: '10', level: 'Beginner', category: 'Positivity', image: require('../../assets/images/D2.png'), type: 'guided', description: 'Gratitude meditation helps in cultivating a sense of appreciation and positive energy.', challenge: { goal: 3, reward: 'Gratitude Badge', completed: false, active: false } },
  { id: '3', title: 'Calmness', duration: '10', level: 'Expert', category: 'Success', image: require('../../assets/images/D3.png'), type: 'timer', description: 'Calmness meditation designed to help experts practice deeper states of relaxation and focus.', challenge: { goal: 7, reward: 'Calmness Badge', completed: false, active: false } },
];

export default function GuidedMeditationSession() {
  const router = useRouter();
  const globalRoute = useGlobalSearchParams();
  // Get the instructions from route params
  const instructions = globalRoute?.instructions || 'No instructions provided';

  // Function to handle session completion
  const handleSessionComplete = () => {
    Alert.alert('Session Complete', 'Congratulations on completing the guided meditation!');
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Guided Meditation</Text>
      
      {/* Instructions Text */}
      <Text style={styles.instructionsText}>{instructions}</Text>
      
      {/* "Complete" Button */}
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
