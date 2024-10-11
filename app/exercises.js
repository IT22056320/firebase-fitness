import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; // Importing LinearGradient for background gradient
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bodyPart } = useLocalSearchParams();
  const router = useRouter();

  const handleBack = () => {
    router.push('Home');
};

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const storedExercises = await AsyncStorage.getItem('@exercises');
        if (storedExercises) {
          setExercises(JSON.parse(storedExercises));
        }
      } catch (err) {
        console.log('Error retrieving exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [bodyPart]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6E44FF" />
        <Text style={styles.loadingText}>Loading Exercises...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#F0E6FE', '#F8F9FA']} style={styles.gradientBackground}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Exercises for {bodyPart}</Text>

        <FlatList
          data={exercises}
          keyExtractor={(item, index) => item.name + index.toString()}
          renderItem={({ item }) => (
            <View style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              
              {/* YouTube Player Component */}
              {
                item.videoUrl ? (
                  <YoutubePlayer
                    height={hp(30)}
                    play={false}
                    videoId={
                      item.videoUrl.includes('v=') ? 
                      item.videoUrl.split('v=')[1].split('&')[0] : 
                      item.videoUrl
                    }
                  />
                ) : (
                  <Text style={styles.errorText}>Video URL not available</Text>
                )
              }
              
              <Text style={styles.instructions}>{item.instructions}</Text>
            </View>
          )}
        />

        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <LinearGradient colors={['#6E44FF', '#9B5FFF']} style={styles.backButtonGradient}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    paddingTop:30,
    backgroundColor: '#F0E6FE',
  },
  container: {
    marginTop: 20,
    paddingHorizontal: wp(5),
    flex: 1,
  },
  headerText: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4B5563',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  exerciseItem: {
    marginBottom: 30,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  exerciseName: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
    textAlign: 'center',
  },
  instructions: {
    fontSize: hp(2),
    color: '#4B5563',
    textAlign: 'justify',
    marginTop: 10,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  backButtonGradient: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: hp(2.3),
    fontWeight: '600',
    letterSpacing: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(5),
  },
  loadingText: {
    marginTop: 10,
    fontSize: hp(2),
    color: '#4B5563',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});
