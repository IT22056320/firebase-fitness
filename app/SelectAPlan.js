import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // Use this for navigation
import { db } from '../firebaseConfig'; // Firebase config import
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const SelectPlanScreen = () => {
  const router = useRouter();
  const [mealPlans, setMealPlans] = useState([]);

  // Fetch diet plans from Firebase
  useEffect(() => {
    const fetchMealPlans = async () => {
      const querySnapshot = await getDocs(collection(db, 'dietPlans'));
      const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMealPlans(plans);
    };

    fetchMealPlans();
  }, []);

  // Delete plan from Firebase and update UI
  const handleRemovePlan = async (id) => {
    try {
      Alert.alert(
        "Delete Plan",
        "Are you sure you want to delete this plan?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              await deleteDoc(doc(db, 'dietPlans', id));
              setMealPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
            }
          }
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error("Error removing plan: ", error);
    }
  };

  // Handle navigation to ViewMeal screen
  const handleViewMeal = (mealPlan) => {
    router.push({
      pathname: 'ViewMeal',
      params: { mealPlan: JSON.stringify(mealPlan) }, // Pass the meal plan as a string
    });
  };

  const renderMealPlan = ({ item }) => (
    <View style={styles.mealCard}>
      <TouchableOpacity onPress={() => handleViewMeal(item)}>
        <Image source={require('../assets/images/pexels-chanwalrus-958545.jpg')} style={styles.mealImage} />
      </TouchableOpacity>
      <Text style={styles.mealTitle}>{item.planName}</Text>
      <Text style={styles.mealDuration}>{item.totalCalories} calories</Text>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemovePlan(item.id)}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Select a Plan</Text>
        <Text style={styles.subHeaderText}>Meal Plans</Text>
      </View>

      {/* Meal Plans List */}
      <FlatList
        data={mealPlans}
        renderItem={renderMealPlan}
        keyExtractor={(item) => item.id}
        // Two-column layout for meal cards
        contentContainerStyle={styles.mealList}
      />

      {/* Customize Plan Button */}
      <TouchableOpacity style={styles.customizeButton} onPress={() => router.push('DiatPlan')}>
        <Text style={styles.customizeButtonText}>Customize Plan</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('Home')}>
          <Text style={styles.navLink}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navLink}>Meditation</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('DietPlanHome')}>
          <Text style={styles.navLink}>Diet</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navLink}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Light background color for a cleaner look
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF', // White background for header
  },
  headerText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#6A1B9A',
  },
  subHeaderText: {
    fontSize: 18,
    color: '#4CAF50',
    marginTop: 5,
  },
  mealList: {
    paddingHorizontal: 10,
    paddingBottom: 80, // Space for the customize button
  },
  mealCard: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background for meal cards
    margin: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Add elevation for Android
    padding: 10,
    alignItems: 'center',
  },
  mealImage: {
    width: 350,
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light border for image
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  mealDuration: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#FFCDD2',
    paddingVertical: 5,
    borderRadius: 5,
    width: 80,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#D32F2F', // Red border for remove button
  },
  removeButtonText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
  },
  customizeButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 15,
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 4, // Add elevation for button
  },
  customizeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF', // White background for bottom navigation
  },
  navLink: {
    fontSize: 16,
    color: '#6A1B9A',
    fontWeight: '500',
  },
});

export default SelectPlanScreen;
