import * as React from 'react';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  Text,
} from 'react-native-paper';
import App from './src/Home';
import NewCard from './src/components/NewCard';
import {
  Image,
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useEffect} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

function HomeScreen() {
  return (
    <SafeAreaView>
      <ScrollView style={styles.sectionContainer}>
        <Text variant="displayLarge">Home</Text>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <NewCard key={i} />
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => console.log('Pressed!')}
        style={styles.writeButton}>
        <Text variant="headlineSmall">Write</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function OtherScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text variant="displayLarge">My Page</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      backBehavior={'none'}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === '홈') {
            // iconName = focused
            //   ? 'ios-information-circle'
            //   : 'ios-information-circle-outline';
            iconName = 'home';
            return (
              <Image
                source={require('./assets/icon/home.png')}
                style={{width: size, height: size, backgroundColor: color}}
              />
            );
          } else if (route.name === '마이페이지') {
            // iconName = focused ? 'ios-list' : 'ios-list-outline';
            iconName = 'mypage';
            return (
              <Image
                source={require('./assets/icon/mypage.png')}
                style={{width: size, height: size, backgroundColor: color}}
              />
            );
          }
          // You can return any component that you like here!
          // return <Ionicons name={iconName} size={size} color={color} />;
          console.log(color, size, route.name);
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'white',
        tabBarLabel(props) {
          return <Text>{props.children}</Text>;
        },
      })}>
      <Tab.Screen
        name={'홈'}
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen name={'마이페이지'} component={OtherScreen} />
    </Tab.Navigator>
  );
};

export default function Main() {
  useEffect(() => {
    const loadRemoteConfig = async () => {
      const res = await remoteConfig().fetchAndActivate();
      // remoteConfig().setConfigSettings({
      //   minimumFetchIntervalMillis: 0,
      // });
      console.log(res);
      const parameters = remoteConfig().getAll();
      // console.log(parameters);
      // const p2 = remoteConfig().getValue('test');
      // console.log(p2);
      Object.entries(parameters).forEach($ => {
        const [key, entry] = $;
        console.log('Key: ', key);
        console.log('Source: ', entry.getSource());
        console.log('Value: ', entry.asString());
      });
    };
    loadRemoteConfig();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen
            name="Home"
            component={BottomTabNavigator}
            options={{headerShown: false}}
          />
          {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        </Stack.Navigator>
        {/* <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
          <Stack.Navigator>
            <Stack.Screen name="Other" component={OtherScreen} />
          </Stack.Navigator> */}
      </NavigationContainer>
    </PaperProvider>
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
