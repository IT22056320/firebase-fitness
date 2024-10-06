import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using Material Icons
import { useNavigation } from '@react-navigation/native'; // Use navigation hook
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { router } from 'expo-router';

export default function BottomNav() {
  const navigation = useNavigation(); // Hook to access navigation object
  
  const handleHome = () => {
    router.push('Home');
  };

  const handleProfile = () => {
    router.push('settings');
  };

  const handleMeditation = () => {
    router.push('MeditationHome'); 
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={handleHome}>
        <Icon name="home" size={24} color="#6E44FF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleMeditation}>
        <Icon name="self-improvement" size={24} color="#6E44FF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Diet')}>
        <Icon name="restaurant" size={24} color="#6E44FF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleProfile}>
        <Icon name="person" size={24} color="#6E44FF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#F0E6FE', // Background color for the BottomNav
    paddingVertical: hp(2), // Vertical padding
    borderTopWidth: 1, // Optional: Border on the top
    borderTopColor: '#ddd', // Optional: Color of the top border
    alignItems: 'center', // Center items horizontally
    justifyContent: 'space-around', // Space items evenly
    flexDirection: 'row', // Align items in a row
    position: 'absolute', // Keep it fixed at the bottom
    bottom: 0, // Position it at the bottom of the screen
    left: 0, // Align to the left edge
    right: 0, // Align to the right edge
    elevation: 5, // Add elevation for Android shadow effect
  },    
});
