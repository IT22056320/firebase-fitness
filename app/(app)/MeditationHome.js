import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../../components/BottomNav';

const meditationSessionsData = [
  {
    id: '1',
    title: 'Mindful Breathing',
    duration: '5',
    level: 'Beginner',
    category: 'Focus',
    image: require('../../assets/images/D1.jpeg'),
    type: 'timer',
    description: `
      A focused breathing session aimed at enhancing concentration and relaxation. Perfect for beginners starting their mindfulness journey.
      Instructions:
      1. Find a quiet, comfortable place to sit.
      2. Close your eyes and focus on your breathing.
      3. Inhale deeply through your nose for a count of 4.
      4. Hold your breath for 2 seconds.
      5. Exhale slowly through your mouth for a count of 6.
      6. Repeat for the duration of the session, staying mindful of your breath.`,
    challenge: {
      goal: 5,
      reward: 'Relaxation Badge',
      completed: false,
      active: false,
    },
  },
  {
    id: '2',
    title: 'Gratitude Meditation',
    duration: '10',
    level: 'Beginner',
    category: 'Positivity',
    image: require('../../assets/images/D2.png'),
    type: 'guided',
    description: `
      Gratitude meditation helps in cultivating a sense of appreciation and positive energy. Reflect on what you are grateful for to boost happiness.
      Instructions:
      1. Sit in a comfortable position and close your eyes.
      2. Take a few deep breaths to relax your body.
      3. Think of 3 things you are grateful for today.
      4. Focus on each thought for at least 2 minutes, visualizing the positive emotions.
      5. Let these feelings of gratitude fill your mind and heart.`,
    challenge: {
      goal: 3,
      reward: 'Gratitude Badge',
      completed: false,
      active: false,
    },
  },
  {
    id: '3',
    title: 'Calmness Meditation',
    duration: '10',
    level: 'Expert',
    category: 'Success',
    image: require('../../assets/images/D3.png'),
    type: 'timer',
    description: `
      This expert-level session is designed to help you achieve deeper states of relaxation and focus.
      Instructions:
      1. Find a quiet, peaceful environment.
      2. Sit comfortably and close your eyes.
      3. Focus on the sound of your breath and let any distracting thoughts pass without judgment.
      4. Inhale deeply for 4 seconds, then exhale slowly for 6 seconds.
      5. Allow your mind to enter a calm, serene state with each breath.
      6. Stay in the moment for the duration of the session.`,
    challenge: {
      goal: 7,
      reward: 'Calmness Badge',
      completed: false,
      active: false,
    },
  },
  {
    id: '4',
    title: 'Body Scan Meditation',
    duration: '15',
    level: 'Intermediate',
    category: 'Relaxation',
    image: require('../../assets/images/D4.jpeg'),
    type: 'guided',
    description: `
      The Body Scan meditation allows you to check in with each part of your body, releasing tension and promoting relaxation throughout.
      Instructions:
      1. Lie down in a comfortable position.
      2. Close your eyes and take a few deep breaths.
      3. Start by focusing on your toes, noticing any tension.
      4. Slowly move your attention upwards, to your legs, torso, arms, and head.
      5. At each point, visualize the tension melting away.
      6. Continue scanning your body until you feel completely relaxed.`,
    challenge: {
      goal: 5,
      reward: 'Awareness Badge',
      completed: false,
      active: false,
    },
  },
  {
    id: '5',
    title: 'Loving Kindness Meditation',
    duration: '20',
    level: 'Intermediate',
    category: 'Compassion',
    image: require('../../assets/images/D5.jpg'),
    type: 'guided',
    description: `
      This meditation focuses on cultivating love and kindness towards yourself and others.
      Instructions:
      1. Sit comfortably and close your eyes.
      2. Take a few deep breaths and bring your attention to your heart.
      3. Silently repeat: "May I be happy. May I be healthy. May I be safe."
      4. Then think of a loved one and silently repeat: "May you be happy. May you be healthy. May you be safe."
      5. Continue with other people in your life, sending kindness and compassion to them.`,
    challenge: {
      goal: 4,
      reward: 'Compassion Badge',
      completed: false,
      active: false,
    },
  },
  {
    id: '6',
    title: 'Zen Meditation (Zazen)',
    duration: '25',
    level: 'Expert',
    category: 'Focus',
    image: require('../../assets/images/G1.jpeg'),
    type: 'timer',
    description: `
      Zen meditation or Zazen focuses on posture and breathing to quiet the mind.
      Instructions:
      1. Sit on the floor with your legs crossed and back straight.
      2. Rest your hands on your knees, palms facing up.
      3. Focus on your breathing: inhale deeply through your nose, exhale slowly.
      4. As thoughts come into your mind, acknowledge them, and let them go.
      5. Keep your focus on your breath and posture, letting your mind settle into calm awareness.`,
    challenge: {
      goal: 6,
      reward: 'Zen Master Badge',
      completed: false,
      active: false,
    },
  },
  {
    id: '7',
    title: 'Visualization Meditation',
    duration: '10',
    level: 'Beginner',
    category: 'Positivity',
    image: require('../../assets/images/G2.jpeg'),
    type: 'guided',
    description: `
      This meditation guides you to visualize positive images, helping reduce stress and improve focus and motivation.
      Instructions:
      1. Sit comfortably and close your eyes.
      2. Visualize yourself in a peaceful place, like a beach or forest.
      3. Imagine the sights, sounds, and smells of this place vividly.
      4. Focus on how calm and peaceful you feel in this environment.
      5. Stay with this visualization for the duration of the session, enjoying the tranquility.`,
    challenge: {
      goal: 3,
      reward: 'Clarity Badge',
      completed: false,
      active: false,
    },
  },
  {
    id: '8',
    title: 'Chakra Meditation',
    duration: '30',
    level: 'Advanced',
    category: 'Energy',
    image: require('../../assets/images/G3.jpeg'),
    type: 'guided',
    description: `
      An advanced meditation focusing on the energy centers (chakras) in your body to balance and align them, promoting spiritual well-being.
      Instructions:
      1. Sit comfortably with your spine straight.
      2. Visualize the energy centers in your body, starting from the root (base of the spine).
      3. Slowly move upward to the sacral, solar plexus, heart, throat, third eye, and crown chakras.
      4. At each chakra, visualize vibrant energy flowing freely.
      5. Focus on aligning and balancing these centers for spiritual harmony.`,
    challenge: {
      goal: 5,
      reward: 'Energy Badge',
      completed: false,
      active: false,
    },
  },
  {
    id: '9',
    title: 'Sound Bath Meditation',
    duration: '15',
    level: 'Intermediate',
    category: 'Relaxation',
    image: require('../../assets/images/G4.jpeg'),
    type: 'guided',
    description: `
      This meditation uses sound frequencies to induce relaxation and healing.
      Instructions:
      1. Sit or lie down in a comfortable position.
      2. Close your eyes and focus on the sound of the meditation tones.
      3. Let the sounds wash over you, clearing your mind.
      4. With each sound, feel the stress leaving your body.
      5. Focus on the resonance of the sound until the session ends.`,
    challenge: {
      goal: 4,
      reward: 'Harmony Badge',
      completed: false,
      active: false,
    },
  },
  {
    id: '10',
    title: 'Mindfulness of Breath',
    duration: '20',
    level: 'Beginner',
    category: 'Awareness',
    image: require('../../assets/images/G5.jpeg'),
    type: 'timer',
    description: `
      Focus solely on the rhythm of your breath to enhance mindfulness and self-awareness.
      Instructions:
      1. Sit in a comfortable position with your back straight.
      2. Close your eyes and focus on your breathing.
      3. Inhale deeply through your nose, feeling your lungs expand.
      4. Exhale slowly, releasing tension from your body.
      5. Stay focused on the breath, letting go of any distractions that arise.`,
    challenge: {
      goal: 6,
      reward: 'Mindfulness Badge',
      completed: false,
      active: false,
    },
  },
];

export default function MeditationSessions() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [challenges, setChallenges] = useState(meditationSessionsData);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const loadChallenges = async () => {
    try {
      const storedChallenges = await AsyncStorage.getItem('challenges');
      if (storedChallenges) {
        setChallenges(JSON.parse(storedChallenges));
      } else {
        setChallenges(meditationSessionsData);
      }
    } catch (error) {
      console.error('Failed to load challenges:', error);
    }
  };

  useEffect(() => {
    loadFavorites();
    loadChallenges();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
      loadChallenges();
    }, [])
  );

  const saveFavorites = async (updatedFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const saveChallenges = async (updatedChallenges) => {
    try {
      await AsyncStorage.setItem('challenges', JSON.stringify(updatedChallenges));
    } catch (error) {
      console.error('Failed to save challenges:', error);
    }
  };

  const toggleFavorite = (sessionId) => {
    const updatedFavorites = favorites.includes(sessionId)
      ? favorites.filter((id) => id !== sessionId)
      : [...favorites, sessionId];

    setFavorites(updatedFavorites);
    saveFavorites(updatedFavorites);
  };

  const startChallenge = (sessionId) => {
    const updatedChallenges = challenges.map((session) => {
      if (session.id === sessionId) {
        session.challenge.active = true;
        session.challenge.completed = false;
        session.challenge.sessionsCompleted = session.challenge.sessionsCompleted || 0;
      }
      return session;
    });
    setChallenges(updatedChallenges);
    saveChallenges(updatedChallenges);
    alert('Challenge started!');
  };

  const handleMeditationPress = (session) => {
    const imageSource = typeof session.image === 'number' ? session.image : session.image.uri;

    if (session.type === 'timer') {
      router.push({
        pathname: '/TimerSession',
        params: {
          sessionId: session.id,
          duration: session.duration,
          challengeId: session.id,
          instructions: session.instructions,
          image: imageSource,
          description: session.description,
        },
      });
    } else if (session.type === 'guided') {
      router.push({
        pathname: '/GuidedMeditationSession',
        params: {
          sessionId: session.id,
          instructions: session.instructions,
          image: session.image,
          description: session.description,
          reward: session.challenge.reward,
          challengeId: session.id,
        },
      });
    }
  };

  const filteredSessions = challenges.filter((session) => {
    const matchesCategory = selectedCategory === 'all' || session.type === selectedCategory;
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Meditation Sessions</Text>

      {/* First Row of Category Buttons */}
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
        <TouchableOpacity style={styles.categoryButton} onPress={() => router.push('/FavoritesPage')}>
          <Text style={styles.categoryButtonText}>Favorites</Text>
        </TouchableOpacity>
      </View>

      {/* Second Row for Challenges Button */}
      <View style={styles.singleButtonContainer}>
        <TouchableOpacity style={styles.categoryButton} onPress={() => router.push('/ChallengesPage')}>
          <Text style={styles.categoryButtonText}>Challenges</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search meditations..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

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
      <BottomNav />
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

        <TouchableOpacity onPress={onFavoritePress} style={styles.favoriteButton}>
          <Text style={styles.favoriteButtonText}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
        </TouchableOpacity>

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
    paddingHorizontal: 20,
    backgroundColor: '#F0E6FE',
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  singleButtonContainer: {
    alignItems: 'center', // Center the challenges button
    marginBottom: 20, // Add some space below
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#5e4e96',
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
    backgroundColor: '#FFF',
  },
  flatListContent: {
    paddingBottom: 80,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3, // Shadow effect for Android
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  imageStyle: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  durationText: {
    fontSize: 14,
    color: '#999',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
  challengeText: {
    fontSize: 12,
    color: '#27AE60',
    marginTop: 10,
  },
  favoriteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FF2400',
    borderRadius: 5,
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'white'
  },
  startButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#6E44FF',
    borderRadius: 5,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
