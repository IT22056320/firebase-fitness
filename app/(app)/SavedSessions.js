import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function SavedSessions({ route }) {
  const { savedSessions } = route.params;  // Retrieve the passed savedSessions

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
  },
  sessionContainer: {
    marginBottom: 20,
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
  noSavedText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});
