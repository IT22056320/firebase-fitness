import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';

export default function GuidedMeditationSession({ route, navigation }) {
  // Get the instructions from route params
  const instructions = route?.params?.instructions || 'No instructions provided';

  // Function to handle session completion
  const handleSessionComplete = () => {
    Alert.alert('Session Complete', 'Congratulations on completing the guided meditation!');
    navigation.goBack('MeditationHome'); // Navigate back after completion
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
