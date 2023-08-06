import * as React from 'react';
import {MD3LightTheme as DefaultTheme, Text} from 'react-native-paper';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import NewCard from '../components/NewCard';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

type HomeScreenProps = {
  navigation: any;
};
function HomeScreen({navigation}: HomeScreenProps) {
  return (
    <SafeAreaView>
      <ScrollView style={styles.sectionContainer}>
        <Text variant="displayLarge">Home</Text>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <NewCard key={i} />
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate('WritePost')}
        style={styles.writeButton}>
        <Text variant="headlineSmall">Write</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  writeButton: {
    position: 'absolute',
    backgroundColor: 'tomato',
    borderRadius: 30,
    width: 100,
    right: 20,
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

export default HomeScreen;
