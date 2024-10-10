import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const BloodPressureHeartRate = () => {
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [dataPoints, setDataPoints] = useState({
    bloodPressure: [],
    heartRate: [],
  });

  const handleAddData = () => {
    if (bloodPressure && heartRate) {
      setDataPoints({
        bloodPressure: [...dataPoints.bloodPressure, parseFloat(bloodPressure)],
        heartRate: [...dataPoints.heartRate, parseFloat(heartRate)],
      });
      setBloodPressure('');
      setHeartRate('');
    }
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Track Blood Pressure & Heart Rate</Text>

      {/* Input Form */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Blood Pressure (e.g. 120)"
          value={bloodPressure}
          onChangeText={setBloodPressure}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Heart Rate (e.g. 80 bpm)"
          value={heartRate}
          onChangeText={setHeartRate}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddData}>
          <Text style={styles.addButtonText}>Add Data</Text>
        </TouchableOpacity>
      </View>

      {/* Blood Pressure Chart */}
      <Text style={styles.chartTitle}>Blood Pressure Over Time</Text>
      <LineChart
        data={{
          labels: dataPoints.bloodPressure.map((_, index) => `#${index + 1}`),
          datasets: [
            {
              data: dataPoints.bloodPressure,
            },
          ],
        }}
        width={screenWidth - 32} // from react-native
        height={220}
        yAxisLabel=""
        yAxisSuffix=" mmHg"
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={styles.chart}
      />

      {/* Heart Rate Chart */}
      <Text style={styles.chartTitle}>Heart Rate Over Time</Text>
      <LineChart
        data={{
          labels: dataPoints.heartRate.map((_, index) => `#${index + 1}`),
          datasets: [
            {
              data: dataPoints.heartRate,
            },
          ],
        }}
        width={screenWidth - 32} // from react-native
        height={220}
        yAxisLabel=""
        yAxisSuffix=" bpm"
        chartConfig={{
          backgroundColor: '#022173',
          backgroundGradientFrom: '#1c92d2',
          backgroundGradientTo: '#f2fcfe',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={styles.chart}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0E6FE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6E44FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#6E44FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2C3E50',
  },
});

export default BloodPressureHeartRate;
