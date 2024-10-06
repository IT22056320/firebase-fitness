import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNav from '../../components/BottomNav';
import { useRouter } from 'expo-router';

const meditationSessionsData = [
  // Focus category
  { id: '1', title: 'Mindful Breathing', duration: '10-Minutes', level: 'Beginner', category: 'Focus', image: require('../../assets/images/back.png') },
  { id: '4', title: 'Focus Booster', duration: '15-Minutes', level: 'Intermediate', category: 'Focus', image: require('../../assets/images/back.png') },

  // Positivity category
  { id: '2', title: 'Gratitude Meditation', duration: '10-Minutes', level: 'Beginner', category: 'Positivity', image: require('../../assets/images/back.png') },
  { id: '5', title: 'Positive Affirmations', duration: '20-Minutes', level: 'Beginner', category: 'Positivity', image: require('../../assets/images/back.png') },

  // Success category
  { id: '3', title: 'Calmness', duration: '10-Minutes', level: 'Expert', category: 'Success', image: require('../../assets/images/back.png') },
  { id: '6', title: 'Visualize Success', duration: '12-Minutes', level: 'Intermediate', category: 'Success', image: require('../../assets/images/back.png') },

  // Physical Health category
  { id: '7', title: 'Body Scan Meditation', duration: '10-Minutes', level: 'Beginner', category: 'Physical Health', image: require('../../assets/images/back.png') },
  { id: '8', title: 'Relax & Recover', duration: '25-Minutes', level: 'Advanced', category: 'Physical Health', image: require('../../assets/images/back.png') }
];

const filters = ['All', 'Positivity', 'Focus', 'Success', 'Physical Health'];

export default function MeditationHome() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSessions, setFilteredSessions] = useState(meditationSessionsData);
  const router = useRouter();
  const [savedSessions, setSavedSessions] = useState([]); // To store saved sessions

  const handleSignOut = () => {
    router.push('/SignIn');
  };

  // Filter and Search Functionality
  const filterAndSearchSessions = (filter, searchText) => {
    let sessions = meditationSessionsData;

    // Apply filter first
    if (filter !== 'All') {
      sessions = sessions.filter(session => session.category === filter);
    }

    // Then apply search
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

  // Save session as favorite
  const handleSaveSession = (session) => {
    if (!savedSessions.some(saved => saved.id === session.id)) {
      setSavedSessions([...savedSessions, session]);
    } else {
      // If session is already saved, remove it from savedSessions
      setSavedSessions(savedSessions.filter(saved => saved.id !== session.id));
    }
  };

  // Check if a session is saved
  const isSessionSaved = (sessionId) => {
    return savedSessions.some(session => session.id === sessionId);
  };

  // Navigate to the Guided Session screen
  const navigateToGuidedSession = () => {
    router.push('/GuidedMeditationSession');
  };

  // Navigate to the Timer Session screen
  const navigateToTimerSession = () => {
    router.push('/TimerMeditationSession');
  };

  // Navigate to Saved Sessions screen
  const navigateToSavedSessions = () => {
    router.push({
      pathname: '/SavedSessions',
      params: { savedSessions }, // Pass savedSessions as a parameter
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.textContainer}>
            <Text style={[styles.headerText, styles.neutralText]}>Guided Sessions</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/images/avatar.png')}
              style={styles.avatar}
            />
            <View style={styles.notificationIconContainer}>
              <Ionicons name="notifications" size={hp(3)} color="gray" />
            </View>
          </View>
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
            {filteredSessions.length > 0 ? (
              filteredSessions.slice(0, 2).map((session) => (
                <View key={session.id} style={styles.sessionContainer}>
                  <TouchableOpacity onPress={navigateToTimerSession}>
                    <Image source={session.image} style={styles.sessionImage} />
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionTitle}>{session.title}</Text>
                      <Text style={styles.sessionDetails}>{session.duration} • {session.level}</Text>
                    </View>
                  </TouchableOpacity>
                  {/* Save Button for each session */}
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
              <Text style={styles.noResultsText}>No search and filter results found</Text>
            )}
          </ScrollView>
        </View>

        {/* Guided Sessions */}
        <View style={styles.sessionSection}>
          <Text style={styles.sectionTitle}>Guided Sessions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <View key={session.id} style={styles.sessionContainer}>
                  <TouchableOpacity onPress={navigateToGuidedSession}>
                    <Image source={session.image} style={styles.sessionImage} />
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionTitle}>{session.title}</Text>
                      <Text style={styles.sessionDetails}>{session.duration} • {session.level}</Text>
                    </View>
                  </TouchableOpacity>
                  {/* Save Button for each session */}
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
              <Text style={styles.noResultsText}>No search and filter results found</Text>
            )}
          </ScrollView>
        </View>

        {/* Button to navigate to saved sessions */}
        <TouchableOpacity onPress={navigateToSavedSessions} style={styles.savedSessionsButton}>
          <Text style={styles.savedSessionsButtonText}>View Saved Sessions</Text>
        </TouchableOpacity>

      </ScrollView>

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
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    height: hp(6),
    width: hp(6),
    borderRadius: hp(3),
  },
  notificationIconContainer: {
    height: hp(5.5),
    width: hp(5.5),
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(2.75),
    marginTop: 5,
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
  savedSessionsButton: {
    backgroundColor: '#6E44FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: wp(5),
    marginVertical: 20,
  },
  savedSessionsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
