import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AvatarCreator = () => {
  const [skinColor, setSkinColor] = useState('#FFDAB9'); // Default skin color
  const [hairColor, setHairColor] = useState('#4B3D29'); // Default hair color
  const [clothingColor, setClothingColor] = useState('#4B88A2'); // Default clothing color
  const [eyes, setEyes] = useState('😊'); // Default eyes emoji
  const [mouth, setMouth] = useState('😃'); // Default mouth emoji

  return (
    <View style={styles.container}>
      <View style={[styles.avatarContainer, { backgroundColor: skinColor }]}>
        <Text style={styles.hair}>👩‍🦰</Text> {/* Static hair emoji */}
        <Text style={styles.eyes}>{eyes}</Text> {/* Eyes emoji wrapped in <Text> */}
        <Text style={styles.mouth}>{mouth}</Text> {/* Mouth emoji wrapped in <Text> */}
        <Text style={[styles.clothes, { color: clothingColor }]}>👕</Text> {/* Clothing emoji */}
      </View>

      <View style={styles.options}>
        <Text>Select Skin Color:</Text>
        <TouchableOpacity onPress={() => setSkinColor('#FFDAB9')}>
          <Text style={styles.optionText}>Skin Color 1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSkinColor('#F4CBA7')}>
          <Text style={styles.optionText}>Skin Color 2</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.options}>
        <Text>Select Hair Color:</Text>
        <TouchableOpacity onPress={() => setHairColor('#4B3D29')}>
          <Text style={styles.optionText}>Hair Color 1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setHairColor('#7A5B3D')}>
          <Text style={styles.optionText}>Hair Color 2</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.options}>
        <Text>Select Eyes:</Text>
        <TouchableOpacity onPress={() => setEyes('😊')}>
          <Text style={styles.optionText}>Happy Eyes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEyes('😎')}>
          <Text style={styles.optionText}>Cool Eyes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEyes('😐')}>
          <Text style={styles.optionText}>Neutral Eyes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.options}>
        <Text>Select Mouth:</Text>
        <TouchableOpacity onPress={() => setMouth('😃')}>
          <Text style={styles.optionText}>Smile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMouth('😶')}>
          <Text style={styles.optionText}>Neutral</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMouth('😢')}>
          <Text style={styles.optionText}>Sad</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.options}>
        <Text>Select Clothing Color:</Text>
        <TouchableOpacity onPress={() => setClothingColor('#4B88A2')}>
          <Text style={styles.optionText}>Clothes Color 1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setClothingColor('#E84545')}>
          <Text style={styles.optionText}>Clothes Color 2</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  avatarContainer: {
    width: 150,
    height: 250,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 20,
  },
  hair: {
    fontSize: 50,
    position: 'absolute',
    top: 20,
  },
  eyes: {
    fontSize: 50,
    position: 'absolute',
    top: 80,
  },
  mouth: {
    fontSize: 50,
    position: 'absolute',
    top: 150,
  },
  clothes: {
    fontSize: 60,
    position: 'absolute',
    bottom: 0,
  },
  options: {
    marginVertical: 10,
    alignItems: 'center',
  },
  optionText: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default AvatarCreator;
