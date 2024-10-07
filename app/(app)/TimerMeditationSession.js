import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';  // Correct hook for accessing params
import { Audio } from 'expo-av';  // Import Expo's Audio module

export default function TimerSession() {
  const params = useLocalSearchParams();  // Access params
  const session = params.session ? JSON.parse(params.session) : null;  // Safely parse session data
  const updateChallengeProgress = params.updateChallengeProgress;
  const initialTimer = parseInt(session.duration) * 60;  // Store initial time in seconds
  const [timer, setTimer] = useState(initialTimer);  // Initialize timer in seconds
  const [isRunning, setIsRunning] = useState(false);  // Track whether the timer is running
  const [sound, setSound] = useState();

  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);  // Decrease timer every second
    } else if (timer === 0) {
      playSound();  // Play sound when timer reaches 0
      handleSessionCompletion(session);  // Call session completion function when the timer hits 0
      clearInterval(interval);  // Clear the interval
      setIsRunning(false);
    }
    return () => clearInterval(interval);  // Clean up interval on component unmount
  }, [isRunning, timer]);

  // Function to play sound when the timer expires
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sound/timer_end.wav')  // Use your own sound file here
    );
    setSound(sound);
    await sound.playAsync();  // Play the sound
  }

  // Clean up sound when the component unmounts
  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const skipTimer = () => {
    setTimer(0);  // Set the timer to 0, triggering the end of the timer
    handleSessionCompletion(session);  // Ensure challenge progress is updated when skipping
    setIsRunning(false);  // Stop the timer
  };

  const resetTimer = () => {
    setTimer(initialTimer);  // Reset the timer to the initial value
    setIsRunning(false);  // Stop the timer
  };

  const handleSessionCompletion = () => {
    if (updateChallengeProgress) {
      updateChallengeProgress(session); // Ensure this function is properly passed or available
    }
    alert(`You've completed the ${session.title} session!`);
  };
  

  if (!session) {
    return (
      <View style={styles.container}>
        <Text>Session not found.</Text>
      </View>
    );
  }

  // Convert the timer value from seconds to minutes and seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{session.title}</Text>
      <Text style={styles.description}>{session.description}</Text>
      <Text style={styles.timer}>{formatTime(timer)}</Text>
      
      <TouchableOpacity style={styles.startButton} onPress={startTimer} disabled={isRunning}>
        <Text style={styles.buttonText}>{isRunning ? 'Running' : 'Start'}</Text>
      </TouchableOpacity>

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={skipTimer}>
        <Text style={styles.buttonText}>Skip</Text>
      </TouchableOpacity>

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
        <Text style={styles.buttonText}>Reset</Text>
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
    marginBottom: 10,  // Add margin to separate the buttons
  },
  skipButton: {
    backgroundColor: '#FF4444',  // Red color for skip button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,  // Add margin to separate the buttons
  },
  resetButton: {
    backgroundColor: '#FFD700',  // Yellow color for reset button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});
