import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as FilteredImage, Grayscale, Sepia, Invert } from 'react-native-image-filter-kit';
import { useAuth } from '../../context/AuthContext';

export default function AvatarCreator() {
  const [useAvatarMode, setUseAvatarMode] = useState(false); // To toggle avatar mode
  const { user } = useAuth();

  const toggleAvatarMode = () => {
    setUseAvatarMode((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileImageContainer}>
        {useAvatarMode ? (
          <FilteredImage
            style={styles.profileImage}
            source={{ uri: user?.profileUrl || 'https://via.placeholder.com/150' }}
            config={{
              sepia: {
                intensity: 0.8,
              },
            }}
          />
        ) : (
          <Image
            source={{ uri: user?.profileUrl || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
        )}
        <TouchableOpacity style={styles.avatarToggleButton} onPress={toggleAvatarMode}>
          <Text style={styles.avatarToggleButtonText}>
            {useAvatarMode ? 'Normal Image' : 'Convert to Avatar'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0E6FE',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  avatarToggleButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'purple',
    borderRadius: 10,
  },
  avatarToggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
