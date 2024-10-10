import React, {useEffect} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageSlider from '../../components/ImageSlider';
import BodyParts from '../../components/BodyParts';
import { useRouter } from 'expo-router';
import BottomNav from '../../components/BottomNav';
import { registerForPushNotificationsAsync, generateNotification } from '../../utils/notifications'
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
  }),
});

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const handleSignOut = () => {
    router.push('/SignIn');
  };

  // Navigate to Fitness Journal screen
  const handleNavigateToFitnessJournal = async () => {
    router.push('/fitnessJournal');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.headerContainer}>
          <View style={styles.textContainer}>
            <Text style={[styles.headerText, styles.neutralText]}>READY TO</Text>
            <Text style={[styles.headerText, styles.highlightedText]}>WORKOUT</Text>
            
          </View>
          <View style={styles.signOutContainer}>
          <TouchableOpacity onPress={handleNavigateToFitnessJournal} style={styles.signOutButton}>
            <Text style={styles.signOutText}>Fitness Journal</Text>
          </TouchableOpacity>
        </View>
          <View style={styles.avatarContainer}>
            
          </View>
        </View>

        {/* Sign-out button */}
      

        {/* Image slider component */}
        <View>
          <ImageSlider />
        </View>

        {/* Body Parts */}
        <View style={{ flex: 1 }}>
          <BodyParts />
        </View>

       
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0E6FE',
    paddingVertical: 10,
    paddingBottom:80,
    paddingTop:-40
    
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(5),
  },
  textContainer: {
    justifyContent: 'center',
  },
  headerText: {
    fontSize: hp(4.5),
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  neutralText: {
    color: '#4B5563',
  },
  highlightedText: {
    color: '#E11D48',
    paddingBottom:10
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    height: hp(6),
    width: hp(6),
    borderRadius: hp(3),
  },
  notificationIconContainer: {
    height: hp(5.5),
    width: hp(5.5),
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(2.75),
    marginTop: 5,
  },
  signOutContainer: {
    alignItems: 'flex-end',
    marginRight: wp(5),
    marginTop: hp(1),
    paddingLeft:30
    
  },
  signOutButton: {
    backgroundColor: '#6E44FF',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: 10,
    
  },
  signOutText: {
    color: 'white',
    fontSize: hp(2),
  },
  fitnessJournalContainer: {
    alignItems: 'center',
    marginVertical: hp(2),
  },
  fitnessJournalButton: {
    backgroundColor: '#10B981',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: 10,
    
  },
  fitnessJournalText: {
    color: 'white',
    fontSize: hp(2.5),
  },
});
