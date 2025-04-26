import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button, FlatList, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <TouchableOpacity styles={styles.homeButton}>
        <Text>Map</Text>
      </TouchableOpacity>
      {/* <FlatList></FlatList> */}
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    backgroundColor: 'black'
  }
});
