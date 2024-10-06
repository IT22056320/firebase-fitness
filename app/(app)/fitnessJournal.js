import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FitnessJournal() {
  const [entry, setEntry] = useState('');
  const [category, setCategory] = useState('Strength');
  const [emojiRating, setEmojiRating] = useState('');
  const [journal, setJournal] = useState([]);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null); // Track the ID of the entry being edited

  // Load journal entries on component mount
  useEffect(() => {
    loadJournalEntries();
  }, []);

  // Save journal entries to AsyncStorage
  const saveJournalEntries = async (entries) => {
    try {
      await AsyncStorage.setItem('journalEntries', JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save journal entries:', error);
    }
  };

  // Load journal entries from AsyncStorage
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

  // Add or update a journal entry
  const handleAddEntry = () => {
    const newEntry = {
      id: editingId || moment().valueOf().toString(), // Unique ID or use the existing one for editing
      text: entry,
      date: moment().format('MMMM Do YYYY, h:mm a'),
      category: category,
      emoji: emojiRating,
      image: image,
    };

    let updatedJournal;
    if (editingId) {
      // Update the existing entry
      updatedJournal = journal.map((item) =>
        item.id === editingId ? newEntry : item
      );
    } else {
      // Add a new entry
      updatedJournal = [...journal, newEntry];
    }

    setJournal(updatedJournal);
    saveJournalEntries(updatedJournal); // Save to AsyncStorage

    // Reset form after adding/updating
    setEntry('');
    setEmojiRating('');
    setImage(null);
    setEditingId(null); // Reset editing mode
  };

  // Pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  // Delete a journal entry
  const handleDeleteEntry = (id) => {
    const updatedJournal = journal.filter((item) => item.id !== id);
    setJournal(updatedJournal);
    saveJournalEntries(updatedJournal); // Update AsyncStorage
  };

  // Edit a journal entry (load it into the form)
  const handleEditEntry = (item) => {
    setEntry(item.text);
    setCategory(item.category);
    setEmojiRating(item.emoji);
    setImage(item.image);
    setEditingId(item.id); // Set the ID of the entry being edited
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

        <Button title="Upload Image" onPress={pickImage} />
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

        <Button
          title={editingId ? "Update Entry" : "Add Entry"} // Change button text based on mode
          onPress={handleAddEntry}
        />

        <View style={styles.journalContainer}>
          {journal.map((item) => (
            <View key={item.id} style={styles.journalEntry}>
              <Text style={styles.entryCategory}>Category: {item.category}</Text>
              <Text style={styles.entryText}>{item.text}</Text>
              <Text style={styles.entryEmoji}>{item.emoji}</Text>
              <Text style={styles.entryDate}>{item.date}</Text>
              {item.image && <Image source={{ uri: item.image }} style={styles.entryImage} />}
              <View style={styles.entryActions}>
                <Button title="Edit" onPress={() => handleEditEntry(item)} />
                <Button title="Delete" onPress={() => handleDeleteEntry(item.id)} />
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
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  input: {
    borderColor: '#bdc3c7',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
    marginVertical: 10,
    color: '#2c3e50',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 32,
  },
  selectedEmoji: {
    fontSize: 32,
    borderColor: '#10B981',
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
  },
  journalContainer: {
    marginTop: 20,
  },
  journalEntry: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  entryText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#34495e',
  },
  entryCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
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
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
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
});
