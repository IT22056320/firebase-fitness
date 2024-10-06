import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useRouter } from 'expo-router';

export default function TimerMeditationSession() {
  const router = useRouter();
  const [duration, setDuration] = useState(0);  // Video duration in seconds
  const [timer, setTimer] = useState(0);  // Timer state
  const [isPlaying, setIsPlaying] = useState(false);  // Track play state of the video

  // Update the timer when video duration is fetched
  const handleVideoDuration = (durationInSeconds) => {
    setDuration(durationInSeconds);
    setTimer(durationInSeconds);  // Set timer to video duration
  };

  // Convert seconds to MM:SS format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Start or pause the timer based on the play state of the video
  useEffect(() => {
    let interval = null;
    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (!isPlaying || timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timer]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timerContainer}>
        {/* Display the timer */}
        <Text style={styles.timer}>{formatTime(timer)}</Text>

        {/* YouTube video player */}
        <YoutubePlayer
          height={hp(30)}
          play={isPlaying}
          videoId={'inpok4MKVLM'}  // Replace with your meditation video ID
          onReady={() => console.log('Video is ready')}
          onChangeState={(state) => {
            if (state === 'playing') {
              setIsPlaying(true);
            } else {
              setIsPlaying(false);
            }
          }}
          onDuration={handleVideoDuration}  // Set the video duration in seconds
        />

        {/* Button to start the meditation */}
        <TouchableOpacity style={styles.startButton} onPress={() => setIsPlaying(!isPlaying)}>
          <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>

        {/* Adjust Duration Button */}
        <TouchableOpacity style={styles.button} onPress={() => console.log('Adjust Duration')}>
          <Text style={styles.buttonText}>Adjust Duration</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timer: {
    fontSize: hp(8),
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#6E44FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: hp(2.5),
    color: '#fff',
  },
});
