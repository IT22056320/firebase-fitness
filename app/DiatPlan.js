import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Firebase Firestore
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage
import * as ImagePicker from 'expo-image-picker'; // Image Picker
import DropDownPicker from 'react-native-dropdown-picker'; // DropDown picker
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  // Dropdown open states for Main Food and Dessert
  const [mainFoodOpen, setMainFoodOpen] = useState(false);
  const [dessertOpen, setDessertOpen] = useState(false);

  // Dropdown selected values for Main Food and Dessert
  const [mainFoodSelected, setMainFoodSelected] = useState([]);
  const [dessertSelected, setDessertSelected] = useState([]);

  // Food categories and their calories
  const mainFood = [
    { label: 'Rice (100g cooked)', value: { id: '1', name: 'Rice', calories: 130 } },
    { label: 'Quinoa (100g cooked)', value: { id: '2', name: 'Quinoa', calories: 120 } },
    { label: 'Whole Wheat Bread (1 slice)', value: { id: '3', name: 'Whole Wheat Bread', calories: 100 } },
    // Add the rest of the items...
  ];

  const curries = [
    { id: '10', name: 'Grilled Chicken Breast (150g)', calories: 248 },
    { id: '11', name: 'Fish Curry (150g)', calories: 200 },
    // Add the rest of the items...
  ];

  const vegetableSides = [
    { id: '21', name: 'Steamed Broccoli (100g)', calories: 35 },
    { id: '22', name: 'Carrot Sticks (100g)', calories: 41 },
    // Add the rest of the items...
  ];

  const salads = [
    { id: '30', name: 'Mixed Salad (150g)', calories: 30 },
    { id: '31', name: 'Avocado (75g)', calories: 120 },
    // Add the rest of the items...
  ];

  const desserts = [
    { label: 'Dark Chocolate (30g)', value: { id: '38', name: 'Dark Chocolate', calories: 170 } },
    { label: 'Mixed Berries (100g)', value: { id: '39', name: 'Mixed Berries', calories: 57 } },
    // Add the rest of the items...
  ];

  // Calculate total calories dynamically
  useEffect(() => {
    const selectedMealCalories = [...mainFoodSelected, ...dessertSelected, ...selectedMeals].reduce(
      (total, meal) => total + (meal.calories || 0),
      0
    );
    setTotalCalories(selectedMealCalories);
  }, [mainFoodSelected, dessertSelected, selectedMeals]);

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

  // Render meal items for FlatLists (curries, vegetable sides, salads)
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

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
  <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back-ios" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customize Plan</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleImagePicker} style={styles.imagePickerContainer}>
          <Image
            source={selectedImage ? { uri: selectedImage } : require('../assets/images/pexels-chanwalrus-958545.jpg')}
            style={styles.image}
          />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Plan Name</Text>
          <TextInput
            style={styles.input}
            value={planName}
            onChangeText={setPlanName}
            placeholder="Enter your plan name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            multiline={true}
            placeholder="Describe your meal plan"
          />
        </View>

        {/* Main Food Dropdown */}
        <Text style={styles.label}>Main Food</Text>
        <DropDownPicker
          open={mainFoodOpen}
          value={mainFoodSelected}
          items={mainFood}
          setOpen={setMainFoodOpen}
          setValue={setMainFoodSelected}
          multiple={true}
          min={0}
          max={10}
          containerStyle={styles.dropdownContainer}
          placeholder="Select your main food"
          style={styles.dropdown}
        />

        {/* Curries FlatList */}
        <Text style={styles.label}>Curries/Proteins</Text>
        <FlatList
          data={curries}
          renderItem={renderMealItem}
          keyExtractor={(item) => item.id}
          style={styles.mealList}
          scrollEnabled={false}
        />

        {/* Vegetable Sides FlatList */}
        <Text style={styles.label}>Vegetable Sides</Text>
        <FlatList
          data={vegetableSides}
          renderItem={renderMealItem}
          keyExtractor={(item) => item.id}
          style={styles.mealList}
          scrollEnabled={false}
        />

        {/* Salads FlatList */}
        <Text style={styles.label}>Salads</Text>
        <FlatList
          data={salads}
          renderItem={renderMealItem}
          keyExtractor={(item) => item.id}
          style={styles.mealList}
          scrollEnabled={false}
        />

        {/* Dessert Dropdown */}
        <Text style={styles.label}>Desserts</Text>
        <DropDownPicker
          open={dessertOpen}
          value={dessertSelected}
          items={desserts}
          setOpen={setDessertOpen}
          setValue={setDessertSelected}
          multiple={true}
          min={0}
          max={10}
          containerStyle={styles.dropdownContainer}
          placeholder="Select your dessert"
          style={styles.dropdown}
        />

        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesText}>Total Calories: {totalCalories}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSaveMealPlan} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Meal Plan'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 50,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#6E44FF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
  },
  imagePickerContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 20,
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6E44FF',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  caloriesContainer: {
    marginVertical: 20,
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    padding: 15,
    borderRadius: 10,
  },
  caloriesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  dropdownContainer: {
    marginVertical: 10,
    zIndex: 1000,
  },
  dropdown: {
    borderColor: '#6C63FF',
  },
  mealList: {
    marginVertical: 10,
  },
  mealItem: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
  },
  mealItemSelected: {
    backgroundColor: '#d1e7dd',
  },
  mealText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6E44FF',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddToPlanScreen;
