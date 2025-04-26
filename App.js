import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState();

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
      <TouchableOpacity style={styles.homeButton}>
        <Text style={styles.text}>Map</Text>
      </TouchableOpacity>

      {location ? (
        <Text>Lat: {location.latitude}, Lon: {location.longitude}</Text>
      ) : (
        <Text>Getting location...</Text>
      )}

      {/* <FlatList></FlatList> */}
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    position: 'absolute',
    top: 35,
    left: 10,
    width: 50,
    height: 30,
    backgroundColor: 'black',
    borderRadius: 5
  },
  text: {
    color: 'white',
    textAlign: 'center'
  }
});
