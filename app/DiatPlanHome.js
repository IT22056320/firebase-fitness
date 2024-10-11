import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../components/BottomNav';

const NutritionScreen = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Top section with Image */}
                <Image source={require('../assets/images/pexels-chanwalrus-958545.jpg')} style={styles.topImage} />
                
                {/* Personalized Nutrition Plan */}
                <View style={styles.planContainer}>
                    <Text style={styles.title}>Personalized Nutrition Plan</Text>
                    <Text style={styles.subtitle}>Based on your goals and lifestyle</Text>
                    <Text style={styles.description}>
                        Start your journey with a personalized plan.
                    </Text>
                </View>

                {/* Track your progress section */}
                <View style={styles.progressContainer}>
                    <Text style={styles.trackTitle}>Track your progress</Text>
                    <View style={styles.caloriesCard}>
                        <Text style={styles.caloriesTitle}>Calories</Text>
                        <Text style={styles.caloriesAmount}>2000</Text>
                        <Text style={styles.caloriesToday}>Today -10%</Text>
                    </View>
                </View>

                {/* Navigation Links */}
                <View style={styles.navContainer}>
                    <TouchableOpacity onPress={() => router.push('SelectAPlan')} style={styles.navButton}>
                        <Text style={styles.navLink}>My Diet Plan</Text>
                        <Text style={styles.navSubText}>Week of Jan 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('bmiCalculator')} style={styles.navButton}>
                        <Text style={styles.navLink}>Calculate BMI</Text>
                        <Text style={styles.navSubText}>Get a plan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('DiatPlan')} style={styles.navButton}>
                        <Text style={styles.navLink}>Customize </Text>
                        <Text style={styles.navSubText}>Customize your plan</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <BottomNav />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0E6FE',
        
    },
    topImage: {
        width: '100%',
        height: 200,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        resizeMode: 'cover',
    },
    planContainer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginTop: -30,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6A1B9A',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        lineHeight: 22,
        marginTop: 10,
    },
    progressContainer: {
        marginTop: 30,
        paddingHorizontal: 20,
        
    },
    trackTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    caloriesCard: {
        backgroundColor: '#F7F7F7',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        alignItems: 'center',
    },
    caloriesTitle: {
        fontSize: 18,
        color: '#6A1B9A',
        marginBottom: 5,
    },
    caloriesAmount: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#6A1B9A',
        marginBottom: 5,
    },
    caloriesToday: {
        fontSize: 16,
        color: '#E57373',
    },
    navContainer: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    navButton: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginVertical: 10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navLink: {
        fontSize: 18,
        color: '#6A1B9A',
    },
    navSubText: {
        fontSize: 14,
        color: '#777',
    },
});

export default NutritionScreen;
