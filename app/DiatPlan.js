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
  const [loading, setLoading] = useState(false); // Loading state

  const db = getFirestore(); 
  const storage = getStorage(); 

  const meals = [
    { id: '1', name: 'Extra Dressing', calories: 120 },
    { id: '2', name: 'Less Yogurt', calories: -90 },
    { id: '3', name: 'Add Avocado', calories: 160 },
    { id: '4', name: 'Add Grilled Chicken', calories: 200 },
    { id: '5', name: 'Add Tofu', calories: 100 },
  ];

  const handleMealSelection = (meal) => {
    const isSelected = selectedMeals.includes(meal.id);
    if (isSelected) {
      setSelectedMeals((prev) => prev.filter((id) => id !== meal.id));
      setTotalCalories((prev) => prev - meal.calories);
    } else {
      setSelectedMeals((prev) => [...prev, meal.id]);
      setTotalCalories((prev) => prev + meal.calories);
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

    setLoading(true); // Set loading to true when starting to save
    try {
        let imageUrl = '';

        if (selectedImage) {
            const response = await fetch(selectedImage);
            const blob = await response.blob();
            console.log("Blob created: ", blob);

            // Unique image reference based on time
            const imageRef = ref(storage, `mealPlans/${Date.now()}.jpg`); 

            await uploadBytes(imageRef, blob).catch(error => {
                console.error('Upload Error: ', error);
                Alert.alert('Upload Error', error.message || error);
            });

            imageUrl = await getDownloadURL(imageRef);
            console.log("Image URL: ", imageUrl); // Log the image URL
        }

        await addDoc(collection(db, 'dietPlans'), {
            planName,
            description,
            selectedMeals,
            totalCalories,
            imageUrl, 
        });

        Alert.alert('Success', 'Meal plan saved successfully!');
        router.push('SelectAPlan'); 
    } catch (error) {
        console.error('Error saving meal plan: ', error); 
        Alert.alert('Error', `Could not save meal plan: ${error.message || error}`);
    } finally {
        setLoading(false); // Set loading to false when finished
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
        {/* Image selection */}
        <TouchableOpacity onPress={handleImagePicker}>
          <Image
            source={selectedImage ? { uri: selectedImage } : require('../assets/images/pexels-chanwalrus-958545.jpg')}
            style={styles.image}
          />
        </TouchableOpacity>

        {/* Plan name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Plan name</Text>
          <TextInput
            style={styles.input}
            value={planName}
            onChangeText={setPlanName}
          />
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.descriptionText}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Calories Section */}
        <View style={styles.caloriesContainer}>
          <Text>Total Calories</Text>
          <Text>{totalCalories} calories</Text>
        </View>

        {/* Meal Selection */}
        <View style={styles.mealSelectionContainer}>
          <Text style={styles.label}>Select Meals</Text>
          <FlatList
            data={meals}
            renderItem={renderMealItem}
            keyExtractor={(item) => item.id}
            style={styles.mealList}
            scrollEnabled={false} 
          />
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSaveMealPlan} disabled={loading}>
            <Text style={styles.buttonText}scrollEnabled={false}>{loading ? 'Saving...' : 'Save meal plan'}</Text>
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
    fontSize: 16,
    backgroundColor: '#f1e7ff',
    padding: 10,
    borderRadius: 10,
  },
  caloriesContainer: {
    marginVertical: 20,
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
  },
  mealSelectionContainer: {
    marginVertical: 20,
  },
  mealList: {
    marginTop: 10,
  },
  mealItem: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  mealItemSelected: {
    backgroundColor: '#d1c4e9',
  },
  mealText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: '',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#a566ff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddToPlanScreen;
