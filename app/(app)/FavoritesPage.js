import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoritesPage({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [favoriteSessions, setFavoriteSessions] = useState([]);

  const meditationSessionsData = [
    { id: '1', title: 'Mindful Breathing', duration: '1', level: 'Beginner', category: 'Focus', image: require('../../assets/images/D1.jpeg'), type: 'timer', description: 'A focused breathing session aimed at enhancing concentration and relaxation.', challenge: { goal: 5, reward: 'Relaxation Badge', completed: false } },
    { id: '2', title: 'Gratitude Meditation', duration: '10', level: 'Beginner', category: 'Positivity', image: require('../../assets/images/D2.png'), type: 'guided', description: 'Gratitude meditation helps in cultivating a sense of appreciation and positive energy.', challenge: { goal: 3, reward: 'Gratitude Badge', completed: false } },
    { id: '3', title: 'Calmness', duration: '10', level: 'Expert', category: 'Success', image: require('../../assets/images/D3.png'), type: 'timer', description: 'Calmness meditation designed to help experts practice deeper states of relaxation and focus.', challenge: { goal: 7, reward: 'Calmness Badge', completed: false } },
  ];

  // Load favorites from AsyncStorage when the component mounts
  useEffect(() => {
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
    loadFavorites();
  }, []);

  // Update the favorite sessions based on the IDs stored in AsyncStorage
  useEffect(() => {
    const favoriteSessionsList = meditationSessionsData.filter((session) => favorites.includes(session.id));
    setFavoriteSessions(favoriteSessionsList);
  }, [favorites]);

  // Handle removing a favorite and update AsyncStorage
  const handleRemoveFavorite = async (sessionId) => {
    const updatedFavorites = favorites.filter((id) => id !== sessionId);
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Favorite Meditation Sessions</Text>

      <FlatList
        data={favoriteSessions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <Image source={item.image} style={styles.imageStyle} />
            <View style={styles.cardContent}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.categoryText}>{item.category} • {item.level}</Text>
              <Text style={styles.durationText}>{item.duration} min</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>

              {/* Unfavorite Button */}
              <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)} style={styles.favoriteButton}>
                <Text style={styles.favoriteButtonText}>Remove from Favorites</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

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
  favoriteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
