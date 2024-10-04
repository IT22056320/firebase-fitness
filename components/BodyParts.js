import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { bodyParts } from '../constants'; // Assuming you have images and names for each body part
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BodyParts() {
  const router = useRouter();

  // Complete exercise data with YouTube video IDs for each body part
  const exercisesData = {
    back: [
      {
        name: 'Pull-up',
        instructions: 'Hang from a bar with your palms facing away and pull your body up until your chin passes the bar.',
        videoUrl: 'eGo4IYlbE5g', // Only the YouTube video ID
      },
      {
        name: 'Deadlift',
        instructions: 'Stand with feet hip-width apart and lift a barbell from the ground to your hips while keeping your back straight.',
        videoUrl: 'VIYY5QGqwVg',
      },
      {
        name: 'Row',
        instructions: 'Bend forward at the waist, grab a barbell or dumbbells, and pull them towards your waist while keeping your back straight.',
        videoUrl: 'FWJR5Ve8bnQ',
      },
    ],
    cardio: [
      {
        name: 'Running',
        instructions: 'Run at a steady pace, keeping your body upright and using your arms for momentum.',
        videoUrl: 't_aO02fC0rSiI--6',
      },
      {
        name: 'Cycling',
        instructions: 'Ride a bike while maintaining a consistent pedal stroke and posture.',
        videoUrl: 'yulWBPlTx1dxNoNS',
      },
      {
        name: 'Jump Rope',
        instructions: 'Hold the handles of the rope, swing it over your head, and jump over it as it passes under your feet.',
        videoUrl: 'twQWswNb8NZsn5hr',
      },
    ],
    'lower arms': [
      {
        name: 'Wrist Curl',
        instructions: 'Hold a dumbbell in each hand and curl your wrists upwards, focusing on your forearms.',
        videoUrl: 'wGrwAzCXrX3z29cF',
      },
      {
        name: 'Reverse Curl',
        instructions: 'Hold a barbell with an overhand grip and curl it towards your shoulders while keeping your elbows close to your body.',
        videoUrl: 'RUzq_PnlAhmSuFAP',
      },
    ],
    'lower legs': [
      {
        name: 'Calf Raise',
        instructions: 'Stand with your feet shoulder-width apart and raise your heels off the ground, then lower them back down slowly.',
        videoUrl: 'O9SMhErLSN2KmVgh',
      },
      {
        name: 'Seated Calf Raise',
        instructions: 'Sit on a bench with a barbell or weights resting on your thighs and raise your heels off the ground.',
        videoUrl: 'A0ZlhrIs06ESUNrA',
      },
    ],
    chest: [
      {
        name: 'Bench Press',
        instructions: 'Lie flat on a bench, lower the barbell to your chest, and press it back up until your arms are straight.',
        videoUrl: 'rMmGaiRb_NE0yhVE',
      },
      {
        name: 'Push-up',
        instructions: 'Get into a plank position and lower your body until your chest touches the ground, then push back up.',
        videoUrl: 'G7Sr9XA1fK5nhXMn',
      },
      {
        name: 'Chest Fly',
        instructions: 'Lie on a bench with dumbbells, open your arms out to the sides, and bring them together above your chest.',
        videoUrl: 'lRWkcuGov2S_ltHI',
      },
    ],
    neck: [
      {
        name: 'Neck Extension',
        instructions: 'Gently push your head back while keeping your neck straight, then return to a neutral position.',
        videoUrl: 'iH2XiWAzMmEp1Vf5',
      },
      {
        name: 'Neck Flexion',
        instructions: 'Slowly lower your chin towards your chest and then lift your head back to the starting position.',
        videoUrl: '8OgnW_3iJWrXjEzZ',
      },
    ],
    shoulders: [
      {
        name: 'Shoulder Press',
        instructions: 'Hold a dumbbell in each hand, press them overhead until your arms are fully extended, then lower them back down.',
        videoUrl: 'ru0OlbR6rez0nCpe',
      },
      {
        name: 'Lateral Raise',
        instructions: 'Hold a dumbbell in each hand, raise your arms to the sides until they are parallel with the ground, then lower them back down.',
        videoUrl: '0VJqWZ6AaFg4H-sD',
      },
    ],
    'upper arms': [
      {
        name: 'Bicep Curl',
        instructions: 'Hold a dumbbell in each hand with your palms facing up and curl the weights towards your shoulders.',
        videoUrl: 'fKqbkKuFmRjzdKbd',
      },
      {
        name: 'Tricep Extension',
        instructions: 'Hold a dumbbell with both hands behind your head, extend your arms upwards, and lower the weight back down slowly.',
        videoUrl: '1SPc4AdAZQXzUx2d',
      },
    ],
    'upper legs': [
      {
        name: 'Squat',
        instructions: 'Stand with feet shoulder-width apart, lower your hips down and back, then stand back up.',
        videoUrl: '0hJS2aYHK3BEuuan',
      },
      {
        name: 'Lunges',
        instructions: 'Step forward with one leg, lower your hips until both knees are at 90-degree angles, and push back up.',
        videoUrl: 'm-edgIZdT7zO6fGT',
      },
      {
        name: 'Leg Press',
        instructions: 'Sit on a leg press machine, push the platform away with your feet, and then bring it back down.',
        videoUrl: 'js82kVblHdYt_H03',
      },
    ],
    waist: [
      {
        name: 'Crunches',
        instructions: 'Lie on your back with your knees bent, lift your shoulders off the ground, and lower them back down slowly.',
        videoUrl: '5fQxDBVl99MeRqz5',
      },
      {
        name: 'Plank',
        instructions: 'Hold your body in a straight line from head to toe, supported by your forearms and toes.',
        videoUrl: '_vN5iDjL4qZK0Wi0',
      },
    ],
  };

  const storeExercises = async (bodyPart) => {
    try {
      // Save exercises for the selected body part in AsyncStorage
      await AsyncStorage.setItem('@exercises', JSON.stringify(exercisesData[bodyPart]));

      // Navigate to the Exercises screen
      router.push({ pathname: '/exercises', params: { bodyPart } });
    } catch (err) {
      console.log('Error saving exercises:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Exercises</Text>

      <FlatList
        data={bodyParts}
        numColumns={2}
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <BodyPartCard onPress={() => storeExercises(item.name)} item={item} />
        )}
      />
    </View>
  );
}

const BodyPartCard = ({ item, onPress }) => {
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={onPress} style={styles.touchableOpacity}>
        <Image source={item.image} resizeMode="cover" style={styles.imageStyle} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <Text style={styles.cardText}>{item?.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4),
  },
  headerText: {
    fontSize: hp(3),
    fontWeight: '600',
    color: '#4B5563',
  },
  flatListContent: {
    paddingBottom: 50,
    paddingTop: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    marginBottom: 20,
  },
  touchableOpacity: {
    width: wp(44),
    height: hp(52),
    justifyContent: 'flex-end',
    padding: 10,
  },
  imageStyle: {
    width: wp(44),
    height: hp(52),
    borderRadius: 35,
    position: 'absolute',
  },
  gradient: {
    width: wp(44),
    height: hp(15),
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  cardText: {
    fontSize: hp(2.3),
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
    width: wp(44),
  },
});
