import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using Material Icons
import { useNavigation, useRoute } from '@react-navigation/native'; // Use navigation and route hook
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { router } from 'expo-router';

export default function BottomNav() {
  const navigation = useNavigation();
  const route = useRoute(); // Hook to access current route

  const handleHome = () => {
    router.push('Home');
  };

  const handleProfile = () => {
    router.push('settings');
  };

  const handleMeditation = () => {
    router.push('MeditationHome');
  };

  const handleDiet = () => {
    router.push('DiatPlanHome');
  };

  // Function to check if the current route is active
  const isActive = (screenName) => {
    return route.name === screenName;
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={handleHome} style={styles.navItem}>
        <Icon 
          name="home" 
          size={28} 
          color={isActive('Home') ? '#FF6347' : '#6E44FF'} // Highlight active icon
        />
        <Text style={[styles.navText, isActive('Home') && styles.activeText]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleMeditation} style={styles.navItem}>
        <Icon 
          name="self-improvement" 
          size={28} 
          color={isActive('MeditationHome') ? '#FF6347' : '#6E44FF'} 
        />
        <Text style={[styles.navText, isActive('MeditationHome') && styles.activeText]}>
          Meditation
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDiet} style={styles.navItem}>
        <Icon 
          name="restaurant" 
          size={28} 
          color={isActive('DiatPlanHome') ? '#FF6347' : '#6E44FF'} 
        />
        <Text style={[styles.navText, isActive('DiatPlanHome') && styles.activeText]}>
          Diet
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleProfile} style={styles.navItem}>
        <Icon 
          name="person" 
          size={28} 
          color={isActive('settings') ? '#FF6347' : '#6E44FF'} 
        />
        <Text style={[styles.navText, isActive('settings') && styles.activeText]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#F0E6FE',
    paddingVertical: hp(2),
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
    paddingHorizontal: wp(5),
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: '#6E44FF',
    marginTop: 4,
  },
  activeText: {
    color: '#FF6347', // Highlight color for active text
    fontWeight: 'bold',
  },
});
