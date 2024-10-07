import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Slider from '@react-native-community/slider'; // Import Slider

const BMICalculator = () => {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(72);
  const [bmi, setBMI] = useState(null);

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBMI(bmiValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>

      <View style={styles.sliderContainer}>
        <Text>Height: {height} cm</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={100}
          maximumValue={220}
          step={1}
          value={height}
          onValueChange={(value) => setHeight(value)}
          minimumTrackTintColor="#1EB1FC"
          maximumTrackTintColor="#8EB0C6"
        />
      </View>

      <View style={styles.sliderContainer}>
        <Text>Weight: {weight} kg</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={30}
          maximumValue={150}
          step={1}
          value={weight}
          onValueChange={(value) => setWeight(value)}
          minimumTrackTintColor="#1EB1FC"
          maximumTrackTintColor="#8EB0C6"
        />
      </View>

      <Button title="Calculate BMI" onPress={calculateBMI} />

      {bmi && (
        <View style={styles.result}>
          <Text>Your BMI is: {bmi}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sliderContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  result: {
    marginTop: 20,
  },
});

export default BMICalculator;
