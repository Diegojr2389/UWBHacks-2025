import { StyleSheet, Text, View, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { TextInput } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants'
import 'react-native-get-random-values'

const AddEvent = ({addEventVisible, setAddEventVisible, eventTitle, setEventTitle, eventLocation, setEventLocation, eventDescription, setEventDescription, onSaveEvent}) => {
    return (
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

                    <View>
                        <GooglePlacesAutocomplete
                            placeholder="Enter location"
                            listViewDisplayed='auto'
                            onPress= {(data, details=null) => {setEventLocation(data.description)}}
                            query={{
                                key: Constants.expoConfig.extra.REACT_APP_GOOGLE_MAPS_API_KEY,
                                language: 'en',
                            }}
                            value={eventLocation}
                            styles={{
                                container: {
                                    flex: 0,
                                    position: 'relative',
                                    zIndex: 10
                                },
                                textInput: {
                                    backgroundColor: '#232E30',
                                    color: 'white',
                                    padding: 10,
                                    marginVertical: 5,
                                    borderRadius: 10
                                }
                            }}
                            fetchDetails={true} // Needed to get coordinates
                            debounce={500}     // Wait 500ms after typing stops before searching
                            onFail={(error) => console.error(error)}
                        />  
                    </View>
                        
                    <TextInput
                        placeholder="Event Description"
                        placeholderTextColor="#56666F"
                        value={eventDescription}
                        onChangeText={setEventDescription}
                        style={[styles.input, { height: 80 }]}
                        multiline
                    />

                    <TouchableOpacity style={styles.saveButton} onPress={onSaveEvent}>
                        <Text style={styles.saveButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

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
})

export default AddEvent;