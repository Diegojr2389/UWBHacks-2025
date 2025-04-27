import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import MapView, { Marker, Heatmap, Polyline } from 'react-native-maps';
import { useState, useEffect } from 'react';

const Map = ({ mapVisible, location, setMapVisible }) => {
    const [startCoords, setStartCoords] = useState(null);
    const [destCoords, setDestCoords] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [startLat, setStartLat] = useState('');
    const [startLng, setStartLng] = useState('');
    const [destLat, setDestLat] = useState('');
    const [destLng, setDestLng] = useState('');
    
    // Set current location as default start point when available
    useEffect(() => {
        if (location) {
            setStartCoords(location);
            setStartLat(location.latitude.toString());
            setStartLng(location.longitude.toString());
        }
    }, [location]);

    const heatmapPoints = [
        { latitude: 47.7615, longitude: -122.2050, weight: 1 },
        { latitude: 47.7580, longitude: -122.2105, weight: 0.8 },
        { latitude: 47.7650, longitude: -122.1950, weight: 0.7 },
        { latitude: 47.7700, longitude: -122.2000, weight: 0.6 },
        { latitude: 47.7550, longitude: -122.2150, weight: 0.5 },
        { latitude: 47.7680, longitude: -122.2080, weight: 0.9 },
        { latitude: 47.7625, longitude: -122.2025, weight: 0.4 },
        { latitude: 47.7595, longitude: -122.2200, weight: 0.7 },
        { latitude: 47.7710, longitude: -122.1970, weight: 0.6 },
    ];

    const parseCoordinates = () => {
        try {
            // Parse and validate coordinates
            const sLat = parseFloat(startLat);
            const sLng = parseFloat(startLng);
            const dLat = parseFloat(destLat);
            const dLng = parseFloat(destLng);
            
            if (isNaN(sLat) || isNaN(sLng) || isNaN(dLat) || isNaN(dLng)) {
                Alert.alert("Invalid coordinates", "Please enter valid numbers for coordinates");
                return false;
            }

            if (sLat < -90 || sLat > 90 || dLat < -90 || dLat > 90 ||
                sLng < -180 || sLng > 180 || dLng < -180 || dLng > 180) {
                Alert.alert("Invalid coordinates", "Latitude must be between -90 and 90, longitude between -180 and 180");
                return false;
            }

            setStartCoords({ latitude: sLat, longitude: sLng });
            setDestCoords({ latitude: dLat, longitude: dLng });
            return true;
        } catch (error) {
            Alert.alert("Error", "Failed to parse coordinates");
            return false;
        }
    };

    const getDirections = async () => {
        if (!parseCoordinates()) return;
        
        try {
            const apiKey = 'AIzaSyC96OfrkwvwohzN0NcBqk6p6-dUSUxohDE';
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${startCoords.latitude},${startCoords.longitude}&destination=${destCoords.latitude},${destCoords.longitude}&key=${apiKey}`
            );
            
            const result = await response.json();
            
            if (result.status !== 'OK') {
                Alert.alert('Error', `Failed to get directions: ${result.status}`);
                return;
            }
            
            // Decode polyline
            const points = result.routes[0].overview_polyline.points;
            const decodedCoords = decodePolyline(points);
            
            setRouteCoordinates(decodedCoords);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch directions');
            console.error(error);
        }
    };

    // Decoding Google's polyline format
    const decodePolyline = (encoded) => {
        const poly = [];
        let index = 0, len = encoded.length;
        let lat = 0, lng = 0;

        while (index < len) {
            let b, shift = 0, result = 0;
            
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            
            const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;
            
            shift = 0;
            result = 0;
            
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            
            const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;
            
            const point = {
                latitude: lat / 1e5,
                longitude: lng / 1e5
            };
            
            poly.push(point);
        }
        
        return poly;
    };

    const resetRoute = () => {
        setRouteCoordinates([]);
        setDestCoords(null);
        setDestLat('');
        setDestLng('');
    };

    const getMapRegion = () => {
        if (!startCoords) return null;
        if (!destCoords) {
            return {
                latitude: startCoords.latitude,
                longitude: startCoords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            };
        }
        
        // Calculate center point and deltas to include both points
        const midLat = (startCoords.latitude + destCoords.latitude) / 2;
        const midLng = (startCoords.longitude + destCoords.longitude) / 2;
        const latDelta = Math.abs(startCoords.latitude - destCoords.latitude) * 1.5;
        const lngDelta = Math.abs(startCoords.longitude - destCoords.longitude) * 1.5;
        
        return {
            latitude: midLat,
            longitude: midLng,
            latitudeDelta: Math.max(0.01, latDelta),
            longitudeDelta: Math.max(0.01, lngDelta)
        };
    };

    return (    
        <Modal 
            visible={mapVisible}
            animationType='slide'
            onRequestClose={() => {setMapVisible(false)}}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.closeButton} onPress={() => {setMapVisible(false)}}>
                    <Text style={styles.closeBtnTxt}>CLOSE</Text>
                </TouchableOpacity>
                <View style={styles.popup}>
                    <View style={styles.routingContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Start Point:</Text>
                            <View style={styles.coordInputs}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Latitude"
                                    value={startLat}
                                    onChangeText={setStartLat}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Longitude"
                                    value={startLng}
                                    onChangeText={setStartLng}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Destination:</Text>
                            <View style={styles.coordInputs}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Latitude"
                                    value={destLat}
                                    onChangeText={setDestLat}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Longitude"
                                    value={destLng}
                                    onChangeText={setDestLng}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.routeButton} onPress={getDirections}>
                                <Text style={styles.buttonText}>Get Route</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.resetButton} onPress={resetRoute}>
                                <Text style={styles.buttonText}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={styles.mapContainer}>
                        {location && (
                            <MapView
                                style={styles.map}
                                region={getMapRegion()}
                            >
                                {/* Current location marker */}
                                {startCoords && (
                                    <Marker
                                        coordinate={startCoords}
                                        pinColor="green"
                                        title="Start"
                                    />
                                )}
                                
                                {/* Destination marker */}
                                {destCoords && (
                                    <Marker
                                        coordinate={destCoords}
                                        pinColor="red"
                                        title="Destination"
                                    />
                                )}
                                
                                {/* Route polyline */}
                                {routeCoordinates.length > 0 && (
                                    <Polyline
                                        coordinates={routeCoordinates}
                                        strokeWidth={4}
                                        strokeColor="#0066ff"
                                    />
                                )}
                                
                                {/* Heatmap */}
                                <Heatmap
                                    points={heatmapPoints}
                                    radius={50}
                                    opacity={0.7}
                                    gradient={{
                                        colors: ["#0aff00", "#fffa00", "#ff0000"],
                                        startPoints: [0.1, 0.5, 0.9],
                                        colorMapSize: 256,
                                    }}
                                />
                            </MapView>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    closeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0e161b',
        width: '100%',
        padding: 10
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
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 20,
        overflow: 'hidden'
    },
    routingContainer: {
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    inputGroup: {
        marginBottom: 10,
    },
    inputLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    coordInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginHorizontal: 2,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    routeButton: {
        backgroundColor: '#314048',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    resetButton: {
        backgroundColor: '#666',
        padding: 10,
        borderRadius: 5,
        flex: 0.5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        flex: 1,
    }
});

export default Map;