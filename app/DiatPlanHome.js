import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


const NutritionScreen = () => {
    const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Top section with Image */}
      <Image source={require('../assets/images/pexels-chanwalrus-958545.jpg')} style={styles.topImage} />
      {/* Personalized Nutrition Plan */}
      <View style={styles.planContainer}>
        <Text style={styles.title}>Personalized nutrition plan</Text>
        <Text style={styles.subtitle}>
          Based on your goals and lifestyle
        </Text>
        <Text style={styles.subtitle}>
          Start your journey with a personalized plan
        </Text>
      </View>

      {/* Track your progress section */}
      <View style={styles.progressContainer}>
        <Text style={styles.trackTitle}>Track your progress</Text>
        <View style={styles.caloriesCard}>
          <Text style={styles.caloriesTitle}>Calories</Text>
          <Text style={styles.caloriesAmount}>2000</Text>
          <Text style={styles.caloriesToday}>Today -10%</Text>
        </View>
      </View>

      {/* Navigation Links */}
      <View style={styles.navContainer}>
        <TouchableOpacity>
          <Text style={styles.navLink}onPress={() => router.push('SelectAPlan')}>My Diet Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navLink}onPress={() => router.push('bmiCalculator')}>Calculate BMI</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navLink}onPress={() => router.push('DiatPlan')}>Customize Meal Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topImage: {
    width: '100%',
    height: 200,
  },
  planContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A1B9A',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
  },
  progressContainer: {
    padding: 20,
  },
  trackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  caloriesCard: {
    backgroundColor: '#F3E5F5',
    padding: 20,
    borderRadius: 10,
  },
  caloriesTitle: {
    fontSize: 18,
    color: '#333',
  },
  caloriesAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6A1B9A',
  },
  caloriesToday: {
    fontSize: 16,
    color: '#E57373',
  },
  navContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  navLink: {
    fontSize: 18,
    paddingVertical: 10,
    color: '#6A1B9A',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
});

export default NutritionScreen;
