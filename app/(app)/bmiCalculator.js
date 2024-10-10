import React, { useState, useEffect } from 'react'; 
import { useRouter } from 'expo-router';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomNav from '../../components/BottomNav';

const BMICalculator = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState(null); // State for gender selection
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || ''); // State for date of birth
  const [age, setAge] = useState(''); // State for age

  useEffect(() => {
    loadBmiValue();
    loadGender();
  }, [user]);

  useEffect(() => {
    calculateAge(dateOfBirth);
  }, [dateOfBirth]);

  const loadGender = async () => {
    try {
      const storedGender = await AsyncStorage.getItem('gender');
      if (storedGender !== null) {
        setGender(storedGender);
      }
    } catch (error) {
      console.error('Failed to load Gender:', error);
    }
  };

  const loadBmiValue = async () => {
    try {
      const storedBmi = await AsyncStorage.getItem('bmi');
      if (storedBmi !== null) {
        setBmi(storedBmi);
        categorizeBMI(parseFloat(storedBmi));
      }
    } catch (error) {
      console.error('Failed to load BMI value:', error);
    }
  };

  const saveBmiValue = async (bmiValue) => {
    try {
      await AsyncStorage.setItem('bmi', bmiValue.toString());
    } catch (error) {
      console.error('Failed to save BMI value:', error);
    }
  };

  const saveGender = async (selectedGender) => {
    try {
      await AsyncStorage.setItem('gender', selectedGender);
    } catch (error) {
      console.error('Failed to save Gender:', error);
    }
  };

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi.toFixed(1));
      categorizeBMI(calculatedBmi);
      saveBmiValue(calculatedBmi.toFixed(1));

      
    }
  };

  const customizeMeal = () => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi.toFixed(1));
      categorizeBMI(calculatedBmi);
      saveBmiValue(calculatedBmi.toFixed(1));

      router.push({
        pathname: '/CustomizedMealPlan',
        params: { bmiCategory: category },
      });
    }
  };

 

  const categorizeBMI = (bmiValue) => {
    if (bmiValue < 18.5) {
      setCategory('Underweight');
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      setCategory('Healthy');
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return; // Early return if no date of birth is provided

    // Check if dob is an object with seconds
    if (typeof dob === 'object' && dob !== null && 'seconds' in dob) {
        dob = new Date(dob.seconds * 1000); // Convert Firestore timestamp to Date
    } else {
        dob = new Date(dob); // Use it as a standard date if it's a string
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age -= 1; // Subtract 1 year if the birth date hasn't occurred yet this year
    }

    setAge(age);
};

  const handleBack = () => {
    router.back();
  };

  const handleGenderSelection = (selectedGender) => {
    setGender(selectedGender);
    saveGender(selectedGender); // Save selected gender
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back-ios" size={24} color='#6E44FF'/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BMI Calculator</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.genderContainer}>
          <Text style={styles.label}>Gender:</Text>
          <TouchableOpacity onPress={() => handleGenderSelection('male')}>
            <Image 
              source={require('../../assets/images/male_avatar.png')} 
              style={[styles.avatar, gender === 'male' && styles.selectedAvatar]} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleGenderSelection('female')}>
            <Image 
              source={require('../../assets/images/female_avatar.png')} 
              style={[styles.avatar, gender === 'female' && styles.selectedAvatar]} 
            />
          </TouchableOpacity>
        </View>

        {age !== null && (
          <Text style={styles.age}>Age: {age} years</Text>
        )}

        <View style={styles.bmiResultContainer}>
          <Text style={styles.bmiText}>{bmi ? bmi : '--'}</Text>
          <Text style={styles.bmiCategory}>{category ? `You're ${category}` : ''}</Text>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Height</Text>
          <TextInput
            style={styles.input}
            value={height}
            keyboardType="numeric"
            placeholder="170 cm"
            placeholderTextColor="#888"
            onChangeText={(value) => setHeight(value)}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Weight</Text>
          <TextInput
            style={styles.input}
            value={weight}
            keyboardType="numeric"
            placeholder="72 kg"
            placeholderTextColor="#888"
            onChangeText={(value) => setWeight(value)}
          />
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={calculateBMI}>
          <Text style={styles.buttonText}>Calculate BMI</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.calculateButton} onPress={customizeMeal}>
          <Text style={styles.buttonText}>Reccommend Meal Plan</Text>
        </TouchableOpacity>
      </View>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20 ,
    paddingTop:70,
    justifyContent: 'center',
    backgroundColor: '#F0E6FE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6E44FF',
    marginLeft: 16,
  },
  bmiResultContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#ece5f9',
    padding: 20,
    borderRadius: 10,
  },
  bmiText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#4A148C',
  },
  bmiCategory: {
    fontSize: 20,
    marginTop: 10,
    color: '#4CAF50',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  age: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#333'
  },
  calculateButton: {
    backgroundColor: '#6E44FF',
    borderRadius: hp(1),
    padding: hp(2),
    alignItems: 'center',
    marginTop: hp(2),
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 80,
    height: 100,
    marginHorizontal: 20,
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: '#4A148C',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: hp(2),
    padding: wp(5),
    marginBottom: hp(12), 
  },
});

export default BMICalculator;