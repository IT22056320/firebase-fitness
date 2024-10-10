import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ChallengesPage() {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadActiveChallenges();
  }, []);

  const loadActiveChallenges = async () => {
    try {
      const savedChallenges = await AsyncStorage.getItem('activeChallenges');
      if (savedChallenges) {
        setActiveChallenges(JSON.parse(savedChallenges));
      }
    } catch (error) {
      console.error('Error loading active challenges:', error);
    }
  };

  const navigateToSession = (session) => {
    if (session.type === 'timer') {
      router.push({
        pathname: '/TimerMeditationSession',
        params: { session: JSON.stringify(session) },
      });
    } else {
      router.push({
        pathname: '/GuidedMeditationSession',
        params: { session: JSON.stringify(session) },
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Active Challenges</Text>
      {activeChallenges.length > 0 ? (
        activeChallenges.map((challenge) => (
          <View key={challenge.id} style={styles.challengeContainer}>
            <TouchableOpacity onPress={() => navigateToSession(challenge)}>
              <Image source={challenge.image} style={styles.challengeImage} />
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeGoal}>Goal: Complete {challenge.challenge.goal} times</Text>
                <Text style={styles.challengeReward}>Reward: {challenge.challenge.reward}</Text>
                <Text style={styles.challengeStatus}>
                  {challenge.challenge.completed ? 'Completed 🏆' : 'In Progress 🚀'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noChallengesText}>No active challenges available.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0E6FE',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4B4B4B',
  },
  challengeContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  challengeImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  challengeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  challengeGoal: {
    fontSize: 14,
    color: 'blue',
  },
  challengeReward: {
    fontSize: 14,
    color: 'green',
  },
  challengeStatus: {
    fontSize: 14,
    color: '#555',
  },
  noChallengesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});
