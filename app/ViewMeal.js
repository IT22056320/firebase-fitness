import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const ViewMeal = () => {
  const router = useRouter();
  const route = useRoute();
  const { mealPlan } = route.params;

  const mealPlanDetails = JSON.parse(mealPlan);

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('SelectAPlan')}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Plan Title */}
      <Text style={styles.mealTitle}>{mealPlanDetails.planName}</Text>

      {/* Plan Image */}
      <Image source={require('../assets/images/pexels-chanwalrus-958545.jpg')} style={styles.mealImage} />

      {/* Plan Description */}
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
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0E6FE', // Light grey background for a modern look
    paddingTop:60
  },
  backButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignSelf: 'flex-start',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  mealTitle: {
    fontSize: 30, // Reduced font size for better visual hierarchy
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  mealImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  mealDescription: {
    fontSize: 17,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  mealCalories: {
    fontSize: 20,
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '500',
  },
  caloriesNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E74C3C',
  },
  mealsHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6A1B9A',
    marginBottom: 15,
    textAlign: 'center',
  },
  mealItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  mealItemText: {
    fontSize: 18,
    color: '#34495E',
    fontWeight: '500',
    textAlign: 'left',
  },
});

export default ViewMeal;
