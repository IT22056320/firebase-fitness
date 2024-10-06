import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TimerSession() {
  const [timer, setTimer] = useState(10);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mindful Breathing</Text>
      <Text style={styles.description}>A focused breathing session aimed at enhancing concentration and relaxation.</Text>
      <Text style={styles.timer}>{`00:${timer < 10 ? '0' : ''}${timer}`}</Text>
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0E6FE',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 40,
    textAlign: 'center',
  },
  timer: {
    fontSize: 48,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#6E44FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});
