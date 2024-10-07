import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import CustomKeyboardView from '../../components/CustomeKeyboardView';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../../components/BottomNav';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
    const { user, updateProfile, updateUserData } = useAuth();
    const [fullName, setFullName] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [profileImage, setProfileImage] = useState(user?.profileUrl || ''); // Image from Firebase or Placeholder

    useEffect(() => {
        loadProfileImage();
        if (user?.dateOfBirth) {
            // Convert Firebase Timestamp to JS Date if it exists
            const userDate = user?.dateOfBirth.seconds ? new Date(user?.dateOfBirth.seconds * 1000) : new Date(user?.dateOfBirth);
            setDateOfBirth(userDate);
        }
    }, [user?.dateOfBirth]);

    const loadProfileImage = async () => {
        try {
            const savedImageUri = await AsyncStorage.getItem('profileImage');
            if (savedImageUri) {
                setProfileImage(savedImageUri); // Set the image from AsyncStorage
            }
        } catch (error) {
            console.error('Failed to load profile image:', error);
        }
    };

    const handleSetting = () => {
        router.push('settings');
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowPicker(false); // Close picker after date selection
        setDateOfBirth(currentDate); // Update date state with selected date
    };

    const showDatePicker = () => {
        setShowPicker(true);
    };

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are 0-based
        const year = date.getFullYear();
        return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permission to access gallery is required!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const manipResult = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 300, height: 300 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.PNG }
            );
            setProfileImage(manipResult.uri); // Set the selected image as profile image
            saveProfileImage(manipResult.uri); // Save the image locally using AsyncStorage
        }
    };

    const saveProfileImage = async (uri) => {
        try {
            await AsyncStorage.setItem('profileImage', uri); // Save the image URI to AsyncStorage
            Alert.alert('Profile Image', 'Profile image updated locally');
        } catch (error) {
            console.error('Failed to save profile image:', error);
        }
    };

    const handleUpdateProfile = async () => {
        const updates = {
            username: fullName,
            email: email,
            phoneNumber: phoneNumber,
            dateOfBirth: dateOfBirth, // Update Firebase with the new date
            profileUrl: profileImage, // Update Firebase with the new profile image URL
        };

        const response = await updateProfile(user.userId, updates);
        if (response.success) {
            updateUserData(user.userId);
            Alert.alert('Success', 'Profile updated successfully');
        } else {
            Alert.alert('Error', response.msg || 'Failed to update profile');
        }
    };

    
    const handleBack = () => {
        router.back();
      };
    return (
        <CustomKeyboardView>
            <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Feather name="chevron-left" size={hp(3)} color="purple" onPress={handleBack} />
                <Text style={styles.headerTitle}>Profile</Text>
                <Feather name="settings" size={hp(3)} color="purple" onPress={handleSetting}/>
            </View>

                <View style={styles.profileImageContainer}>
                    <Image source={{ uri: profileImage || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
                    <TouchableOpacity onPress={pickImage} style={styles.cameraIconContainer}>
                        <Feather name="camera" size={hp(2)} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter your name"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
                            <Text style={styles.dateText}>{formatDate(dateOfBirth)}</Text>
                        </TouchableOpacity>
                        {showPicker && (
                            <DateTimePicker
                                value={dateOfBirth}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onChange}
                                maximumDate={new Date()}
                            />
                        )}
                    </View>

                    <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                        <Text style={styles.updateButtonText}>Update Profile</Text>
                    </TouchableOpacity>
                </View>
                <BottomNav />
            </SafeAreaView>
        </CustomKeyboardView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0E6FE',
        padding: wp(5),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(3),
    },
    headerTitle: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
        color: 'purple',
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: hp(3),
    },
    profileImage: {
        width: hp(15),
        height: hp(15),
        borderRadius: hp(7.5),
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: wp(35),
        backgroundColor: 'purple',
        borderRadius: hp(2),
        padding: hp(1),
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: hp(2),
        padding: wp(5),
        marginBottom: hp(12),
    },
    inputContainer: {
        marginBottom: hp(2),
    },
    label: {
        fontSize: hp(1.8),
        fontWeight: '600',
        marginBottom: hp(0.5),
        color: '#666',
    },
    input: {
        backgroundColor: '#F0E6FE',
        borderRadius: hp(1),
        padding: hp(1.5),
        fontSize: hp(2),
        flex: 1,
    },
    updateButton: {
        backgroundColor: 'purple',
        borderRadius: hp(1),
        padding: hp(2),
        alignItems: 'center',
        marginTop: hp(2),
    },
    updateButtonText: {
        color: 'white',
        fontSize: hp(2),
        fontWeight: 'bold',
    },
    dateButton: {
        borderRadius: hp(1),
        padding: hp(1.5),
        fontSize: hp(2),
        backgroundColor: '#F0E6FE',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
    },
});
