//diatPlan


import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Firebase Firestore
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage
import * as ImagePicker from 'expo-image-picker'; // Image Picker

const AddToPlanScreen = () => {
  const router = useRouter();
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const db = getFirestore();
  const storage = getStorage();

  // Food categories and their calories
  const mainFood = [
    { id: '1', name: 'Rice (100g cooked)', calories: 130 },
    { id: '2', name: 'Quinoa (100g cooked)', calories: 120 },
    { id: '3', name: 'Whole Wheat Bread (1 slice, 40g)', calories: 100 },
    { id: '4', name: 'Pasta (100g cooked)', calories: 131 },
    { id: '5', name: 'Brown Rice (100g cooked)', calories: 112 },
    { id: '6', name: 'Sweet Potatoes (100g)', calories: 86 },
    { id: '7', name: 'Mashed Potatoes (100g)', calories: 90 },
    { id: '8', name: 'Couscous (100g cooked)', calories: 112 },
    { id: '9', name: 'Barley (100g cooked)', calories: 123 }
  ];

  const curries = [
    { id: '10', name: 'Grilled Chicken Breast (150g)', calories: 248 },
    { id: '11', name: 'Fish Curry (150g)', calories: 200 },
    { id: '12', name: 'Lentil Curry (100g)', calories: 116 },
    { id: '13', name: 'Tofu Curry (100g)', calories: 76 },
    { id: '14', name: 'Egg Curry (1 boiled egg, 50g)', calories: 78 },
    { id: '15', name: 'Chickpea Curry (100g)', calories: 164 },
    { id: '16', name: 'Beef Curry (150g)', calories: 260 },
    { id: '17', name: 'Paneer Curry (100g)', calories: 265 },
    { id: '18', name: 'Mutton Curry (150g)', calories: 294 },
    { id: '19', name: 'Turkey Breast (150g grilled)', calories: 189 },
    { id: '20', name: 'Pork Chop (150g grilled)', calories: 320 }
  ];

  const vegetableSides = [
    { id: '21', name: 'Steamed Broccoli (100g)', calories: 35 },
    { id: '22', name: 'Carrot Sticks (100g)', calories: 41 },
    { id: '23', name: 'Steamed Spinach (100g)', calories: 23 },
    { id: '24', name: 'Grilled Zucchini (100g)', calories: 17 },
    { id: '25', name: 'Baked Eggplant (100g)', calories: 25 },
    { id: '26', name: 'Roasted Cauliflower (100g)', calories: 70 },
    { id: '27', name: 'Green Beans (100g)', calories: 31 },
    { id: '28', name: 'Steamed Asparagus (100g)', calories: 22 },
    { id: '29', name: 'Baked Bell Peppers (100g)', calories: 40 }
  ];

  const salads = [
    { id: '30', name: 'Mixed Salad (Lettuce, Tomato, Cucumber) (150g)', calories: 30 },
    { id: '31', name: 'Avocado (1/2 medium, 75g)', calories: 120 },
    { id: '32', name: 'Greek Salad (100g)', calories: 101 },
    { id: '33', name: 'Cabbage Salad (100g)', calories: 25 },
    { id: '34', name: 'Kale Salad (100g)', calories: 49 },
    { id: '35', name: 'Caesar Salad (100g)', calories: 190 },
    { id: '36', name: 'Caprese Salad (100g)', calories: 125 },
    { id: '37', name: 'Chickpea Salad (100g)', calories: 164 }
  ];

  const desserts = [
    { id: '38', name: 'Dark Chocolate (30g)', calories: 170 },
    { id: '39', name: 'Mixed Berries (100g)', calories: 57 },
    { id: '40', name: 'Apple Pie (1 slice, 100g)', calories: 237 },
    { id: '41', name: 'Vanilla Ice Cream (100g)', calories: 207 },
    { id: '42', name: 'Cheesecake (100g)', calories: 321 },
    { id: '43', name: 'Chocolate Chip Cookies (1 cookie, 20g)', calories: 98 },
    { id: '44', name: 'Mango Sorbet (100g)', calories: 130 },
    { id: '45', name: 'Fruit Salad (100g)', calories: 50 },
    { id: '46', name: 'Carrot Cake (100g)', calories: 420 },
    { id: '47', name: 'Custard (100g)', calories: 122 }
  ];

  const handleMealSelection = (item) => {
    const isSelected = selectedMeals.includes(item.id);
    if (isSelected) {
      setSelectedMeals((prev) => prev.filter((id) => id !== item.id));
      setTotalCalories((prev) => prev - item.calories);
    } else {
      setSelectedMeals((prev) => [...prev, item.id]);
      setTotalCalories((prev) => prev + item.calories);
    }
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSaveMealPlan = async () => {
    if (!planName || !description || selectedMeals.length === 0) {
      Alert.alert('Error', 'Please fill in all fields and select at least one meal.');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = '';

      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();

        const imageRef = ref(storage, `mealPlans/${Date.now()}.jpg`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'dietPlans'), {
        planName,
        description,
        selectedMeals,
        totalCalories,
        imageUrl
      });

      Alert.alert('Success', 'Meal plan saved successfully!');
      router.push('SelectAPlan');
    } catch (error) {
      console.error('Error saving meal plan: ', error);
      Alert.alert('Error', `Could not save meal plan: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const renderMealItem = ({ item }) => {
    const isSelected = selectedMeals.includes(item.id);
    return (
      <TouchableOpacity
      style={[styles.mealItem, isSelected && styles.mealItemSelected]}
        onPress={() => handleMealSelection(item)}
      >
        <Text style={styles.mealText}>
          {item.name} ({item.calories} cal)
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleImagePicker}>
          <Image
            source={selectedImage ? { uri: selectedImage } : require('../assets/images/pexels-chanwalrus-958545.jpg')}
            style={styles.image}
          />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Plan name</Text>
          <TextInput
            style={styles.input}
            value={planName}
            onChangeText={setPlanName}
          />
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
             style={styles.descriptionText}
             value={description}
             onChangeText={setDescription}
            multiline={true}
          />
        </View>

        <Text style={styles.label}>Main Food</Text>
        <FlatList
            data={mainFood}
            renderItem={renderMealItem}
            keyExtractor={(item) => item.id}
            style={styles.mealList}
            scrollEnabled={false} 
        />

        <Text style={styles.label}>Curries/Proteins</Text>
        <FlatList
            data={curries}
            renderItem={renderMealItem}
            keyExtractor={(item) => item.id}
            style={styles.mealList}
            scrollEnabled={false} 
        />
<View style={styles.mealSelectionContainer}>
        <Text style={styles.label}>Vegetable Sides</Text>
        <FlatList
            data={vegetableSides}
            renderItem={renderMealItem}
            keyExtractor={(item) => item.id}
            style={styles.mealList}
            scrollEnabled={false} 
        />
        </View>
        <View style={styles.mealSelectionContainer}>
        <Text style={styles.label}>Salads</Text>
        <FlatList
            data={salads}
            renderItem={renderMealItem}
            keyExtractor={(item) => item.id}
            style={styles.mealList}
            scrollEnabled={false} 
        />
        </View>
        <View style={styles.mealSelectionContainer}>
        <Text style={styles.label}>Desserts</Text>
        <FlatList
            data={desserts}
            renderItem={renderMealItem}
            keyExtractor={(item) => item.id}
            style={styles.mealList}
            scrollEnabled={false} 
        />
        </View>
        <View style={styles.caloriesContainer}>
        <Text>Total Calories: {totalCalories}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSaveMealPlan} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save meal plan'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    marginTop:20,
  },
  inputContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f1f1f1',
  },
  descriptionContainer: {
    marginVertical: 10,
  },
  descriptionText: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f1f1f1',
  },
  caloriesContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  mealSelectionContainer: {
    marginVertical: 10,
  },
  mealItem: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginVertical: 5,
  },
  mealItemSelected: {
    backgroundColor: '#d1e7dd',
  },
  mealText: {
    fontSize: 16,
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddToPlanScreen;
