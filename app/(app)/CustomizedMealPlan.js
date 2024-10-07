import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNav from '../../components/BottomNav';

const mealPlans = {
  Underweight: [
    {
      meal: 'High-Protein Breakfast',
      description: 'Oatmeal with peanut butter, eggs, and a protein shake.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'), // Add image for each meal
    },
    {
      meal: 'Lunch',
      description: 'Grilled chicken breast with quinoa, mixed veggies, and avocado.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
    {
      meal: 'Dinner',
      description: 'Salmon with sweet potatoes and a large mixed salad with olive oil.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
    {
      meal: 'Snacks',
      description: 'Nuts, Greek yogurt with honey, and smoothies with almond milk.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
  ],
  Healthy: [
    {
      meal: 'Balanced Breakfast',
      description: 'Greek yogurt with fresh fruit and granola.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
    {
      meal: 'Lunch',
      description: 'Grilled turkey wrap with whole wheat tortilla, spinach, and hummus.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
    {
      meal: 'Dinner',
      description: 'Grilled chicken or tofu stir-fry with brown rice and veggies.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
    {
      meal: 'Snacks',
      description: 'Fruit, mixed nuts, and hummus with vegetable sticks.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
  ],
  Overweight: [
    {
      meal: 'Low-Carb Breakfast',
      description: 'Scrambled eggs with spinach and mushrooms, and black coffee.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
    {
      meal: 'Lunch',
      description: 'Grilled fish with steamed broccoli and quinoa.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
    {
      meal: 'Dinner',
      description: 'Chicken salad with a variety of vegetables and olive oil dressing.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
    {
      meal: 'Snacks',
      description: 'Carrot sticks, almonds, and a small apple.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
  ],
  Obese: [
    {
      meal: 'Low-Calorie Breakfast',
      description: 'Egg whites with spinach and whole grain toast.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
    {
      meal: 'Lunch',
      description: 'Grilled chicken salad with mixed greens, cucumbers, and tomatoes.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
    {
      meal: 'Dinner',
      description: 'Steamed salmon with asparagus and a small portion of brown rice.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
    {
      meal: 'Snacks',
      description: 'Cucumber slices, boiled eggs, and low-fat cheese.',
      image: require('../../assets/images/pexels-chanwalrus-958545.jpg'),
    },
  ],
};

const CustomizedMealPlan = () => {
  const params = useLocalSearchParams();
  const { bmiCategory } = params;
  const [mealPlan, setMealPlan] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (bmiCategory && mealPlans[bmiCategory]) {
      setMealPlan(mealPlans[bmiCategory]);
    }
  }, [bmiCategory]);

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Meal Plan for {bmiCategory} BMI</Text>
      
      <ScrollView style={styles.mealPlanContainer}>
        {mealPlan.length > 0 ? (
          mealPlan.map((item, index) => (
            <View key={index} style={styles.mealCard}>
              <Image source={item.image} style={styles.mealImage} />
              <Text style={styles.mealTitle}>{item.meal}</Text>
              <Text style={styles.mealDescription}>{item.description}</Text>
            </View>
          ))
        ) : (
          <Text>No meal plan available for this category.</Text>
        )}
      </ScrollView>

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0E6FE',
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#4A148C',
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4A148C',
    marginBottom: 20,
  },
  mealPlanContainer: {
    marginTop: 10,
  },
  mealCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  mealImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 5,
  },
  mealDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default CustomizedMealPlan;
