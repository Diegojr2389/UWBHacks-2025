import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Modal, SafeAreaView, Alert, TextInput, Vibration } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import Events from './components/Events';
import MapView, { Marker, Polyline, Polygon, PROVIDER_GOOGLE } from 'react-native-maps'
import { useFonts } from 'expo-font';
import Map from './components/Map'; 
import AddEvent from './components/AddEvent';

export default function App() {
  const [location, setLocation] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [addEventVisible, setAddEventVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  useEffect(() => {
    Vibration.vibrate([1200, 1500], true);
    Alert.alert('⚠️ You are approaching a dangerous area!', 
                'Would you like to reroute?', 
                [{text: 'YES', onPress: () => {Vibration.cancel(); setMapVisible(true)}}, 
                {text: 'NO', onPress: () => Vibration.cancel()}]);
  }, []);

  async function sendLocation(lat, lon) {
    if (lat && lon) {  // Check if latitude and longitude are valid
      try {
        // Enter in your server's IPv4 address to run, then start expo
        const response = await fetch('http://SERVER_IPV4_ADDR:3000/check-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude: lat, longitude: lon })
        });
        const data = await response.json();
        if (data.alert) {
          Alert.alert('Warning', `⚠️ ${data.message}`);
        } else {
          console.log(`✅ ${data.message}`);
        }
      } catch (error) {
        console.error('Error sending location:', error);
      }
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

  const handlePlaceSelect = (data, details) => {
    // 'data' contains the prediction, 'details' contains the full details of the place
    console.log('Selected place:', data);
    console.log('Place details:', details);
  };

  const [data, setData] = useState([
    {id: '1', title: 'Gunshots', location: "Fremont, Seattle", description: "Gunshots were reported by residents this week. No casualties reported.", date: new Date("2025-04-26T01:23:25")},
    {id: '2', title: 'Child Abduction', location: "Ballard, Seattle", description: "A child was reported missing after being abducted in this area 4 days ago.", date: new Date("2025-04-23T20:02:00")},
    {id: '3', title: 'Shooting', location: "Capitol Hill, Seattle", description: "Shooting ocurred in northern Capitol Hill. 2 Dead.", date: new Date("2025-04-21T18:06:00")}
  ])

  const handleSaveEvent = () => {
    if (!(eventTitle || '').trim() || !(eventLocation || '').trim() || !(eventDescription || '').trim()) {
      alert('Please fill out all fields.');
      return;
    }

    const newEvent = {
      id: Date.now().toString(), // Unique ID (simple trick using timestamp)
      title: eventTitle,
      location: eventLocation, // For now treat "eventDate" as "location" if you want, or add a separate location field
      description: eventDescription,
      date: new Date()
    };
  
    const updatedData = [...data, newEvent]; // Add new event to the data list
    const sortedData = updatedData.sort((a, b) => b.date - a.date);
    setData(sortedData);
    setAddEventVisible(false);    // Close the modal
  
    // Clear form fields
    setEventTitle('');
    setEventLocation('');
    setEventDescription('');
  };
  

  return (
    <ImageBackground source={require('./assets/images/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.mapButton} onPress={() => setMapVisible(true)}>
          <Text style={styles.mapText}>Map</Text>
          <Image source={require('./assets/images/map.png')} style={styles.map}></Image>
        </TouchableOpacity>

        <Map mapVisible={mapVisible} location={location} setMapVisible={setMapVisible}/>

        <AddEvent 
          addEventVisible={addEventVisible} setAddEventVisible={setAddEventVisible} 
          eventTitle={eventTitle} setEventTitle={setEventTitle} 
          eventLocation={eventLocation} setEventLocation={setEventLocation} 
          eventDescription={eventDescription} setEventDescription={setEventDescription} 
          onSaveEvent={handleSaveEvent}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => setAddEventVisible(true)}>
          <Text style={styles.addEventText}>Add Event</Text>
        </TouchableOpacity>

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
    borderColor: "#56666F",
  },
  addButton: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '6%',
    right: 15,
    width: 90,
    height: 45,
    backgroundColor: '#314048',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#56666F",
  },
  mapText: {
    color: 'white',
    fontSize: 14,
    marginRight: 8
  }, 
  addEventText: {
    color: 'white',
    fontSize: 14,
    alignItems: 'center'
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