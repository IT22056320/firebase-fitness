import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);

  // Load challenges from AsyncStorage
  const loadChallenges = async () => {
    try {
      const storedChallenges = await AsyncStorage.getItem('challenges');
      if (storedChallenges) {
        setChallenges(JSON.parse(storedChallenges));
      }
    } catch (error) {
      console.error('Failed to load challenges:', error);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  // Save challenges to AsyncStorage
  const saveChallenges = async (updatedChallenges) => {
    try {
      await AsyncStorage.setItem('challenges', JSON.stringify(updatedChallenges));
    } catch (error) {
      console.error('Failed to save challenges:', error);
    }
  };

  // Restart challenge function
  const restartChallenge = (challengeId) => {
    const updatedChallenges = challenges.map((challenge) => {
      if (challenge.id === challengeId) {
        challenge.challenge.active = true;
        challenge.challenge.completed = false;
        challenge.challenge.sessionsCompleted = 0; // Reset progress
      }
      return challenge;
    });

    setChallenges(updatedChallenges);
    saveChallenges(updatedChallenges);
    alert('Challenge restarted!'); // Notify user
  };

  const activeChallenges = challenges.filter((session) => session.challenge.active && !session.challenge.completed);
  const completedChallenges = challenges.filter((session) => session.challenge.completed);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Challenges</Text>

      {/* Active Challenges */}
      <Text style={styles.sectionHeaderText}>Active Challenges</Text>
      <FlatList
        data={activeChallenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.challengeCard}>
            <Text style={styles.challengeTitle}>{item.title}</Text>
            <Text style={styles.challengeGoal}>Goal: Complete {item.challenge.goal} sessions</Text>
            <Text style={styles.challengeReward}>Reward: {item.challenge.reward}</Text>
            <Text style={styles.challengeProgress}>
              Progress: {item.challenge.sessionsCompleted || 0}/{item.challenge.goal}
            </Text>
            <Text style={styles.statusText}>Status: In Progress</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No active challenges.</Text>}
      />

      {/* Completed Challenges */}
      <Text style={styles.sectionHeaderText}>Completed Challenges</Text>
      <FlatList
        data={completedChallenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.challengeCard}>
            <Text style={styles.challengeTitle}>{item.title}</Text>
            <Text style={styles.challengeGoal}>Goal: Complete {item.challenge.goal} sessions</Text>
            <Text style={styles.challengeReward}>Reward: {item.challenge.reward}</Text>
            <Text style={styles.statusText}>Status: Completed</Text>

            {/* Restart Button */}
            <TouchableOpacity
              style={styles.restartButton}
              onPress={() => restartChallenge(item.id)} // Restart challenge on button press
            >
              <Text style={styles.restartButtonText}>Restart Challenge</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>No completed challenges.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  challengeCard: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  challengeGoal: {
    fontSize: 16,
    color: '#6B7280',
    marginVertical: 5,
  },
  challengeReward: {
    fontSize: 14,
    color: '#10B981',
  },
  challengeProgress: {
    fontSize: 14,
    color: '#FFA500',
    marginTop: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#FFA500',
    marginTop: 10,
  },
  restartButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  restartButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
