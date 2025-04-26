import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const Events = ({data}) => {
  const [itemID, setItemID] = useState();

  const toggleExpanded = (id) => {
    setItemID((prevID) => (prevID === id ? null : id));
  };

  return (
    <FlatList
        data={data}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => {toggleExpanded(item.id)}}>
            <View style={(itemID === item.id) ? styles.itemPressed : styles.item}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.location}>{item.location}</Text>
                {itemID === item.id && (<Text style={styles.description}>{item.description}</Text>)}
            </View>
        </TouchableOpacity>
        )}>
    </FlatList>
  )
};
const styles = StyleSheet.create({
    item: {
        backgroundColor: 'rgba(49, 64, 72, 0.5)',
        marginBottom: 10,
        borderRadius: 20,
        padding: 15,
    },
    itemPressed: {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      marginBottom: 10,
      borderRadius: 20,
      padding: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: 500,
      color: '#fff',
      fontFamily: 'Poppins-SemiBold'
    },
    location: {
      color: '#fff',
      fontFamily: 'Poppins-Regular',
      fontSize: 16
    },
    description: {
      color: '#fff',
      fontFamily: 'Poppins-Regular',
    }
});

export default Events;
