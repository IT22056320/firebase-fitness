import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Platform, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { countries } from '../../utils/countries'; // assuming you have a country code data source
import CustomKeyboardView from '../../components/CustomeKeyboardView';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../../components/BottomNav';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; // Add ImagePicker import

export default function Profile() {
    const { user, updateProfile, updateUserData } = useAuth();
    const [fullName, setFullName] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [selectedCountryCode, setSelectedCountryCode] = useState('+94'); // Default to Sri Lanka (+94)
    const [modalVisible, setModalVisible] = useState(false);
    const initialDate = user?.dateOfBirth
        ? (typeof user.dateOfBirth.toDate === 'function' ? user.dateOfBirth.toDate() : new Date(user.dateOfBirth))
        : new Date();
    const [dateOfBirth, setDateOfBirth] = useState(initialDate);
    const [showPicker, setShowPicker] = useState(false);
    const [profileImage, setProfileImage] = useState(user?.profileUrl || 'https://via.placeholder.com/150');

    const handleSetting = () => {
        router.push('settings');
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowPicker(Platform.OS === 'ios'); // Close picker on Android, stay open on iOS
        setDateOfBirth(currentDate);
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

    const handleUpdateProfile = async () => {
        const updates = {
            username: fullName,
            email: email,
            phoneNumber: phoneNumber,
            dateOfBirth: dateOfBirth,
            profileUrl: profileImage, // Add profile image update
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

    const pickImage = async () => {
        // Request permission to access media
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission to access the gallery is required!');
            return;
        }

        // Open the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri); // Set the selected image
        }
    };

    return (
        <CustomKeyboardView>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Feather name="chevron-left" size={hp(3)} color="purple" onPress={handleBack} />
                    <Text style={styles.headerTitle}>Profile</Text>
                    <Feather name="settings" size={hp(3)} color="purple" onPress={handleSetting} />
                </View>

                <View style={styles.profileImageContainer}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image
                            source={{ uri: profileImage }}
                            style={styles.profileImage}
                        />
                        <View style={styles.cameraIconContainer}>
                            <Feather name="camera" size={hp(2)} color="white" />
                        </View>
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
                        <View style={styles.phoneInputContainer}>
                            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.countryCodeButton}>
                                <Text>{selectedCountryCode}</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.input}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                placeholder="Enter your phone number"
                                keyboardType="phone-pad"
                            />
                        </View>
                        <Modal
                            visible={modalVisible}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={styles.modalView}>
                                <FlatList
                                    data={countries}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.countryItem}
                                            onPress={() => {
                                                setSelectedCountryCode(item.code);
                                                setModalVisible(false);
                                            }}
                                        >
                                            <Text>{`${item.name} (${item.code})`}</Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item) => item.code}
                                />
                            </View>
                        </Modal>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            editable={false}
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
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onChange}
                                maximumDate={new Date()} // Prevent future dates
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
    phoneInputContainer: {
        flexDirection: 'row',
    },
    countryCodeButton: {
        backgroundColor: '#F0E6FE',
        padding: 10,
        borderRadius: hp(1),
        marginRight: 10,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    countryItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
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
    updateButton: {
        backgroundColor: '#6E44FF',
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
});
