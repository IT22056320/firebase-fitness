import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function TimerSession({ route, navigation }) {
  const duration = route?.params?.duration || 5; // Provide a default value in case route.params is undefined
  const [secondsRemaining, setSecondsRemaining] = useState(duration * 60); // Convert minutes to seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSessionEnd = () => {
    alert('Meditation session complete!');
    navigation.goBack('MeditationHome'); // Navigate back after session ends
  };

  useEffect(() => {
    if (secondsRemaining === 0) {
      handleSessionEnd();
    }
  }, [secondsRemaining]);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {Math.floor(secondsRemaining / 60)}:{String(secondsRemaining % 60).padStart(2, '0')}
      </Text>
      <Button title="End Session" onPress={handleSessionEnd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});
