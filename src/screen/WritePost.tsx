import * as React from 'react';
import {MD3LightTheme as DefaultTheme, Text} from 'react-native-paper';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import NewCard from '../components/NewCard';

type WritePostScreenProps = {
  navigation: any;
};
function WritePostScreen(props: WritePostScreenProps) {
  const {navigation} = props;
  return (
    <SafeAreaView>
      <ScrollView
        style={styles.sectionContainer}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <Text variant="displayLarge">WritePost</Text>
        <NewCard />
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
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
    // flex: 1,
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

export default WritePostScreen;
