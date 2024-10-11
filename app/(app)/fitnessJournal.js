import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Notification registration and generation
export async function registerForPushNotificationsAsync() {
    let token;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    return token;
}

export const generateNotification = async (title, body) => {
    // Show the notification to the user
    Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
        },
        trigger: null,
    });
};

export default function FitnessJournal() {
    const [entry, setEntry] = useState('');
    const [category, setCategory] = useState('Strength');
    const [emojiRating, setEmojiRating] = useState('');
    const [journal, setJournal] = useState([]);
    const [image, setImage] = useState(null); // Image URI
    const [editingId, setEditingId] = useState(null); // Track the ID of the entry being edited

    useEffect(() => {
        loadJournalEntries();
    }, []);

    const saveJournalEntries = async (entries) => {
        try {
            await AsyncStorage.setItem('journalEntries', JSON.stringify(entries));
        } catch (error) {
            console.error('Failed to save journal entries:', error);
        }
    };

    const loadJournalEntries = async () => {
        try {
            const storedEntries = await AsyncStorage.getItem('journalEntries');
            if (storedEntries !== null) {
                setJournal(JSON.parse(storedEntries));
            }
        } catch (error) {
            console.error('Failed to load journal entries:', error);
        }
    };

    const handleAddEntry = async () => {
        // Validation logic
        if (!entry.trim()) {
            Alert.alert('Validation Error', 'Please enter a description of your workout.');
            return;
        }
        if (!emojiRating) {
            Alert.alert('Validation Error', 'Please select how you felt after your workout.');
            return;
        }

        const newEntry = {
            id: editingId || moment().valueOf().toString(), // Unique ID or use the existing one for editing
            text: entry,
            date: moment().format('MMMM Do YYYY, h:mm a'),
            category: category,
            emoji: emojiRating,
            image: image, // Store the uploaded image URI
        };

        let updatedJournal;
        if (editingId) {
            updatedJournal = journal.map((item) =>
                item.id === editingId ? newEntry : item
            );
        } else {
            updatedJournal = [...journal, newEntry];
        }

        setJournal(updatedJournal);
        saveJournalEntries(updatedJournal);

        setEntry('');
        setEmojiRating('');
        setImage(null);
        setEditingId(null); // Reset editing mode

        // Trigger notification for adding or updating an entry
        const notificationMessage = editingId ? 'Journal entry updated successfully.' : 'Your workout has been added successfully.';
        await generateNotification('Fitness Journal', notificationMessage);
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access gallery is required!");
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
            setImage(manipResult.uri); // Update image state with resized image
        }
    };

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.status !== 'granted') {
            Alert.alert('Permission Required', 'You need to grant camera permission to take a photo');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
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
            setImage(manipResult.uri);
        }
    };

    const handleDeleteEntry = async (id) => {
        const updatedJournal = journal.filter((item) => item.id !== id);
        setJournal(updatedJournal);
        saveJournalEntries(updatedJournal);

        // Trigger notification for deleting an entry
        await generateNotification('Fitness Journal', 'Journal entry deleted successfully.');
    };

    const handleEditEntry = (item) => {
        setEntry(item.text);
        setCategory(item.category);
        setEmojiRating(item.emoji);
        setImage(item.image);
        setEditingId(item.id);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Text style={styles.header}>Fitness Journal</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Write about your workout..."
                    value={entry}
                    onChangeText={setEntry}
                />

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text style={styles.buttonText}>Upload from Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={takePhoto}>
                        <Text style={styles.buttonText}>Take a Photo</Text>
                    </TouchableOpacity>
                </View>

                {image && <Image source={{ uri: image }} style={styles.image} />}

                <Picker
                    selectedValue={category}
                    style={styles.picker}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                >
                    <Picker.Item label="Strength" value="Strength" />
                    <Picker.Item label="Cardio" value="Cardio" />
                    <Picker.Item label="Yoga" value="Yoga" />
                    <Picker.Item label="Stretching" value="Stretching" />
                </Picker>

                <Text style={styles.subHeader}>How did you feel?</Text>
                <View style={styles.emojiContainer}>
                    <TouchableOpacity onPress={() => setEmojiRating('💪')}>
                        <Text style={emojiRating === '💪' ? styles.selectedEmoji : styles.emoji}>💪</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEmojiRating('😄')}>
                        <Text style={emojiRating === '😄' ? styles.selectedEmoji : styles.emoji}>😄</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEmojiRating('😓')}>
                        <Text style={emojiRating === '😓' ? styles.selectedEmoji : styles.emoji}>😓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEmojiRating('😴')}>
                        <Text style={emojiRating === '😴' ? styles.selectedEmoji : styles.emoji}>😴</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleAddEntry}>
                    <Text style={styles.submitButtonText}>{editingId ? "Update Entry" : "Add Entry"}</Text>
                </TouchableOpacity>

                <View style={styles.journalContainer}>
                    {journal.map((item) => (
                        <View key={item.id} style={styles.journalEntry}>
                            <Text style={styles.entryCategory}>Category: {item.category}</Text>
                            <Text style={styles.entryText}>{item.text}</Text>
                            <Text style={styles.entryEmoji}>{item.emoji}</Text>
                            <Text style={styles.entryDate}>{item.date}</Text>
                            {item.image && <Image source={{ uri: item.image }} style={styles.entryImage} />}
                            <View style={styles.entryActions}>
                                <TouchableOpacity style={styles.actionButton} onPress={() => handleEditEntry(item)}>
                                    <Text style={styles.actionButtonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteEntry(item.id)}>
                                    <Text style={styles.actionButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F0E6FE',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6E44FF',
        marginBottom: 20,
    },
    input: {
        borderColor: '#b0c4de',
        borderWidth: 1,
        padding: 12,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#6E44FF',
        padding: 12,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    picker: {
        height: 50,
        marginVertical: 10,
        color: '#6E44FF',
    },
    subHeader: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
        color: '#2f4f4f',
    },
    emojiContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    emoji: {
        fontSize: 36,
    },
    selectedEmoji: {
        fontSize: 36,
        borderColor: '#6E44FF',
        borderWidth: 2,
        borderRadius: 10,
        padding: 5,
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 10,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#6E44FF',
        padding: 15,
        borderRadius: 10,
        marginVertical: 20,
    },
    submitButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    journalContainer: {
        marginTop: 20,
    },
    journalEntry: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#e6f0fa',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    entryCategory: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6E44FF',
    },
    entryText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#2f4f4f',
    },
    entryEmoji: {
        fontSize: 24,
        marginTop: 5,
    },
    entryDate: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#7f8c8d',
    },
    entryImage: {
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 10,
    },
    entryActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: '#6E44FF',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    actionButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
