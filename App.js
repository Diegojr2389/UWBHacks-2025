import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Modal, SafeAreaView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import Events from './components/Events';
import MapView, { Marker } from 'react-native-maps'
import { useFonts } from 'expo-font';
import Map from './components/Map'; 

export default function App() {
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState(null);

  async function sendLocation(lat, lon) {
    try {
      // THIS IS IPV4 ADDRESS, WILL CHANGE BASED LOCATION
      const response = await fetch('http://10.18.153.206:3000/check-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lon })
      });
      const data = await response.json();
      //console.log(data);
      if (data.alert) { // ALERT DETECTED, BUILD A NOTIFICATION TO DISPLAY THIS TO THE USER
        Alert(`⚠️ ${data.message}`);
      } else {
        console.log(`✅ ${data.message}`);
      }
    } catch (error) {
      console.error('Error sending location:', error);
    }
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Permission denied!");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      if (loc?.coords) {
        sendLocation(loc.coords.latitude, loc.coords.longitude)
      }

      const interval = setInterval(async () => {
        let newLoc = await Location.getCurrentPositionAsync({});
        setLocation(newLoc.coords);
        if (newLoc?.coords) {
          sendLocation(newLoc.coords.latitude, newLoc.coords.longitude);
        }
      }, 30000); //30 sec interval
  
      return () => clearInterval(interval);
    })();
  }, []);
  console.log(location);

  let [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
  });
  
  if (!fontsLoaded) {
    return null;
  }

  const data = [
    {id: '1', title: 'Frequent Robberies', location: "Capitol Hill, Seattle", description: "This area has a reputation for frequent robberies, with many incidents reported in recent months, making it one of the more dangerous parts of the city."},
    {id: '2', title: 'Child Abduction', location: "Ballard, Seattle", description: "A child was reported missing after being abducted in this area 4 days ago."},
    {id: '3', title: 'Gunshots', location: "Fremont, Seattle", description: "Gunshots were reported by residents this week. No casualties reported."},
  ]

  return (
    <ImageBackground source={require('./assets/images/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.mapButton} onPress={() => setVisible(true)}>
          <Text style={styles.text}>Map</Text>
          <Image source={require('./assets/images/map.png')} style={styles.map}></Image>
        </TouchableOpacity>

        <Map visible={visible} location={location} setVisible={setVisible}/>
  
      {/* Event list */}
      <View style={styles.flatlist}>
          <Events data={data}/>
        </View>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
  },
  mapButton: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '6%',
    left: 15,
    width: 90,
    height: 45,
    backgroundColor: '#314048',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fbfaf5",
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginRight: 8
  }, 
  flatlist: {
    marginTop: 100
  },
  map: {
    width: 18,
    height: 18
  },
  backgroundImage: {
    flex: 1
  }
});
