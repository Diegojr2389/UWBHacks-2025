import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const Events = ({data}) => {
  const [expanded, setExpanded] = useState(false);
  const [itemID, setItemID] = useState();

  const toggleExpanded = (id) => {
    setItemID((prevID) => (prevID === id ? null : id));
  };

  return (
    <FlatList
        data={data}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => {toggleExpanded(item.id)}}>
            <View style={styles.item}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>{item.location}</Text>
                {itemID === item.id && (<Text>{item.description}</Text>)}
            </View>
        </TouchableOpacity>
        )}>
    </FlatList>
  )
};
const styles = StyleSheet.create({
    item: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        marginBottom: 10,
        borderRadius: 20,
        padding: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: 500
    }
});

export default Events;
