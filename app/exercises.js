import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import YoutubePlayer from 'react-native-youtube-iframe'; // Import YouTube player component

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bodyPart } = useLocalSearchParams(); // Retrieve body part from params
  const router = useRouter();

  // Load exercises from AsyncStorage based on the selected body part
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
        <ActivityIndicator size="large" color="#E11D48" />
        <Text style={styles.loadingText}>Loading Exercises...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Exercises for {bodyPart}</Text>

      <FlatList
        data={exercises}
        keyExtractor={(item, index) => item.name + index.toString()}  // Ensure unique keys
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
                  } // Handle full YouTube URL or just the video ID
                />
              ) : (
                <Text style={styles.errorText}>Video URL not available</Text>
              )
            }
            
            <Text style={styles.instructions}>{item.instructions}</Text>
          </View>
        )}
      />

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: wp(5),
    flex: 1,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4B5563',
    textAlign: 'center',
  },
  exerciseItem: {
    marginBottom: 30,
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  exerciseName: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },
  instructions: {
    fontSize: hp(2),
    color: '#4B5563',
    textAlign: 'justify',
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E11D48',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: hp(2.3),
    fontWeight: '600',
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
