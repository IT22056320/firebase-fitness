import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router'; // Use this for navigation
import { db } from '../firebaseConfig'; // Firebase config import
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import BottomNav from '../components/BottomNav';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SelectPlanScreen = () => {
  const router = useRouter();
  const [mealPlans, setMealPlans] = useState([]);

  // Get the screen width inside the component
  const screenWidth = Dimensions.get('window').width;
  const handleBack = () => {
    router.back();
  };

  // Fetch diet plans from Firebase
  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'dietPlans'));
        const plans = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMealPlans(plans);
      } catch (error) {
        console.error('Error fetching meal plans:', error);
      }
    };

    fetchMealPlans();
  }, []);

  // Delete plan from Firebase and update UI
  const handleRemovePlan = async (id) => {
    try {
      Alert.alert(
        'Delete Plan',
        'Are you sure you want to delete this plan?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              await deleteDoc(doc(db, 'dietPlans', id));
              setMealPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== id));
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error removing plan: ', error);
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
        <Image source={require('../assets/images/12.jpg')} style={[styles.mealImage, { width: screenWidth / 2 - 30 }]} />
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
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back-ios" size={24} color="purple" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select a Plan</Text>
      </View>

      {/* Meal Plans List */}
      {mealPlans.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No meal plans available.</Text>
      ) : (
        <FlatList
          data={mealPlans}
          renderItem={renderMealPlan}
          keyExtractor={(item) => item.id}
          numColumns={2} // Two-column layout for meal cards
          contentContainerStyle={styles.mealList}
        />
      )}

      {/* Customize Plan Button */}
      <TouchableOpacity style={styles.customizeButton} onPress={() => router.push('DiatPlan')}>
        <Text style={styles.customizeButtonText}>Customize Plan</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0E6FE', // Light background color for a cleaner look
    paddingTop:60,
    paddingBottom:80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'purple',
    marginLeft: 16,
  },
  subHeaderText: {
    fontSize: 18,
    color: '#4CAF50',
    marginTop: 5,
  },
  mealList: {
    paddingHorizontal: 10,
    paddingBottom: 80, // Space for the customize button
    marginTop: 40,
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
    height: 200, // Keep the height fixed
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
