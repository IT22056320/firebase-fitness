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
        ListEmptyComponent={<Text style={styles.emptyText}>No active challenges.</Text>}
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
        ListEmptyComponent={<Text style={styles.emptyText}>No completed challenges.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft:8,
    paddingRight:8,
    backgroundColor: '#F0E6FE',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeaderText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#6E44FF',
    marginBottom: 10,
  },
  challengeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // For Android shadow effect
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  challengeGoal: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  challengeReward: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 5,
  },
  challengeProgress: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFA500',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFA500',
    marginBottom: 10,
  },
  restartButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#6E44FF', // Purple background color
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow effect
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
