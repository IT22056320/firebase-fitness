import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { router } from 'expo-router';

export default function CustomGoals() {
  const [goal, setGoal] = useState('');
  const [category, setCategory] = useState('Fitness');
  const [goals, setGoals] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const saveGoals = async (goalsList) => {
    try {
      await AsyncStorage.setItem('wellnessGoals', JSON.stringify(goalsList));
    } catch (error) {
      console.error('Failed to save goals:', error);
    }
  };

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem('wellnessGoals');
      if (storedGoals !== null) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  };

  const handleAddGoal = () => {
    if (!goal) {
      Alert.alert('Please enter a goal');
      return;
    }

    const newGoal = {
      id: editingId || new Date().getTime().toString(),
      text: goal,
      category: category,
    };

    let updatedGoals;
    if (editingId) {
      updatedGoals = goals.map((item) => (item.id === editingId ? newGoal : item));
    } else {
      updatedGoals = [...goals, newGoal];
    }

    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    setGoal('');
    setEditingId(null); // Reset edit mode
  };

  const handleDeleteGoal = (id) => {
    const updatedGoals = goals.filter((item) => item.id !== id);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const handleEditGoal = (item) => {
    setGoal(item.text);
    setCategory(item.category);
    setEditingId(item.id);
  };

  const recommendations = (category) => {
    switch (category) {
      case 'Fitness':
        return 'Recommendation: Try 30 minutes of strength training every other day.';
      case 'Sleep':
        return 'Recommendation: Avoid screens 1 hour before bed and try meditation before sleep.';
      case 'Stress':
        return 'Recommendation: Incorporate 10 minutes of breathing exercises daily.';
      default:
        return 'No specific recommendations available.';
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <Feather name="chevron-left" size={hp(3)} color="purple" onPress={handleBack} />
        <Text style={styles.header}>Custom Wellness Goals</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter your wellness goal..."
        value={goal}
        onChangeText={setGoal}
      />

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={category === 'Fitness' ? styles.selectedCategory : styles.button}
          onPress={() => setCategory('Fitness')}
        >
          <Text style={styles.buttonText}>Fitness</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={category === 'Sleep' ? styles.selectedCategory : styles.button}
          onPress={() => setCategory('Sleep')}
        >
          <Text style={styles.buttonText}>Sleep</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={category === 'Stress' ? styles.selectedCategory : styles.button}
          onPress={() => setCategory('Stress')}
        >
          <Text style={styles.buttonText}>Stress</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleAddGoal}>
        <Text style={styles.submitButtonText}>{editingId ? 'Update Goal' : 'Add Goal'}</Text>
      </TouchableOpacity>

      <View style={styles.goalsContainer}>
        {goals.map((item) => (
          <View key={item.id} style={styles.goalItem}>
            <Text style={styles.goalText}>Goal: {item.text}</Text>
            <Text style={styles.categoryText}>Category: {item.category}</Text>
            <Text style={styles.recommendation}>{recommendations(item.category)}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleEditGoal(item)}>
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteGoal(item.id)}>
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F0E6FE',
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6E44FF',
    marginLeft: 10,
  },
  input: {
    borderColor: '#b0c4de',
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6E44FF',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: '#4b2cb3',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#6E44FF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalsContainer: {
    marginTop: 10,
  },
  goalItem: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  goalText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 14,
    color: '#6E44FF',
    marginVertical: 5,
  },
  recommendation: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#7f8c8d',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#6E44FF',
    padding: 10,
    borderRadius: 8,
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
