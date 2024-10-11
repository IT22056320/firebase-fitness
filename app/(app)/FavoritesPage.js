import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [favoriteSessions, setFavoriteSessions] = useState([]);

  const meditationSessionsData = [
    {
      id: '1',
      title: 'Mindful Breathing',
      duration: '5',
      level: 'Beginner',
      category: 'Focus',
      image: require('../../assets/images/D1.jpeg'),
      description: 'A focused breathing session aimed at enhancing concentration and relaxation.',
    },
    // ... (more sessions)
  ];

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

  useEffect(() => {
    const favoriteSessionsList = meditationSessionsData.filter((session) => favorites.includes(session.id));
    setFavoriteSessions(favoriteSessionsList);
  }, [favorites]);

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
    backgroundColor: '#F0E6FE',
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    paddingTop:20,
    paddingLeft:10
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
    padding: 15,
    elevation: 3, // Shadow for Android
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  imageStyle: {
    width: 120,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6E44FF',
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 5,
  },
  durationText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  favoriteButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FF6347',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF7F50',
    shadowColor: '#FF7F50',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flatListContent: {
    paddingBottom: 20,
  },
});
