import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function StartPage() {

  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <StatusBar style="light" />
      <Image style={{ height: '100%', width: '100%', position: 'absolute' }} source={require('../assets/images/welcome.png')} />
      <LinearGradient 
        colors={['transparent','#1818b']}
        style={{ width: wp(100), height: hp(70), justifyContent: 'flex-end', paddingBottom: 12 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
      >
        <Animated.View style={{ alignItems: 'center' }} entering={FadeInDown.delay(100).springify()}>
          <Text style={{ fontSize: hp(5), color: 'white', fontWeight: 'bold', letterSpacing: 1 }}>
            Best <Text style={{ color: '#E11D48' }}>Workouts</Text>
          </Text>
          <Text style={{ fontSize: hp(5), color: 'white', fontWeight: 'bold', letterSpacing: 1 }}>
            For You
          </Text>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(200).springify()}>
          <TouchableOpacity
            onPress={() => router.push('SignIn')}
            style={{ height: hp(7), width: wp(80), backgroundColor: '#E11D48', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 50, borderWidth: 2, borderColor: '#E5E7EB' }}
          >
            <Text style={{ fontSize: hp(3), color: 'white', fontWeight: 'bold' }}>
              Get Started
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
