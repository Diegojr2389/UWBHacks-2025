import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker, Heatmap } from 'react-native-maps'

const Map = ({visible, location, setVisible}) => {
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

    return (    
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
            </View>
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