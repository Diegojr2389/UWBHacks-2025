import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import Events from './components/Events';
import { useFonts } from 'expo-font';

export default function App() {
  const [location, setLocation] = useState();
  const data = [
    {id: '1', title: 'Frequent Robberies', location: "Capitol Hill, Seattle", description: "This area has a reputation for frequent robberies, with many incidents reported in recent months, making it one of the more dangerous parts of the city."},
    {id: '2', title: 'Child Abduction', location: "Ballard, Seattle", description: "A child was reported missing after being abducted in this area 4 days ago."},
    {id: '3', title: 'Gunshots', location: "Fremont, Seattle", description: "Gunshots were reported by residents this week. No casualties reported."},
  ]

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Permission denied!");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  return (
    <ImageBackground source={require('./assets/images/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.mapButton}>
          <Text style={styles.text}>Map</Text>
          <Image source={require('./assets/images/map.png')} style={styles.map}></Image>
        </TouchableOpacity>
      
        {/* {location ? (
          <Text>Lat: {location.latitude}, Lon: {location.longitude}</Text>
        ) : (
          <Text>Getting location...</Text>
        )} */}
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
