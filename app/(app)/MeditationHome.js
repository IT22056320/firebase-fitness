import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient'; // Import for gradients
import BottomNav from '../../components/BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const meditationSessionsData = [
  { id: '1', title: 'Mindful Breathing', duration: '1', level: 'Beginner', category: 'Focus', image: require('../../assets/images/D1.jpeg'), type: 'timer', description: 'A focused breathing session aimed at enhancing concentration and relaxation.', instructions: '1. Find a quiet place... 2. Start breathing slowly...', challenge: { goal: 5, reward: 'Relaxation Badge', completed: false } },
  { id: '2', title: 'Gratitude Meditation', duration: '10', level: 'Beginner', category: 'Positivity', image: require('../../assets/images/D2.png'), type: 'guided', description: 'Gratitude meditation helps in cultivating a sense of appreciation and positive energy.', instructions: '1. Sit comfortably... 2. Reflect on things you are grateful for...', challenge: { goal: 3, reward: 'Gratitude Badge', completed: false } },
  { id: '3', title: 'Calmness', duration: '10', level: 'Expert', category: 'Success', image: require('../../assets/images/D3.png'), type: 'timer', description: 'Calmness meditation designed to help experts practice deeper states of relaxation and focus.', instructions: '1. Sit quietly... 2. Focus on releasing tension...', challenge: { goal: 7, reward: 'Calmness Badge', completed: false } },
  { id: '4', title: 'Focus Booster', duration: '15', level: 'Intermediate', category: 'Focus', image: require('../../assets/images/D4.jpeg'), type: 'timer', description: 'Focus booster meditation for intermediate practitioners aiming to enhance focus.', instructions: '1. Sit down... 2. Breathe and focus on a single thought...', challenge: { goal: 4, reward: 'Focus Badge', completed: false } },
  { id: '5', title: 'Positive Affirmations', duration: '20', level: 'Beginner', category: 'Positivity', image: require('../../assets/images/D5.jpg'), type: 'guided', description: 'Positive affirmations to help cultivate self-belief and positive mindset.', instructions: '1. Repeat positive affirmations like “I am capable”...', challenge: { goal: 6, reward: 'Affirmation Badge', completed: false } },

  
  { id: '6', title: 'Stress Relief Meditation', duration: '12', level: 'Intermediate', category: 'Physical Health', image: require('../../assets/images/G1.jpeg'), type: 'guided', description: 'A session focused on releasing physical and mental stress.', instructions: '1. Sit in a comfortable position... 2. Breathe deeply and focus on each part of your body, relaxing it...', challenge: { goal: 3, reward: 'Stress-Free Badge', completed: false } },
  { id: '7', title: 'Energy Booster', duration: '10', level: 'Beginner', category: 'Physical Health', image: require('../../assets/images/G2.jpeg'), type: 'timer', description: 'This session helps you re-energize and gain focus for the day.', instructions: '1. Find a calm space... 2. Visualize energy flowing through your body...', challenge: { goal: 5, reward: 'Energy Badge', completed: false } },
  { id: '8', title: 'Self-Compassion Meditation', duration: '8', level: 'Intermediate', category: 'Positivity', image: require('../../assets/images/G3.jpeg'), type: 'guided', description: 'This meditation encourages self-kindness and reduces negative self-talk.', instructions: '1. Sit comfortably... 2. Repeat kind phrases towards yourself...', challenge: { goal: 4, reward: 'Compassion Badge', completed: false } },
  { id: '9', title: 'Creative Visualization', duration: '15', level: 'Advanced', category: 'Focus', image: require('../../assets/images/G4.jpeg'), type: 'guided', description: 'Use your imagination to visualize success and reach your goals.', instructions: '1. Visualize yourself achieving your goals... 2. Focus on positive outcomes...', challenge: { goal: 6, reward: 'Visualization Badge', completed: false } },
  { id: '10', title: 'Sleep Meditation', duration: '20', level: 'Beginner', category: 'Physical Health', image: require('../../assets/images/G5.jpeg'), type: 'guided', description: 'A calming session to help you relax and prepare for a good night’s sleep.', instructions: '1. Lie down in a comfortable position... 2. Focus on slowing your breath and releasing tension...', challenge: { goal: 7, reward: 'Sleep Badge', completed: false } },
  { id: '11', title: 'Emotional Balance', duration: '18', level: 'Advanced', category: 'Success', image: require('../../assets/images/G6.jpeg'), type: 'guided', description: 'A meditation aimed at maintaining emotional balance during difficult situations.', instructions: '1. Sit quietly... 2. Focus on your emotions and gently bring them to a neutral state...', challenge: { goal: 5, reward: 'Balance Badge', completed: false } },
  { id: '12', title: 'Inner Peace Meditation', duration: '12', level: 'Intermediate', category: 'Positivity', image: require('../../assets/images/G7.jpeg'), type: 'guided', description: 'Find inner calm and peace in this relaxing meditation.', instructions: '1. Find a quiet place... 2. Breathe deeply and focus on a calming thought...', challenge: { goal: 6, reward: 'Peace Badge', completed: false } },
];


const filters = ['All', 'Positivity', 'Focus', 'Success', 'Physical Health'];

export default function MeditationHome() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSessions, setFilteredSessions] = useState(meditationSessionsData);
  const [savedSessions, setSavedSessions] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [rewards, setRewards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadSavedSessions();
    loadSavedChallenges();
    loadActiveChallenges();
    loadRewards();
  }, []);

  const loadSavedSessions = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedSessions');
      if (saved !== null) {
        setSavedSessions(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved sessions:', error);
    }
  };

  const saveSessionsToStorage = async (sessions) => {
    try {
      await AsyncStorage.setItem('savedSessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  };

  const loadSavedChallenges = async () => {
    try {
      const savedChallenges = await AsyncStorage.getItem('completedChallenges');
      if (savedChallenges) {
        setCompletedChallenges(JSON.parse(savedChallenges));
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const saveChallengesToStorage = async (challenges) => {
    try {
      await AsyncStorage.setItem('completedChallenges', JSON.stringify(challenges));
    } catch (error) {
      console.error('Error saving challenges:', error);
    }
  };

  const loadActiveChallenges = async () => {
    try {
      const savedActiveChallenges = await AsyncStorage.getItem('activeChallenges');
      if (savedActiveChallenges) {
        setActiveChallenges(JSON.parse(savedActiveChallenges));
      }
    } catch (error) {
      console.error('Error loading active challenges:', error);
    }
  };

  const saveActiveChallengesToStorage = async (challenges) => {
    try {
      await AsyncStorage.setItem('activeChallenges', JSON.stringify(challenges));
    } catch (error) {
      console.error('Error saving active challenges:', error);
    }
  };

  const loadRewards = async () => {
    try {
      const savedRewards = await AsyncStorage.getItem('rewards');
      if (savedRewards) {
        setRewards(JSON.parse(savedRewards));
      }
    } catch (error) {
      console.error('Error loading rewards:', error);
    }
  };

  const saveRewardsToStorage = async (rewardList) => {
    try {
      await AsyncStorage.setItem('rewards', JSON.stringify(rewardList));
    } catch (error) {
      console.error('Error saving rewards:', error);
    }
  };

  const filterAndSearchSessions = (filter, searchText) => {
    let sessions = meditationSessionsData;

    if (filter !== 'All') {
      sessions = sessions.filter(session => session.category === filter);
    }

    if (searchText !== '') {
      sessions = sessions.filter(session =>
        session.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredSessions(sessions);
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    filterAndSearchSessions(filter, searchTerm);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    filterAndSearchSessions(activeFilter, text);
  };

  const handleSaveSession = (session) => {
    let updatedSessions = [];
    if (isSessionSaved(session.id)) {
      updatedSessions = savedSessions.filter(saved => saved.id !== session.id);
    } else {
      updatedSessions = [...savedSessions, session];
    }
    setSavedSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);
  };

  const isSessionSaved = (sessionId) => {
    return savedSessions.some(session => session.id === sessionId);
  };

  const navigateToGuidedSession = (session) => {
    router.push({
      pathname: '/GuidedMeditationSession',
      params: { session: JSON.stringify(session), updateProgress: true },
    });
  };

  const navigateToTimerSession = (session) => {
    router.push({
      pathname: '/TimerMeditationSession',
      params: { session: JSON.stringify(session), updateProgress: true },
    });
  };

  const navigateToSavedSessions = () => {
    router.push({
      pathname: '/SavedSessions',
      params: { savedSessions },
    });
  };

  const handleStartChallenge = (session) => {
    if (!activeChallenges.find(challenge => challenge.id === session.id)) {
      const updatedChallenges = [...activeChallenges, session];
      setActiveChallenges(updatedChallenges);
      saveActiveChallengesToStorage(updatedChallenges);
      alert(`Challenge for ${session.title} started! 🚀`);
    } else {
      alert(`Challenge for ${session.title} is already active!`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.textContainer}>
              <Text style={[styles.headerText, styles.neutralText]}>Sessions</Text>
            </View>
            {/* Favorites Button */}
            <TouchableOpacity onPress={navigateToSavedSessions} style={styles.favoritesButton}>
              <LinearGradient
                colors={['#6E44FF', '#9B5FFF']}
                style={styles.favoritesButtonGradient}
              >
                <Ionicons name="heart" size={hp(4)} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>      
          </View>
        <View>
        <TouchableOpacity onPress={() => router.push('/ChallengesPage')} style={styles.challengeButton}>
        <Text style={styles.challengeButtonText}>View Challenges</Text>
      </TouchableOpacity>
        </View>
          {/* Search Bar */}
          <View>
            <TextInput
              placeholder="Search Meditation"
              style={styles.searchBar}
              value={searchTerm}
              onChangeText={handleSearch}
            />
          </View>

          {/* Filter Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterTab, activeFilter === filter && styles.activeFilterTab]}
                onPress={() => handleFilter(filter)}
              >
                <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Timer Sessions */}
          <View style={styles.sessionSection}>
            <Text style={styles.sectionTitle}>Timer Sessions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {filteredSessions.filter(session => session.type === 'timer').length > 0 ? (
                filteredSessions
                  .filter(session => session.type === 'timer')
                  .map((session) => (
                    <View key={session.id} style={styles.sessionContainer}>
                      <TouchableOpacity onPress={() => navigateToTimerSession(session)}>
                        <Image source={session.image} style={styles.sessionImage} />
                        <View style={styles.sessionInfo}>
                          <Text style={styles.sessionTitle}>{session.title}</Text>
                          <Text style={styles.sessionDetails}>{session.duration} • {session.level}</Text>

                          {/* Display Challenge Info */}
                          <Text style={styles.challengeText}>Goal: Complete {session.challenge.goal} times</Text>
                          <Text style={styles.challengeRewardText}>Reward: {session.challenge.reward}</Text>
                          <Text style={styles.challengeStatusText}>
                            {completedChallenges.find(ch => ch.id === session.id)?.completed ? 'Completed 🏆' : 'In Progress 🚀'}
                          </Text>

                          {/* Start Challenge Button */}
                          <TouchableOpacity onPress={() => handleStartChallenge(session)} style={styles.startChallengeButton}>
                            <Text style={styles.startChallengeText}>Start Challenge</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleSaveSession(session)} style={styles.saveButton}>
                        <Ionicons
                          name={isSessionSaved(session.id) ? "heart" : "heart-outline"}
                          size={24}
                          color={isSessionSaved(session.id) ? 'red' : 'gray'}
                        />
                      </TouchableOpacity>
                    </View>
                  ))
              ) : (
                <Text style={styles.noResultsText}>No Timer Sessions found</Text>
              )}
            </ScrollView>
          </View>

          {/* Guided Sessions */}
          <View style={styles.sessionSection}>
            <Text style={styles.sectionTitle}>Guided Sessions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {filteredSessions.filter(session => session.type === 'guided').length > 0 ? (
                filteredSessions
                  .filter(session => session.type === 'guided')
                  .map((session) => (
                    <View key={session.id} style={styles.sessionContainer}>
                      <TouchableOpacity onPress={() => navigateToGuidedSession(session)}>
                        <Image source={session.image} style={styles.sessionImage} />
                        <View style={styles.sessionInfo}>
                          <Text style={styles.sessionTitle}>{session.title}</Text>
                          <Text style={styles.sessionDetails}>{session.duration} • {session.level}</Text>

                          {/* Display Challenge Info */}
                          <Text style={styles.challengeText}>Goal: Complete {session.challenge.goal} times</Text>
                          <Text style={styles.challengeRewardText}>Reward: {session.challenge.reward}</Text>
                          <Text style={styles.challengeStatusText}>
                            {completedChallenges.find(ch => ch.id === session.id)?.completed ? 'Completed 🏆' : 'In Progress 🚀'}
                          </Text>

                          {/* Start Challenge Button */}
                          <TouchableOpacity onPress={() => handleStartChallenge(session)} style={styles.startChallengeButton}>
                            <Text style={styles.startChallengeText}>Start Challenge</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleSaveSession(session)} style={styles.saveButton}>
                        <Ionicons
                          name={isSessionSaved(session.id) ? "heart" : "heart-outline"}
                          size={24}
                          color={isSessionSaved(session.id) ? 'red' : 'gray'}
                        />
                      </TouchableOpacity>
                    </View>
                  ))
              ) : (
                <Text style={styles.noResultsText}>No Guided Sessions found</Text>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Button to navigate to Challenges page */}
     

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0E6FE',
    paddingVertical: 10,
    paddingBottom: 80,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(5),
    paddingBottom: 20, // Added padding for spacing
  },
  textContainer: {
    justifyContent: 'center',
  },
  headerText: {
    fontSize: hp(3.5),
    fontWeight: '700',
    color: '#4B4B4B',
    
  },
  favoritesButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 30,
    borderRadius: 50,
    marginRight: 15,
  },
  favoritesButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    marginHorizontal: wp(5),
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  filterContainer: {
    marginBottom: 20,
    marginHorizontal: wp(5),
  },
  filterTab: {
    width: wp(25),
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#6E44FF',
  },
  filterText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  activeFilterText: {
    color: '#fff',
  },
  sessionSection: {
    marginBottom: 20,
    marginHorizontal: wp(5),
  },
  sectionTitle: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 10, // Added padding
  },
  horizontalScroll: {
    paddingHorizontal: wp(5),
  },
  sessionContainer: {
    width: wp(42), // Increased width for better display
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginRight: 15, // Added margin for spacing between cards
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sessionImage: {
    width: wp(30),
    height: wp(30),
    borderRadius: 10,
    marginBottom: 10,
  },
  sessionInfo: {
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sessionDetails: {
    fontSize: 12,
    color: '#555',
  },
  challengeText: {
    fontSize: 12,
    color: 'blue',
    marginTop: 5,
  },
  challengeRewardText: {
    fontSize: 12,
    color: 'green',
  },
  challengeStatusText: {
    fontSize: 12,
    color: '#555',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  saveButton: {
    padding: 10,
    marginTop: 10,
  },
  challengeButton: {
    backgroundColor: '#6E44FF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 30,
  },
  challengeButtonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  startChallengeButton: {
    backgroundColor: '#FF914D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  startChallengeText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
});
