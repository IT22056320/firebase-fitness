import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Import useRoute from @react-navigation/native
import { useRouter } from 'expo-router';

const ViewMeal = () => {
  const router = useRouter();
  const route = useRoute(); // Use useRoute to get the passed parameters
  const { mealPlan } = route.params; // Get the mealPlan from route.params

  const mealPlanDetails = JSON.parse(mealPlan); // Convert the string back to an object

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('SelectAPlan')}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.mealTitle}>{mealPlanDetails.planName}</Text>
      {/* Plan Image */}
      <Image source={require('../assets/images/pexels-chanwalrus-958545.jpg')} style={styles.mealImage} />

      {/* Plan Title and Description */}

      <Text style={styles.mealDescription}>{mealPlanDetails.description}</Text>

      {/* Total Calories */}
      <Text style={styles.mealCalories}>
        Total Calories: <Text style={styles.caloriesNumber}>{mealPlanDetails.totalCalories}</Text>
      </Text>

      {/* Meals List */}
      <FlatList
        data={mealPlanDetails.meals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text style={styles.mealItemText}>🍽️ {item}</Text>
          </View>
        )}
        ListHeaderComponent={<Text style={styles.mealsHeader}>Meals</Text>}
        scrollEnabled={false} // Disable scrolling on FlatList to make it fit inside ScrollView
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA', // Light background for a clean look
  },
  mealImage: {
    width: '100%',
    height: 250, // Increased the height for a more immersive image
    borderRadius: 15,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#6A1B9A',
    padding: 14,
    borderRadius: 30,
    marginTop:20,
    marginBottom: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20, // Increased font size for better visibility
    fontWeight: '600',
  },
  mealTitle: {
    fontSize: 32, // Increased font size for a more impressive title
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  mealDescription: {
    fontSize: 18, // Increased font size for better readability
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 26, // Added line height for smoother text readability
  },
  mealCalories: {
    fontSize: 20, // Increased font size for calories info
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '500',
  },
  caloriesNumber: {
    fontSize: 22, // Emphasized the calorie count
    fontWeight: '700',
    color: '#E74C3C',
  },
  mealsHeader: {
    padding:14,
    fontSize: 26, // Larger header for "Meals" section
    fontWeight: '700',
    color: '#6A1B9A',
    marginBottom: 15,
    textAlign: 'center',
  },
  mealItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12, // Added more spacing between meals
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mealItemText: {
    fontSize: 20, // Larger font size for meal items
    color: '#34495E',
    fontWeight: '500',
  },
});

export default ViewMeal;
