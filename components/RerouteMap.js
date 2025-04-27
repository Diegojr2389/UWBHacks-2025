import { StyleSheet, Modal, SafeAreaView, TouchableOpacity, Text, View } from 'react-native';

const RerouteMap = ({rerouteVisible, setRerouteVisible}) => {
    return (    
        <Modal 
            visible={rerouteVisible}
            animationType='fade'
            onRequestClose={() => {setRerouteVisible(false)}}
        >
            <SafeAreaView style={styles.overlay}>
                <TouchableOpacity style={styles.closeButton} onPress={() => {setRerouteVisible(false)}}>
                    <Text style={styles.closeBtnTxt}>CLOSE</Text>
                </TouchableOpacity>
                <View style={styles.popup}/>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    closeButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#314048',
        width: '100%'
    },
    closeBtnTxt: {
        color: 'white',
        fontFamily: 'Poppins-Regular'
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
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 20
    }
})

export default RerouteMap;