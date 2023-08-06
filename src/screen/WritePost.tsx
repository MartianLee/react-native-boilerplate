import * as React from 'react';
import {MD3LightTheme as DefaultTheme, Text} from 'react-native-paper';
import {
  Image,
  ImageSourcePropType,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import NewCard from '../components/NewCard';
import {Camera, PhotoFile, useCameraDevices} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';

type WritePostScreenProps = {
  navigation: any;
};
function WritePostScreen(props: WritePostScreenProps) {
  const {navigation} = props;

  const devices = useCameraDevices();
  const device = devices.back;
  const camera = React.useRef<Camera>(null);
  // const [capturedPhoto, setCapturedPhoto] = React.useState<ImageSourcePropType>(null);
  const [capturedPhoto, setCapturedPhoto] = React.useState<{
    uri: string;
  } | null>(null);

  const takePhoto = async () => {
    if (camera.current) {
      const photo: PhotoFile = await camera.current.takePhoto({
        flash: 'off',
      });
      setCapturedPhoto({uri: 'file://' + photo.path});
      // const savePath = RNFS.DocumentDirectoryPath + '/my_photo.jpg';
      // await RNFS.moveFile(photo.path, savePath);
      // setCapturedPhoto({uri: savePath});
      console.log(photo);
    }
  };

  const requestCameraPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();

    switch (cameraPermission) {
      case 'authorized':
        // 카메라 권한이 있을때 실행할 로직
        break;

      case 'not-determined':
        // 아직 권한 요청을 하지 않은 상태로 새롭게 권한 요청하기
        const newCameraPermission = await Camera.requestCameraPermission();

        if (newCameraPermission === 'authorized') {
          // 카메라 권한이 있을때 실행할 로직
        } else if (newCameraPermission === 'denied') {
          // 권한 요청을 했지만 거부됐을때 실행할 로직
          // ex) 설정으로 이동, 권한이 없으면 카메라 실행할 수 없다는 알림창 등등
          await Linking.openSettings();
        }
        break;

      case 'denied':
        // 권한 요청을 했지만 거부됐을때 실행할 로직
        // ex) 설정으로 이동, 권한이 없으면 카메라 실행할 수 없다는 알림창 등등
        await Linking.openSettings();
        break;
    }
  };
  React.useEffect(() => {
    requestCameraPermission();
  }, []);

  if (device == null)
    return (
      <SafeAreaView>
        <Text variant="displayLarge">Loading</Text>
      </SafeAreaView>
    );

  console.log(capturedPhoto?.uri);

  return (
    <SafeAreaView>
      <ScrollView
        style={styles.sectionContainer}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <Text variant="displayLarge">WritePost</Text>
        <View style={{flex: 1}}>
          {capturedPhoto ? (
            <Image source={{uri: capturedPhoto?.uri}} style={{height: 200}} />
          ) : (
            <View style={{height: 200}}>
              <Text>No photo</Text>
            </View>
          )}
        </View>
        <Camera
          ref={camera}
          style={styles.cameraPreview}
          device={device}
          photo={true}
          isActive={true}
        />
      </ScrollView>
      <TouchableOpacity
        onPress={
          // () => navigation.navigate('Home')
          takePhoto
        }
        style={styles.writeButton}>
        <Text variant="headlineSmall">Take Photo</Text>
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
  cameraPreview: {
    flex: 1,
    aspectRatio: 1,
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
