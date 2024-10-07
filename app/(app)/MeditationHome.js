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
];

const filters = ['All', 'Positivity', 'Focus', 'Success', 'Physical Health'];

export default function MeditationHome() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSessions, setFilteredSessions] = useState(meditationSessionsData);
  const [savedSessions, setSavedSessions] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]); // Track active challenges
  const [rewards, setRewards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadSavedSessions();
    loadSavedChallenges();
    loadRewards();
    loadActiveChallenges();
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
      params: { session: JSON.stringify(session), updateProgress: true }, // Add this flag
    });
  };
  
  const navigateToTimerSession = (session) => {
    router.push({
      pathname: '/TimerMeditationSession',
      params: { session: JSON.stringify(session), updateProgress: true }, // Add this flag
    });
  };
  

  const navigateToSavedSessions = () => {
    router.push({
      pathname: '/SavedSessions',
      params: { savedSessions },
    });
  };

  const handleStartChallenge = (session) => {
    // Check if the challenge is already active
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
      const challenges = await AsyncStorage.getItem('completedChallenges');
      let parsedChallenges = challenges ? JSON.parse(challenges) : [];
  
      const challengeIndex = parsedChallenges.findIndex(challenge => challenge.id === session.id);
  
      if (challengeIndex >= 0) {
        // Update the progress if challenge exists
        parsedChallenges[challengeIndex].progress += 1;
      } else {
        // Add the new challenge with progress 1
        parsedChallenges.push({ 
          id: session.id, 
          progress: 1, 
          goal: session.challenge.goal, 
          reward: session.challenge.reward 
        });
      }
  
      // Check if the challenge is complete
      const updatedChallenges = parsedChallenges.map(challenge => {
        if (challenge.progress >= challenge.goal) {
          challenge.completed = true;  // Mark as completed
          giveReward(challenge.reward); // Give reward
        }
        return challenge;
      });
  
      // Save updated challenges back to storage
      await AsyncStorage.setItem('completedChallenges', JSON.stringify(updatedChallenges));
    } catch (error) {
      console.error('Error updating challenge progress:', error);
    }
  };
  

  const giveReward = async (reward) => {
    try {
      const savedRewards = await AsyncStorage.getItem('rewards');
      let rewardList = savedRewards ? JSON.parse(savedRewards) : [];
      
      if (!rewardList.includes(reward)) {
        rewardList.push(reward); // Add the reward
        await AsyncStorage.setItem('rewards', JSON.stringify(rewardList));
        alert(`You earned the ${reward} reward! 🏆`);
      } else {
        alert('You already earned this reward.');
      }
    } catch (error) {
      console.error('Error giving reward:', error);
    }
  };
  

  const handleSessionCompletion = () => {
    updateChallengeProgress(session);
    alert(`You've completed the ${session.title} session!`);
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
