import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const meditationSessionsData = [
  { id: '1', title: 'Mindful Breathing', duration: '1', level: 'Beginner', category: 'Focus', image: require('../../assets/images/D1.jpeg'), type: 'timer', description: 'A focused breathing session aimed at enhancing concentration and relaxation.', challenge: { goal: 5, reward: 'Relaxation Badge', completed: false, active: false } },
  { id: '2', title: 'Gratitude Meditation', duration: '10', level: 'Beginner', category: 'Positivity', image: require('../../assets/images/D2.png'), type: 'guided', description: 'Gratitude meditation helps in cultivating a sense of appreciation and positive energy.', challenge: { goal: 3, reward: 'Gratitude Badge', completed: false, active: false } },
  { id: '3', title: 'Calmness', duration: '10', level: 'Expert', category: 'Success', image: require('../../assets/images/D3.png'), type: 'timer', description: 'Calmness meditation designed to help experts practice deeper states of relaxation and focus.', challenge: { goal: 7, reward: 'Calmness Badge', completed: false, active: false } },
];

export default function MeditationSessions() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [challenges, setChallenges] = useState(meditationSessionsData);

  // Load challenges from AsyncStorage
  const loadChallenges = async () => {
    try {
      const storedChallenges = await AsyncStorage.getItem('challenges');
      if (storedChallenges) {
        setChallenges(JSON.parse(storedChallenges));
      } else {
        setChallenges(meditationSessionsData); // Set default data if nothing is in AsyncStorage
      }
    } catch (error) {
      console.error('Failed to load challenges:', error);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  // Reload challenges when page is focused
  useFocusEffect(
    React.useCallback(() => {
      loadChallenges();
    }, [])
  );

  const saveChallenges = async (updatedChallenges) => {
    try {
      await AsyncStorage.setItem('challenges', JSON.stringify(updatedChallenges));
    } catch (error) {
      console.error('Failed to save challenges:', error);
    }
  };

  // Handle starting a challenge
  const startChallenge = (sessionId) => {
    const updatedChallenges = challenges.map((session) => {
      if (session.id === sessionId) {
        session.challenge.active = true;
        session.challenge.completed = false;
        session.challenge.sessionsCompleted = session.challenge.sessionsCompleted || 0; // Initialize if not set
      }
      return session;
    });
    setChallenges(updatedChallenges);
    saveChallenges(updatedChallenges);
    alert('Challenge started!');
  };

  // Handle navigation and tracking progress
  const handleMeditationPress = (session) => {
    if (session.type === 'timer') {
      router.push({
        pathname: '/TimerSession',
        params: {
          sessionId: session.id,
          duration: session.duration,
          challengeId: session.id, // Pass challengeId
          instructions: session.description, // Pass instructions
          image: session.image, // Pass image
          description: session.description // Pass description
        },
      });
    } else if (session.type === 'guided') {
      router.push({
        pathname: '/GuidedMeditationSession',
        params: {
          sessionId: session.id,
          instructions: session.description,
          image: session.image,
          description: session.description,
          reward: session.challenge.reward,
          challengeId: session.id, // Pass challengeId
        },
      });
    }
  };

  // Filter sessions
  const filteredSessions = challenges.filter((session) => {
    const matchesCategory = selectedCategory === 'all' || session.type === selectedCategory;
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (sessionId) => {
    const updatedFavorites = favorites.includes(sessionId)
      ? favorites.filter((id) => id !== sessionId) // Remove from favorites
      : [...favorites, sessionId]; // Add to favorites

    setFavorites(updatedFavorites);
    saveFavorites(updatedFavorites); // Persist the changes
  };

  const saveFavorites = async (updatedFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Meditation Sessions</Text>
      {/* Category Selector */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[styles.categoryButton, selectedCategory === 'all' && styles.selectedCategoryButton]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={styles.categoryButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, selectedCategory === 'timer' && styles.selectedCategoryButton]}
          onPress={() => setSelectedCategory('timer')}
        >
          <Text style={styles.categoryButtonText}>Timer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, selectedCategory === 'guided' && styles.selectedCategoryButton]}
          onPress={() => setSelectedCategory('guided')}
        >
          <Text style={styles.categoryButtonText}>Guided</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryButton]}
          onPress={() => router.push('/FavoritesPage')}
        >
          <Text style={styles.categoryButtonText}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryButton]}
          onPress={() => router.push('/ChallengesPage')}
        >
          <Text style={styles.categoryButtonText}>Challenges</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search meditations..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Meditation Sessions List */}
      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MeditationCard
            session={item}
            onPress={() => handleMeditationPress(item)}
            onFavoritePress={() => toggleFavorite(item.id)}
            onChallengePress={() => startChallenge(item.id)}
            isFavorite={favorites.includes(item.id)}
          />
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const MeditationCard = ({ session, onPress, onFavoritePress, onChallengePress, isFavorite }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <Image source={session.image} style={styles.imageStyle} />
      <View style={styles.cardContent}>
        <Text style={styles.titleText}>{session.title}</Text>
        <Text style={styles.categoryText}>{session.category} • {session.level}</Text>
        <Text style={styles.durationText}>{session.duration} min</Text>
        <Text style={styles.descriptionText}>{session.description}</Text>
        <Text style={styles.challengeText}>Challenge: Complete {session.challenge.goal} sessions to earn the {session.challenge.reward}</Text>

        {/* Favorite Button */}
        <TouchableOpacity onPress={onFavoritePress} style={styles.favoriteButton}>
          <Text style={styles.favoriteButtonText}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
        </TouchableOpacity>

        {/* Start Challenge Button */}
        {!session.challenge.completed && !session.challenge.active && (
          <TouchableOpacity onPress={onChallengePress} style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Challenge</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

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
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  selectedCategoryButton: {
    backgroundColor: '#6E44FF',
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  searchInput: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    marginBottom: 20,
  },
  flatListContent: {
    paddingBottom: 50,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  imageStyle: {
    width: 120,
    height: 100,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 16,
    color: '#6B7280',
    marginVertical: 5,
  },
  durationText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  descriptionText: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 10,
  },
  challengeText: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 10,
  },
  favoriteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFD700',
    borderRadius: 5,
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  startButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
