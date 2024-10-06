import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { useRouter } from 'expo-router';

export default function GuidedMeditationSession() {
  const router = useRouter();
  const description = `Guided visualization is a powerful tool to reduce stress and bring about a sense of calm by using the mind's eye to create relaxing mental images...`;

  const handleDownloadPDF = async () => {
    try {
      // Load the image asset
      const asset = Asset.fromModule(require('../../assets/images/back.png'));
      await asset.downloadAsync();

      // Convert the local image to base64 if required for iOS
      const base64Image = await FileSystem.readAsStringAsync(asset.localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imgSrc = `data:image/png;base64,${base64Image}`;

      // Define HTML content with the image and description
      const htmlContent = `
        <html>
          <body>
            <h1 style="text-align: center;">Guided Visualization for Stress Relief</h1>
            <img src="${imgSrc}" style="width: 100%; height: auto;" />
            <p style="font-size: 16px; text-align: justify;">${description}</p>
          </body>
        </html>
      `;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Save the PDF to media library (for Android)
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('Downloads', asset, false);
      }

      // Optionally share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.log('Error creating PDF:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Guided Visualization for Stress Relief</Text>
        <Image source={require('../../assets/images/back.png')} style={styles.image} />
        <Text style={styles.description}>{description}</Text>

        {/* Button to download the content as PDF */}
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPDF}>
          <Text style={styles.downloadButtonText}>Download as PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: hp(4), fontWeight: 'bold', marginBottom: 10 },
  image: { width: '100%', height: hp(25), marginBottom: 20 },
  description: { fontSize: hp(2.2), color: '#333', textAlign: 'justify' },
  downloadButton: { backgroundColor: '#6E44FF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  downloadButtonText: { color: '#fff', fontSize: hp(2.5), fontWeight: 'bold' },
});
