import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SavedSessions() {
  const [savedSessions, setSavedSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedSessions();
  }, []);

  // Load saved sessions from AsyncStorage
  const loadSavedSessions = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedSessions');
      if (saved !== null) {
        setSavedSessions(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save updated sessions to AsyncStorage
  const saveSessionsToStorage = async (sessions) => {
    try {
      await AsyncStorage.setItem('savedSessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  };

  // Handle unfavorite (remove from saved sessions)
  const handleUnfavoriteSession = (sessionId) => {
    const updatedSessions = savedSessions.filter(session => session.id !== sessionId);
    setSavedSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Saved Sessions</Text>
        {savedSessions.length > 0 ? (
          savedSessions.map((session) => (
            <View key={session.id} style={styles.sessionContainer}>
              <Image source={session.image} style={styles.sessionImage} />
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.sessionDetails}>{session.duration} • {session.level}</Text>
                {/* Unfavorite Button */}
                <TouchableOpacity
                  style={styles.unfavoriteButton}
                  onPress={() => handleUnfavoriteSession(session.id)}
                >
                  <Ionicons name="heart-dislike" size={24} color="red" />
                  <Text style={styles.unfavoriteText}>Unfavorite</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noSavedText}>No saved sessions yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sessionContainer: {
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  sessionImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  sessionInfo: {
    marginTop: 10,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sessionDetails: {
    fontSize: 14,
    color: '#888',
  },
  unfavoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  unfavoriteText: {
    marginLeft: 5,
    color: 'red',
    fontSize: 16,
  },
  noSavedText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});
