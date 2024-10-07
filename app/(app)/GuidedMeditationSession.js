import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GuidedMeditationSession() {
  const params = useLocalSearchParams();
  const session = params.session ? JSON.parse(params.session) : null;

  const updateChallengeProgress = async (session) => {
    try {
      const challenges = await AsyncStorage.getItem('completedChallenges');
      let parsedChallenges = challenges ? JSON.parse(challenges) : [];
      
      const challengeIndex = parsedChallenges.findIndex(challenge => challenge.id === session.id);

      if (challengeIndex >= 0) {
        parsedChallenges[challengeIndex].progress += 1;
      } else {
        parsedChallenges.push({ id: session.id, progress: 1, goal: session.challenge.goal, reward: session.challenge.reward });
      }

      const updatedChallenges = parsedChallenges.map(challenge => {
        if (challenge.progress >= challenge.goal) {
          challenge.completed = true;
        }
        return challenge;
      });

      await AsyncStorage.setItem('completedChallenges', JSON.stringify(updatedChallenges));

      alert(`You've completed the ${session.title} session!`);
    } catch (error) {
      console.error('Error updating challenge progress:', error);
    }
  };

  const handleSessionCompletion = () => {
    updateChallengeProgress(session);
    alert(`You've completed the ${session.title} session!`);
  };
  

  if (!session) {
    return (
      <View style={styles.container}>
        <Text>Session not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>{session.title}</Text>
        <Image source={session.image} style={styles.image} />
        <Text style={styles.description}>{session.description}</Text>
        <Text style={styles.instructionsTitle}>Instructions</Text>
        <Text style={styles.instructions}>{session.instructions}</Text>
      </ScrollView>

      <TouchableOpacity onPress={handleSessionCompletion} style={styles.completeButton}>
        <Text style={styles.completeButtonText}>Complete Session</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: hp(4), fontWeight: 'bold', marginBottom: 10 },
  image: { width: '100%', height: hp(25), marginBottom: 20 },
  description: { fontSize: hp(2.2), color: '#333', textAlign: 'justify', marginBottom: 20 },
  instructionsTitle: { fontSize: hp(3), fontWeight: 'bold', marginBottom: 10 },
  instructions: { fontSize: hp(2.2), color: '#555', textAlign: 'justify' },
  completeButton: {
    backgroundColor: '#6E44FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
  },
});
