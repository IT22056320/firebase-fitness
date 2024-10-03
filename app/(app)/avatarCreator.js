import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { processImage } from '../../components/avatarProcessing';

const AvatarCreator = () => {
    const [avatarImage, setAvatarImage] = useState(null);

    const openCamera = () => {
        launchCamera({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                processAndSetImage(response.assets[0].uri);
            }
        });
    };

    const openGallery = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image Picker Error: ', response.error);
            } else {
                processAndSetImage(response.assets[0].uri);
            }
        });
    };

    const processAndSetImage = async (uri) => {
        const avatar = await processImage(uri); // Implement your processing logic
        setAvatarImage(avatar);
    };

    return (
        <View>
            <Button title="Open Camera" onPress={openCamera} />
            <Button title="Upload Image" onPress={openGallery} />
            {avatarImage && <Image source={{ uri: avatarImage }} style={{ width: 200, height: 200 }} />}
            {avatarImage ? <Text>Your Avatar is Ready!</Text> : <Text>No Avatar Created Yet.</Text>}
        </View>
    );
};

export default AvatarCreator;