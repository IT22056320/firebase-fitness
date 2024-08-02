import { View, Text, TouchableOpacity, TextInput, Image, Pressable } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SignIn() {

    const router = useRouter();

    return (
        <View style={{ flex: 1 }}>
            <StatusBar style='dark' />
            <View style={{ flex: 1, gap: 12, paddingTop: hp(8), paddingHorizontal: wp(5) }}>
                <View style={{ alignItems: 'center' }}>
                    <Image style={{ height: hp(25) }} resizeMode='contain' source={require('../assets/images/login.jpg')} />
                </View>
                <View style={{ gap: 4 }}>
                    <View style={{ gap: 10 }}>
                        <Text style={{ fontSize: hp(4), fontWeight: 'bold', letterSpacing: 0.5, textAlign: 'center', color: '#4A4A4A' }}>
                            Sign In
                        </Text>
                        <View style={{ height: hp(7), flexDirection: 'row', gap: 4, paddingHorizontal: 16, backgroundColor: '#F0F0F0', alignItems: 'center', borderRadius: 16 }}>
                            <Octicons name="mail" size={hp(2.7)} color="gray" />
                            <TextInput
                                style={{ fontSize: hp(2), flex: 1, fontWeight: '600', color: '#4A4A4A' }}
                                placeholder='Email Address'
                                placeholderTextColor={'gray'}
                            />
                        </View>

                        <View style={{ gap: 3 }}>
                            <View style={{ height: hp(7), flexDirection: 'row', gap: 4, paddingHorizontal: 16, backgroundColor: '#F0F0F0', alignItems: 'center', borderRadius: 16 }}>
                                <Octicons name="lock" size={hp(2.7)} color="gray" />
                                <TextInput
                                    style={{ fontSize: hp(2), flex: 1, fontWeight: '600', color: '#4A4A4A' }}
                                    placeholder='Password'
                                    placeholderTextColor={'gray'}
                                    secureTextEntry
                                />
                            </View>
                            <Text style={{ fontSize: hp(1.8), fontWeight: '600', textAlign: 'right', color: '#808080' }}>
                                Forgot Password?
                            </Text>
                        </View>

                        <TouchableOpacity style={{ height: hp(6.5), backgroundColor: '#4A90E2', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: hp(2.7), fontWeight: 'bold', color: 'white', letterSpacing: 0.5 }}>
                                Sign In
                            </Text>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: hp(1.8), fontWeight: '600', color: '#808080' }}>
                                Don't have an account? 
                            </Text>
                            <Pressable onPress={() => router.push('SignUp')}>
                                <Text style={{ fontSize: hp(1.8), fontWeight: '600', color: '#4A90E2', marginLeft: 4 }}>
                                    Sign Up
                                </Text>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </View>
        </View>
    );
}
