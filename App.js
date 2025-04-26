import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import Events from './components/Events';

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
    <View style={styles.container}>
      <TouchableOpacity style={styles.mapButton}>
        <Text style={styles.text}>Map</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 15,
  },
  mapButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '3%',
    width: 75,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 5
  },
  text: {
    color: 'white',
    fontSize: 20
  }, 
  flatlist: {
    marginTop: 100
  }
});
