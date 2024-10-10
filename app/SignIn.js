import { LogBox, View, Text, TouchableOpacity, TextInput, Image, Pressable, Alert, KeyboardAvoidingView } from 'react-native';
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomeKeyboardView';
import { useAuth } from './context/AuthContext';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export default function SignIn() {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {login} = useAuth();

    const emailRef = useRef("");
    const passwordRef = useRef("");

    const handleLogin = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Sign In', "Please fill all the fields!");
            return;
        }
        setLoading(true);
        const response = await login(emailRef.current,passwordRef.current);
        setLoading(false);
        console.log('sign in response:',response);
        if(!response.success){
            Alert.alert('Sign In',response.msg);
        }
        // login process
    }

    return (
        <CustomKeyboardView style={{ flex: 1 }} behavior="padding">
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
                            <Text style={{ fontSize: hp(1.8), fontWeight: '600', textAlign: 'right', color: '#808080' }}>
                                Forgot Password?
                            </Text>
                        </View>

                        <View>
                            {
                                loading ? (
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <Loading size={hp(16)} />
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={handleLogin} style={{ height: hp(6.5), backgroundColor: '#4A90E2', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: hp(2.7), fontWeight: 'bold', color: 'white', letterSpacing: 0.5 }}>
                                            Sign In
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>

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
        </CustomKeyboardView>
    );
}
