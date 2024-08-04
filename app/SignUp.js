import { View, Text, TouchableOpacity, TextInput, Image, Pressable, Alert, KeyboardAvoidingView } from 'react-native';
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomeKeyboardView';

export default function SignUp() {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const emailRef = useRef("");
    const passwordRef = useRef("");
    const usernameRef = useRef("");
    const profileRef = useRef("");

    const handleRegister = async () => {
        if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profileRef.current) {
            Alert.alert('Sign Up', "Please fill all the fields!");
            return;
        }
        // register process
    }

    return (
        <CustomKeyboardView style={{ flex: 1 }} behavior="padding">
            <StatusBar style='dark' />
            <View style={{ flex: 1, gap: 12, paddingTop: hp(7), paddingHorizontal: wp(5) }}>
                <View style={{ alignItems: 'center' }}>
                    <Image style={{ height: hp(25) }} resizeMode='contain' source={require('../assets/images/register.png')} />
                </View>
                <View style={{ gap: 4 }}>
                    <View style={{ gap: 10 }}>
                        <Text style={{ fontSize: hp(4), fontWeight: 'bold', letterSpacing: 0.5, textAlign: 'center', color: '#4A4A4A' }}>
                            Sign Up
                        </Text>
                        <View style={{ height: hp(7), flexDirection: 'row', gap: 4, paddingHorizontal: 16, backgroundColor: '#F0F0F0', alignItems: 'center', borderRadius: 16 }}>
                            <Feather name="user" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={value => usernameRef.current = value}
                                style={{ fontSize: hp(2), flex: 1, fontWeight: '600', color: '#4A4A4A' }}
                                placeholder='Username'
                                placeholderTextColor={'gray'}
                            />
                        </View>

                        <View style={{ height: hp(7), flexDirection: 'row', gap: 4, paddingHorizontal: 16, backgroundColor: '#F0F0F0', alignItems: 'center', borderRadius: 16 }}>
                            <Octicons name="mail" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={value => emailRef.current = value}
                                style={{ fontSize: hp(2), flex: 1, fontWeight: '600', color: '#4A4A4A' }}
                                placeholder='Email Address'
                                placeholderTextColor={'gray'}
                            />
                        </View>

                      
                        <View style={{ gap: 3 }}>
                            <View style={{ height: hp(7), flexDirection: 'row', gap: 4, paddingHorizontal: 16, backgroundColor: '#F0F0F0', alignItems: 'center', borderRadius: 16 }}>
                                <Octicons name="lock" size={hp(2.7)} color="gray" />
                                <TextInput
                                    onChangeText={value => passwordRef.current = value}
                                    style={{ fontSize: hp(2), flex: 1, fontWeight: '600', color: '#4A4A4A' }}
                                    placeholder='Password'
                                    placeholderTextColor={'gray'}
                                    secureTextEntry
                                />
                            </View>
                           
                        </View>

                        <View style={{ height: hp(7), flexDirection: 'row', gap: 4, paddingHorizontal: 16, backgroundColor: '#F0F0F0', alignItems: 'center', borderRadius: 16 }}>
                            <Feather name="image" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={value => profileRef.current = value}
                                style={{ fontSize: hp(2), flex: 1, fontWeight: '600', color: '#4A4A4A' }}
                                placeholder='Profile url'
                                placeholderTextColor={'gray'}
                            />
                        </View>
                        <View>
                            {
                                loading ? (
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <Loading size={hp(16)} />
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={handleRegister} style={{ height: hp(6.5), backgroundColor: '#4A90E2', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: hp(2.7), fontWeight: 'bold', color: 'white', letterSpacing: 0.5 }}>
                                            Sign Up
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: hp(1.8), fontWeight: '600', color: '#808080' }}>
                               Already an account? 
                            </Text>
                            <Pressable onPress={() => router.push('SignIn')}>
                                <Text style={{ fontSize: hp(1.8), fontWeight: '600', color: '#4A90E2', marginLeft: 4 }}>
                                    Sign In
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    );
}
