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
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import NewCard from '../components/NewCard';
import {Camera, PhotoFile, useCameraDevices} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import ViewShot from 'react-native-view-shot';
import {useEffect, useRef} from 'react';
import Share from 'react-native-share';

type WritePostScreenProps = {
  navigation: any;
};
function WritePostScreen(props: WritePostScreenProps) {
  const {navigation} = props;

  const devices = useCameraDevices();
  const device = devices.back;
  const camera = useRef<Camera>(null);
  const viewShotRef = useRef<ViewShot>(null);
  // const [capturedPhoto, setCapturedPhoto] = React.useState<ImageSourcePropType>(null);
  const [capturedPhoto, setCapturedPhoto] = React.useState<{
    uri: string;
  } | null>(null);

  const handleOverlayAndSave = async () => {
    if (viewShotRef.current) {
      // Capture the combined view
      viewShotRef.current
        .capture?.()
        .then(async (uri: string) => {
          // Save the captured view to a new file
          const savePath = RNFS.DocumentDirectoryPath + '/combined_image.jpg';
          await RNFS.copyFile(uri, savePath);
          const result = await Share.open({
            url: Platform.OS === 'ios' ? `file://${uri}` : uri,
          });
          console.log('Combined image saved to: ', savePath);
          // setImageUri(savePath);
        })
        .catch((error: any) => {
          console.warn('Error capturing combined image: ', error);
        });
    }
  };

  const takePhoto = async () => {
    if (camera.current) {
      const photo: PhotoFile = await camera.current.takePhoto({
        flash: 'off',
      });
      setCapturedPhoto({uri: 'file://' + photo.path});
      // handleOverlayAndSave();
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
        const newCameraPermission2 = await Camera.requestCameraPermission();
        if (newCameraPermission2 !== 'authorized') {
          await Linking.openSettings();
        }
        break;
    }
  };

  // const onImageLoad = () => {
  //   console.log(`Image Loaded: ${capturedPhoto?.uri}`);
  //   handleOverlayAndSave();
  // };

  useEffect(() => {
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
        <Text variant="displaySmall">Challenge</Text>
        <Camera
          ref={camera}
          style={styles.cameraPreview}
          device={device}
          photo={true}
          isActive={true}
        />
        <View style={{flex: 1}}>
          {capturedPhoto ? (
            <ViewShot
              ref={viewShotRef}
              options={{
                fileName: 'test',
                format: 'jpg',
                quality: 1,
              }}
              style={{
                backgroundColor: 'transparent',
                flex: 1,
              }}>
              <Image
                source={require('../../assets/image/gold-tier.png')}
                style={{
                  position: 'absolute',
                  zIndex: 100,
                  height: 600,
                  backgroundColor: 'transparent',
                }}
              />
              <Image source={{uri: capturedPhoto?.uri}} style={{height: 600}} />
            </ViewShot>
          ) : (
            <View style={{height: 200}}>
              <Text>No photo</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={
          // () => navigation.navigate('Home')
          takePhoto
        }
        style={styles.writeButton}>
        <Text variant="headlineSmall">Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleOverlayAndSave}
        style={styles.shareButton}>
        <Text variant="headlineSmall">Share Photo</Text>
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
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  shareButton: {
    position: 'absolute',
    backgroundColor: 'tomato',
    borderRadius: 30,
    width: 100,
    right: 20,
    bottom: 110,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

export default WritePostScreen;
