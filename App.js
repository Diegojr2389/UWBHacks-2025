import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import Events from './components/Events';
import MapView, { Marker } from 'react-native-maps'

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

  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mapButton}>
        <Text style={styles.text} onPress={() => setVisible(true)}>Map</Text>
      </TouchableOpacity>

      {/* Map popup */}
      <Modal 
        visible={visible}
        animationType='slide'
        onRequestClose={() => {setVisible(false)}}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.closeButton} onPress={() => {setVisible(false)}}>
            <Text style={styles.closeBtnTxt}>CLOSE</Text>
          </TouchableOpacity>
          <View style={styles.popup}>
            {location && (
              <MapView
              style={{flex: 1}}
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
              >
                <Marker
                  coordinate={{ latitude: location.latitude, longitude: location.longitude}}
                />
              </MapView>
            )}
          </View>
        </View>
      </Modal>
    
      {/* {location ? (
        <Text>Lat: {location.latitude}, Lon: {location.longitude}</Text>
      ) : (
        <Text>Getting location...</Text>
      )} */}

      {/* Event list */}
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
  },
  closeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0e161b',
    width: '100%'
  },
  closeBtnTxt: {
    color: 'white',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#56666f',
    justifyContent: 'center',
    alignItems: 'center'
  },
  popup: {
    width: '95%',
    height: '92%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 20
  }
});
