import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function MeditationDetails({ route }) {
  const { session } = route.params; // Assuming the session is passed as a parameter
  
  return (
    <ScrollView style={styles.container}>
      <Image source={session.image} style={styles.headerImage} />
      <Text style={styles.title}>{session.title}</Text>
      <Text style={styles.description}>{session.description}</Text>
      <Text style={styles.instructions}>
        In this session, you’ll be guided through a peaceful scenario to relieve stress and foster inner peace.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0E6FE',
    padding: 20,
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 14,
    lineHeight: 22,
  },
});
