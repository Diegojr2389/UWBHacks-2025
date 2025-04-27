import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Modal, SafeAreaView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import Events from './components/Events';
import MapView, { Marker, Polyline, Polygon, PROVIDER_GOOGLE } from 'react-native-maps'
import { useFonts } from 'expo-font';
import Map from './components/Map'; 
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import haversine from 'haversine-distance';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useRef, useState } from 'react';
//const url = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC96OfrkwvwohzN0NcBqk6p6-dUSUxohDE&callback=myMap";

const dangerZones = [  
    {
        id: 'zone1',
        coordinates: [
        { latitude: 47.6062, longitude: -122.3321 },
        { latitude: 47.6065, longitude: -122.3325 },
        { latitude: 47.6058, longitude: -122.3330 },
        { latitude: 47.6055, longitude: -122.3323 },
    ],
  },
  // Add more zones here
];

export default function SafeRouteMap() {
    
}

export default function App() {
    const {isLoaded} = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries: ['places'],
    })
    const [visible, setVisible] = useState(false);
    const [location, setLocation] = useState(null);
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const originRef = useRef();
    const destinationRef = useRef();

    if (!isLoaded) {
      return <LOL />
    }

    async function calculateRoute() {
      if (originRef.current.value === '' || destinationRef.current.value === '') {
          return
      }
      const directionsService = new google.maps.directionsService()
      const results = await directionsService.route({
        origin: originRef,current,value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.WALKING,
        provideRouteAlternatives: true
      });

    }

    //async function sendLocation(lat, lon)
}
