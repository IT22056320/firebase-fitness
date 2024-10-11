import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../../../components/BottomNav';

const Settings = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

 

  const handleProfile = () => {
    router.push('profile');
  };

  const handleCalculator = () => {
    router.push('bmiCalculator');
  };

  const handleAchievements = () => {
    router.push('AchievementsPage');
  };

  const handleBloodPressure = () => {
    router.push('BloodPressureHeartRate');
  };

  const handleSignOut = () => {
    router.push('/SignIn');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button and title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back-ios" size={24} color="#6E44FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* User profile section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user?.profileUrl || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.username || 'User'}</Text>
          <Text style={styles.userStatus}>
            Active <Icon name="circle" size={10} color="green" />
          </Text>
        </View>
      </View>

      {/* General Settings */}
      <ScrollView style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>General Settings</Text>

        <TouchableOpacity style={styles.settingsOption} onPress={handleProfile}>
          <View style={styles.iconContainer}>
            <Icon name="person" size={20} color="#6E44FF" />
          </View>
          <Text style={styles.optionText}>Profile</Text>
          <Icon name="chevron-right" size={24} color="#6E44FF" />
        </TouchableOpacity>

      

        <TouchableOpacity style={styles.settingsOption} onPress={handleCalculator}>
          <View style={styles.iconContainer}>
            <Icon name="fitness-center" size={20} color="#6E44FF" />
          </View>
          <Text style={styles.optionText}>BMI Calculator</Text>
          <Icon name="chevron-right" size={24} color="#6E44FF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsOption} onPress={handleAchievements}>
          <View style={styles.iconContainer}>
            <Icon name="emoji-events" size={20} color="#6E44FF" />
          </View>
          <Text style={styles.optionText}>Achievements</Text>
          <Icon name="chevron-right" size={24} color="#6E44FF" />
        </TouchableOpacity>

        {/* Blood Pressure and Heart Rate Button */}
        <TouchableOpacity style={styles.settingsOption} onPress={handleBloodPressure}>
          <View style={styles.iconContainer}>
            <Icon name="favorite" size={20} color="#6E44FF" />
          </View>
          <Text style={styles.optionText}>Blood Pressure & Heart Rate</Text>
          <Icon name="chevron-right" size={24} color="#6E44FF" />
        </TouchableOpacity>

        {/* Logout button */}
        <TouchableOpacity style={[styles.settingsOption, styles.logoutButton]} onPress={handleSignOut}>
          <View style={styles.iconContainer}>
            <Icon name="exit-to-app" size={20} color="#6E44FF" />
          </View>
          <Text style={styles.optionText}>Logout</Text>
          <Icon name="chevron-right" size={24} color="#6E44FF" />
        </TouchableOpacity>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0E6FE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6E44FF',
    marginLeft: 16,
  },
  profileSection: {
    backgroundColor: '#E5DFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  userStatus: {
    fontSize: 14,
    color: '#2C3E50',
  },
  settingsSection: {
    flex: 1,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6E44FF',
    marginBottom: 10,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#34495E',
  },
  logoutButton: {
    backgroundColor: '#F8E5E5',
  },
});

export default Settings;
