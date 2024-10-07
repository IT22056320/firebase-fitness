import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AchievementsPage() {
  const [completedChallenges, setCompletedChallenges] = useState([]);

  useEffect(() => {
    const loadCompletedChallenges = async () => {
      try {
        const savedChallenges = await AsyncStorage.getItem('completedChallenges');
        if (savedChallenges) {
          const parsedChallenges = JSON.parse(savedChallenges);
          const completed = parsedChallenges.filter(challenge => challenge.completed);
          setCompletedChallenges(completed);
        }
      } catch (error) {
        console.error('Error loading completed challenges:', error);
      }
    };

    loadCompletedChallenges();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Achievements</Text>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        {completedChallenges.length > 0 ? (
          completedChallenges.map((challenge, index) => (
            <View key={index} style={styles.achievementItem}>
              <Text style={styles.achievementText}>
                {challenge.reward} (Completed {challenge.goal} times)
              </Text>
              <Text style={styles.achievementDetails}>Goal: {challenge.goal}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noAchievementsText}>No achievements yet</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6E44FF',
  },
  achievementItem: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  achievementText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementDetails: {
    fontSize: 16,
    color: '#555',
  },
  noAchievementsText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 50,
  },
});
