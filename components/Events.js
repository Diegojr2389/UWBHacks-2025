import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import FormattedDate from './Date';

const Events = ({data}) => {
  const [itemID, setItemID] = useState(null);

  const toggleExpanded = (id) => {
    setItemID((prevID) => (prevID === id ? null : id));
  };
  
  return (
    <FlatList
        data={data}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => {toggleExpanded(item.id)}}>
            <View style={(itemID === item.id) ? styles.itemPressed : styles.item}>
              <View style={styles.dateContainer}>
                <FormattedDate date={item.date}/>
              </View>
              <Text style={(itemID === item.id) ? styles.titleExpanded : styles.title}>{item.title}</Text>
              <Text style={(itemID === item.id) ? styles.locationExpanded : styles.location}>{item.location}</Text>
              {itemID !== item.id && (<Text style={styles.click}>Click for more info</Text>)}
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
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      marginBottom: 10,
      borderRadius: 20,
      padding: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: 500,
      color: '#fff',
    },
    titleExpanded: {
      fontSize: 20,
      fontWeight: 500,
      color: '#000',
    },
    location: {
      color: '#fff',
      fontSize: 17
    },
    locationExpanded: {
      color: '#000',
      fontSize: 17
    },
    description: {
      color: '#000',
    },
    click: {
      color: 'gray',
      fontSize: 12
    },
    dateContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-end'
    }
});

export default Events;
