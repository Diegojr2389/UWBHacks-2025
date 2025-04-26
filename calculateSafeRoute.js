import MapView, { Marker, Polyline, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import haversine from 'haversine-distance';
// My key: AIzaSyC96OfrkwvwohzN0NcBqk6p6-dUSUxohDE

const dangerZones = [];

//const url = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC96OfrkwvwohzN0NcBqk6p6-dUSUxohDE&callback=myMap";