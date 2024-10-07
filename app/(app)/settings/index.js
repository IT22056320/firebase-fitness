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

  const handleAvatar = () => {
    router.push('AvatarCreator'); // Ensure 'AvatarCreator' is registered in your routing configuration
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button and title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
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
        <TouchableOpacity style={styles.avatarButton} onPress={handleAvatar}>
          <Icon name="person" size={24} color="#6E44FF" />
          <Text style={styles.avatarText}>Avatar</Text>
          <Icon name="chevron-right" size={24} color="#6E44FF" />
        </TouchableOpacity>
      </View>

      {/* General Settings */}
      <ScrollView style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>General Setting</Text>

        <TouchableOpacity style={styles.settingsOption} onPress={handleProfile}>
          <Icon name="person" size={24} color="#6E44FF" />
          <Text style={styles.optionText}>Profile</Text>
          <Icon name="chevron-right" size={24} color="#6E44FF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsOption} onPress={handleCalculator}>
          <Icon name="fitness-center" size={24} color="#6E44FF" />
          <Text style={styles.optionText}>BMI Calculator</Text>
          <Icon name="chevron-right" size={24} color="#6E44FF" />
        </TouchableOpacity>

        {/* Achievements Button */}
        <TouchableOpacity style={styles.settingsOption} onPress={handleAchievements}>
          <Icon name="emoji-events" size={24} color="#6E44FF" />
          <Text style={styles.optionText}>Achievements</Text>
          <Icon name="chevron-right" size={24} color="#6E44FF" />
        </TouchableOpacity>

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => alert('Logging out...')}>
          <Icon name="exit-to-app" size={24} color="#6E44FF" />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6E44FF',
    marginLeft: 16,
  },
  profileSection: {
    backgroundColor: '#E5DFFF',
    padding: 16,
    borderRadius: 12,
    margin: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  userStatus: {
    fontSize: 14,
    color: '#000',
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarText: {
    marginLeft: 8,
    color: '#6E44FF',
  },
  settingsSection: {
    flex: 1,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6E44FF',
    marginBottom: 16,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    marginLeft: 16,
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 32,
  },
});

export default Settings;
