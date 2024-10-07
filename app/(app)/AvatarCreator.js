import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Avatars from '@dicebear/avatars';
import * as AvataaarsSprites from '@dicebear/avatars-avataaars-sprites';
import { SvgXml } from 'react-native-svg';

export default function AvatarCreator() {
    const [skinColor, setSkinColor] = useState('light');
    const [hairStyle, setHairStyle] = useState('short');
    const [clothes, setClothes] = useState('casual');
    const [eyeType, setEyeType] = useState('default');
    const [facialHair, setFacialHair] = useState('none');
    const [accessories, setAccessories] = useState('none');
    const [avatarSvg, setAvatarSvg] = useState(null); // Avatar SVG code

    const generateAvatar = async () => {
        const avatarOptions = {
            'skin': skinColor === 'light' ? 'pale' : 'brown',
            'top': hairStyle === 'short' ? 'shortHair' : 'longHair',
            'clothes': clothes === 'casual' ? 'shirtCrewNeck' : 'blazerShirt',
            'eyes': eyeType,
            'facialHair': facialHair === 'none' ? 'blank' : facialHair,
            'accessories': accessories === 'none' ? 'none' : accessories,
        };

        // Generate an SVG avatar using DiceBear's Avataaars library
        let avatars = new Avatars.default(AvataaarsSprites.default, {
            radius: 50,
            ...avatarOptions,
        });
        
        let avatarSvgString = avatars.create('random-seed'); // You can pass in a seed value for consistent avatars

        setAvatarSvg(avatarSvgString);

        // Save avatar selections
        await AsyncStorage.setItem('userAvatar', JSON.stringify(avatarOptions));
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>Create Your Avatar</Text>

                <View style={styles.avatarPreview}>
                    {avatarSvg ? (
                        <SvgXml
                            width="100%"
                            height="100%"
                            xml={avatarSvg}
                        />
                    ) : (
                        <Text style={styles.avatarText}>Avatar Preview</Text>
                    )}
                </View>

                {/* Skin Color Picker */}
                <Text style={styles.label}>Select Skin Color</Text>
                <Picker selectedValue={skinColor} onValueChange={(itemValue) => setSkinColor(itemValue)} style={styles.picker}>
                    <Picker.Item label="Light" value="light" />
                    <Picker.Item label="Dark" value="dark" />
                </Picker>

                {/* Hair Style Picker */}
                <Text style={styles.label}>Select Hair Style</Text>
                <Picker selectedValue={hairStyle} onValueChange={(itemValue) => setHairStyle(itemValue)} style={styles.picker}>
                    <Picker.Item label="Short" value="short" />
                    <Picker.Item label="Long" value="long" />
                </Picker>

                {/* Clothes Picker */}
                <Text style={styles.label}>Select Clothes</Text>
                <Picker selectedValue={clothes} onValueChange={(itemValue) => setClothes(itemValue)} style={styles.picker}>
                    <Picker.Item label="Casual" value="casual" />
                    <Picker.Item label="Formal" value="formal" />
                </Picker>

                {/* Eye Type Picker */}
                <Text style={styles.label}>Select Eye Type</Text>
                <Picker selectedValue={eyeType} onValueChange={(itemValue) => setEyeType(itemValue)} style={styles.picker}>
                    <Picker.Item label="Default" value="default" />
                    <Picker.Item label="Happy" value="happy" />
                    <Picker.Item label="Wink" value="wink" />
                    <Picker.Item label="Squint" value="squint" />
                    <Picker.Item label="Surprised" value="surprised" />
                </Picker>

                {/* Facial Hair Picker */}
                <Text style={styles.label}>Select Facial Hair</Text>
                <Picker selectedValue={facialHair} onValueChange={(itemValue) => setFacialHair(itemValue)} style={styles.picker}>
                    <Picker.Item label="None" value="none" />
                    <Picker.Item label="Beard" value="beardMajestic" />
                    <Picker.Item label="Moustache" value="moustacheFancy" />
                    <Picker.Item label="Goatee" value="goatee" />
                </Picker>

                {/* Accessories Picker */}
                <Text style={styles.label}>Select Accessories</Text>
                <Picker selectedValue={accessories} onValueChange={(itemValue) => setAccessories(itemValue)} style={styles.picker}>
                    <Picker.Item label="None" value="none" />
                    <Picker.Item label="Glasses" value="round" />
                    <Picker.Item label="Sunglasses" value="sunglasses" />
                    <Picker.Item label="Hat" value="hat" />
                </Picker>

                <TouchableOpacity style={styles.createButton} onPress={generateAvatar}>
                    <Text style={styles.createButtonText}>Create Avatar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(5),
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: hp(3),
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: hp(2),
    },
    avatarPreview: {
        justifyContent: 'center',
        alignItems: 'center',
        height: hp(30),
        marginBottom: hp(2),
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
    },
    avatarText: {
        fontSize: hp(2),
        color: '#666',
    },
    label: {
        fontSize: hp(2),
        fontWeight: '600',
        marginBottom: hp(1),
    },
    picker: {
        height: hp(5),
        marginBottom: hp(2),
    },
    createButton: {
        backgroundColor: '#6E44FF',
        padding: hp(2),
        borderRadius: hp(1),
        alignItems: 'center',
    },
    createButtonText: {
        color: 'white',
        fontSize: hp(2),
        fontWeight: 'bold',
    },
});
