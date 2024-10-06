import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Dimensions, Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

const meditationSessions = [
  { id: '1', title: 'Mindful Breathing', image: require('../assets/images/back.png') },
  { id: '2', title: 'Gratitude Meditation', image: require('../assets/images/back.png') },
  { id: '3', title: 'Calmness', image: require('../assets/images/back.png') },
  // Add more sessions as needed
];

export default function ImageSliderMeditation() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    setActiveIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
      >
        {meditationSessions.map((session) => (
          <View key={session.id} style={styles.imageContainer}>
            <Image source={session.image} style={styles.image} />
          </View>
        ))}
      </ScrollView>

      {/* Dots for the slider indicator */}
      <View style={styles.dotContainer}>
        {meditationSessions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: hp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    height: hp(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: wp(80),
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#6E44FF',
  },
  inactiveDot: {
    backgroundColor: '#C4C4C4',
  },
});
