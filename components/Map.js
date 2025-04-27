import { StyleSheet, Text, View, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import MapView, { Marker, Heatmap } from 'react-native-maps'

const Map = ({mapVisible, location, setMapVisible}) => {
    const heatmapPoints = [
        { latitude: 47.7606, longitude: -122.1917, weight: 5 }, // Main UW Bothell
        { latitude: 47.7610, longitude: -122.1905, weight: 5 },
        { latitude: 47.7615, longitude: -122.1920, weight: 4 },
        { latitude: 47.7620, longitude: -122.1900, weight: 3 },
        { latitude: 47.7590, longitude: -122.1905, weight: 2 },
        { latitude: 47.7585, longitude: -122.1910, weight: 1 },
    ];

    return (    
        <Modal 
            visible={mapVisible}
            animationType='slide'
            onRequestClose={() => {setMapVisible(false)}}
        >
            <SafeAreaView style={styles.overlay}>
                <TouchableOpacity style={styles.closeButton} onPress={() => {setMapVisible(false)}}>
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
                    <Heatmap
                        points={heatmapPoints}
                        radius={50}
                        opacity={1}
                        gradient={{
                        colors: ["#0aff00", "#fffa00", "#ff0000"],
                        startPoints: [0.1, 0.5, 0.9],
                        colorMapSize: 256,
                        }}
                    />
                    </MapView>
                )}
                </View>
            </SafeAreaView>
        </Modal>
    )
};

const styles = StyleSheet.create({
    closeButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0e161b',
        width: '100%'
    },
    closeBtnTxt: {
        color: 'white',
        fontFamily: 'Poppins-Regular'
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

export default Map;