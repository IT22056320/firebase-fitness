import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageSlider from '../../components/ImageSlider';
import BodyParts from '../../components/BodyParts';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  const handleSignOut = () => {
    // Implement sign-out logic here, such as clearing tokens or navigating to the login page
    router.push('/SignIn');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <Text style={[styles.headerText, styles.neutralText]}>READY TO</Text>
          <Text style={[styles.headerText, styles.highlightedText]}>WORKOUT</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../assets/images/avatar.png')}
            style={styles.avatar}
          />
          <View style={styles.notificationIconContainer}>
            <Ionicons name="notifications" size={hp(3)} color="gray" />
          </View>
        </View>
      </View>

      {/* Sign-out button */}
      <View style={styles.signOutContainer}>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Image slider component */}
      <View>
        <ImageSlider />
      </View>

      <View className="flex-1">
        <BodyParts />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 10,
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
  },
  signOutButton: {
    backgroundColor: '#E11D48',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: 10,
  },
  signOutText: {
    color: 'white',
    fontSize: hp(2),
  },
});
