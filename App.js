import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Modal, SafeAreaView, Alert, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import Events from './components/Events';
import MapView, { Marker, Polyline, Polygon, PROVIDER_GOOGLE } from 'react-native-maps'
import { useFonts } from 'expo-font';
import Map from './components/Map'; 

export default function App() {
  const [location, setLocation] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [addEventVisible, setAddEventVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');

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

  const handlePlaceSelect = (data, details) => {
    // 'data' contains the prediction, 'details' contains the full details of the place
    console.log('Selected place:', data);
    console.log('Place details:', details);
  };

  const [data, setData] = useState([
    {id: '1', title: 'Frequent Robberies', location: "Capitol Hill, Seattle", description: "This area has a reputation for frequent robberies, with many incidents reported in recent months, making it one of the more dangerous parts of the city."},
    {id: '2', title: 'Child Abduction', location: "Ballard, Seattle", description: "A child was reported missing after being abducted in this area 4 days ago."},
    {id: '3', title: 'Gunshots', location: "Fremont, Seattle", description: "Gunshots were reported by residents this week. No casualties reported."}
  ])

  const handleSaveEvent = () => {
    if (!eventTitle.trim() || !eventLocation.trim() || !eventDescription.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    const newEvent = {
      id: Date.now().toString(), // Unique ID (simple trick using timestamp)
      title: eventTitle,
      location: eventLocation, // For now treat "eventDate" as "location" if you want, or add a separate location field
      description: eventDescription,
    };
  
    setData([...data, newEvent]); // Add new event to the data list
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

        <TouchableOpacity style={styles.addButton} onPress={() => setAddEventVisible(true)}>
          <Text style={styles.addEventText}>Add Event</Text>
        </TouchableOpacity>
    
      {/* Add Event Popup */}
      <Modal 
        visible={addEventVisible}
        animationType='slide'
        onRequestClose={() => setAddEventVisible(false)}
      >
        <SafeAreaView style={styles.overlay}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setAddEventVisible(false)}>
            <Text style={styles.closeBtnTxt}>CLOSE</Text>
          </TouchableOpacity>
          
          <View style={styles.popup}>
            <Text style={styles.modalTitle}>Add New Event</Text>
            <Text style={styles.underline}/>

            <TextInput
              placeholder="Event Title"
              placeholderTextColor="#56666F"
              value={eventTitle}
              onChangeText={setEventTitle}
              style={styles.input}
            />
            
            <TextInput
              placeholder="Event Location"
              placeholderTextColor="#56666F"
              value={eventLocation}
              onChangeText={setEventLocation}
              style={styles.input}
            />
            
            <TextInput
              placeholder="Event Description"
              placeholderTextColor="#56666F"
              value={eventDescription}
              onChangeText={setEventDescription}
              style={[styles.input, { height: 80 }]}
              multiline
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEvent}>
              <Text style={styles.saveButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

    
    
  
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
    backgroundColor: '#162022',
    justifyContent: 'center',
    alignItems: 'center'
  },
  popup: {
    width: '95%',
    height: '92%',
    padding: 10,
    backgroundColor: '#162022',
    borderRadius: 10,
    elevation: 20
  },
  input: {
    backgroundColor: '#232E30',
    color: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#56666F',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 110
  },
  underline: {
    marginTop: 8,
    marginBottom: 8,
    height: 2,
    width: 353,
    backgroundColor: '#56666F',
    borderRadius: 2
  }
});
