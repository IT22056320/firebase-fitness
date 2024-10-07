import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNav from '../../components/BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const meditationSessionsData = [
  { id: '1', title: 'Mindful Breathing', duration: '1', level: 'Beginner', category: 'Focus', image: require('../../assets/images/back.png'), type: 'timer', description: 'A focused breathing session aimed at enhancing concentration and relaxation.', instructions: '1. Find a quiet place... 2. Start breathing slowly...', challenge: { goal: 5, reward: 'Relaxation Badge', completed: false } },
  { id: '2', title: 'Gratitude Meditation', duration: '10', level: 'Beginner', category: 'Positivity', image: require('../../assets/images/back.png'), type: 'guided', description: 'Gratitude meditation helps in cultivating a sense of appreciation and positive energy.', instructions: '1. Sit comfortably... 2. Reflect on things you are grateful for...', challenge: { goal: 3, reward: 'Gratitude Badge', completed: false } },
  { id: '3', title: 'Calmness', duration: '10', level: 'Expert', category: 'Success', image: require('../../assets/images/back.png'), type: 'timer', description: 'Calmness meditation designed to help experts practice deeper states of relaxation and focus.', instructions: '1. Sit quietly... 2. Focus on releasing tension...', challenge: { goal: 7, reward: 'Calmness Badge', completed: false } },
  { id: '4', title: 'Focus Booster', duration: '15', level: 'Intermediate', category: 'Focus', image: require('../../assets/images/back.png'), type: 'timer', description: 'Focus booster meditation for intermediate practitioners aiming to enhance focus.', instructions: '1. Sit down... 2. Breathe and focus on a single thought...', challenge: { goal: 4, reward: 'Focus Badge', completed: false } },
  { id: '5', title: 'Positive Affirmations', duration: '20', level: 'Beginner', category: 'Positivity', image: require('../../assets/images/back.png'), type: 'guided', description: 'Positive affirmations to help cultivate self-belief and positive mindset.', instructions: '1. Repeat positive affirmations like “I am capable”...', challenge: { goal: 6, reward: 'Affirmation Badge', completed: false } },
  { id: '6', title: 'Visualize Success', duration: '12', level: 'Intermediate', category: 'Success', image: require('../../assets/images/back.png'), type: 'timer', description: 'Visualization of success to help envision goals and reinforce positive outcomes.', instructions: '1. Visualize achieving your goals...', challenge: { goal: 5, reward: 'Success Badge', completed: false } },
  { id: '7', title: 'Body Scan Meditation', duration: '10', level: 'Beginner', category: 'Physical Health', image: require('../../assets/images/back.png'), type: 'guided', description: 'Body scan meditation focused on awareness of physical sensations for relaxation.', instructions: '1. Lay down... 2. Focus on scanning each part of your body for tension...', challenge: { goal: 3, reward: 'Body Awareness Badge', completed: false } },
  { id: '8', title: 'Relax & Recover', duration: '25', level: 'Advanced', category: 'Physical Health', image: require('../../assets/images/back.png'), type: 'guided', description: 'Relax and recover with this advanced guided meditation session.', instructions: '1. Relax in a quiet place... 2. Allow yourself to unwind completely...', challenge: { goal: 8, reward: 'Recovery Badge', completed: false } },
  { id: '9', title: 'Loving Kindness Meditation', duration: '15', level: 'Intermediate', category: 'Positivity', image: require('../../assets/images/back.png'), type: 'guided', description: 'Cultivate love and kindness towards yourself and others.', instructions: '1. Sit comfortably... 2. Focus on feelings of compassion and love...', challenge: { goal: 5, reward: 'Kindness Badge', completed: false } },
  { id: '10', title: 'Breath Counting Meditation', duration: '5', level: 'Beginner', category: 'Focus', image: require('../../assets/images/back.png'), type: 'timer', description: 'A simple meditation to improve focus by counting your breaths.', instructions: '1. Find a quiet place... 2. Start counting each breath...', challenge: { goal: 6, reward: 'Focus Badge', completed: false } },
  { id: '11', title: 'Mountain Visualization', duration: '12', level: 'Intermediate', category: 'Success', image: require('../../assets/images/back.png'), type: 'guided', description: 'Visualize a mountain to strengthen your mental resilience.', instructions: '1. Imagine yourself as a strong mountain...', challenge: { goal: 4, reward: 'Resilience Badge', completed: false } },
  { id: '12', title: 'Sound Meditation', duration: '8', level: 'Beginner', category: 'Physical Health', image: require('../../assets/images/back.png'), type: 'timer', description: 'Focus on surrounding sounds to increase awareness and relaxation.', instructions: '1. Find a quiet place... 2. Focus on the sounds around you...', challenge: { goal: 4, reward: 'Sound Awareness Badge', completed: false } },
  { id: '13', title: 'Progressive Muscle Relaxation', duration: '15', level: 'Beginner', category: 'Physical Health', image: require('../../assets/images/back.png'), type: 'guided', description: 'A guided relaxation to release muscle tension step by step.', instructions: '1. Tense and release each muscle group...', challenge: { goal: 6, reward: 'Muscle Relaxation Badge', completed: false } },
  { id: '14', title: 'Mindful Eating Meditation', duration: '10', level: 'Beginner', category: 'Physical Health', image: require('../../assets/images/back.png'), type: 'guided', description: 'Focus on mindful eating to promote a healthy relationship with food.', instructions: '1. Eat slowly and focus on each bite...', challenge: { goal: 3, reward: 'Healthy Eating Badge', completed: false } },
  { id: '15', title: 'Gratitude Journaling', duration: '5', level: 'Beginner', category: 'Positivity', image: require('../../assets/images/back.png'), type: 'guided', description: 'Practice gratitude journaling to improve mood and well-being.', instructions: '1. Write down things you are grateful for...', challenge: { goal: 4, reward: 'Gratitude Journal Badge', completed: false } },
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

  const updateChallengeProgress = async (session) => {
    try {
      const savedChallenges = await AsyncStorage.getItem('completedChallenges');
      let parsedChallenges = savedChallenges ? JSON.parse(savedChallenges) : [];
  
      const challengeIndex = parsedChallenges.findIndex(challenge => challenge.id === session.id);
  
      if (challengeIndex >= 0) {
        // Increment progress
        parsedChallenges[challengeIndex].progress += 1;
  
        // Check if the challenge is now complete
        if (parsedChallenges[challengeIndex].progress >= session.challenge.goal) {
          parsedChallenges[challengeIndex].completed = true;  // Mark as completed
          giveReward(session.challenge.reward);  // Give the reward if completed
        }
      } else {
        // If this challenge is not tracked yet, add it with initial progress
        parsedChallenges.push({
          id: session.id,
          progress: 1,
          goal: session.challenge.goal,
          reward: session.challenge.reward,
          completed: false,
        });
      }
  
      // Save updated challenges back to AsyncStorage
      await AsyncStorage.setItem('completedChallenges', JSON.stringify(parsedChallenges));
  
      // Update local state
      setCompletedChallenges(parsedChallenges);
  
      // Update activeChallenges to remove any completed ones
      const updatedActiveChallenges = activeChallenges.filter(ch => ch.id !== session.id || !parsedChallenges[challengeIndex]?.completed);
      setActiveChallenges(updatedActiveChallenges);
      saveActiveChallengesToStorage(updatedActiveChallenges);
  
    } catch (error) {
      console.error('Error updating challenge progress:', error);
    }
  };
  

  const giveReward = async (reward) => {
    try {
      const savedRewards = await AsyncStorage.getItem('rewards');
      let rewardList = savedRewards ? JSON.parse(savedRewards) : [];

      if (!rewardList.includes(reward)) {
        rewardList.push(reward);
        await AsyncStorage.setItem('rewards', JSON.stringify(rewardList));
        alert(`You earned the ${reward} reward! 🏆`);
      } else {
        alert('You already earned this reward.');
      }
    } catch (error) {
      console.error('Error giving reward:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.textContainer}>
              <Text style={[styles.headerText, styles.neutralText]}>Guided & Timer Sessions</Text>
            </View>

            {/* Favorites Button */}
            <TouchableOpacity onPress={navigateToSavedSessions} style={styles.favoritesButton}>
              <Ionicons name="heart" size={hp(4)} color="#FF0000" />
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
      <TouchableOpacity onPress={() => router.push('/ChallengesPage')} style={styles.challengeButton}>
        <Text style={styles.challengeButtonText}>View Challenges</Text>
      </TouchableOpacity>

      <BottomNav />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingBottom:80
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(5),
  },
  textContainer: {
    justifyContent: 'center',
  },
  headerText: {
    fontSize: hp(4),
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  favoritesButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: wp(5),
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 20,
    marginHorizontal: wp(5),
  },
  filterTab: {
    width: wp(25),
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
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
  },
  horizontalScroll: {
    paddingHorizontal: wp(5),
  },
  sessionContainer: {
    width: wp(40),
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  challengeButtonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  startChallengeButton: {
    backgroundColor: '#FF914D',
    paddingVertical: 10,
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
