import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    loadChallenges();
  }, []);
  
  const loadChallenges = async () => {
    try {
      const savedChallenges = await AsyncStorage.getItem('completedChallenges');
      if (savedChallenges) {
        setChallenges(JSON.parse(savedChallenges));
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Challenges</Text>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        {challenges.length > 0 ? (
          challenges.map((challenge, index) => (
            <View key={index} style={styles.challengeContainer}>
              <Text style={styles.challengeText}>Goal: Complete {challenge.goal} times</Text>
              <Text style={styles.challengeRewardText}>Reward: {challenge.reward}</Text>
              <Text style={styles.challengeStatusText}>
                {challenge.completed ? 'Completed 🏆' : `Progress: ${challenge.progress || 0}/${challenge.goal} 🚀`}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noChallengesText}>No active challenges. Start one from the home page!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  challengeContainer: { backgroundColor: '#F0F0F0', borderRadius: 10, padding: 20, marginBottom: 10 },
  challengeText: { fontSize: 18 },
  challengeRewardText: { fontSize: 16, color: 'green' },
  challengeStatusText: { fontSize: 16, color: 'blue' },
  noChallengesText: { fontSize: 18, color: 'gray', textAlign: 'center', marginTop: 50 },
});
