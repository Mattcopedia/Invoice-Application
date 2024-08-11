import React from 'react';
import {Pressable, View,FlatList, Image,Text, TouchableOpacity} from 'react-native';
import styles from './SelectStyles';
import { useNavigation } from '@react-navigation/native';
import Checkbox from '../Checkbox';

const FlatListSelect = ({filteredAllInvoices,type,handleCheckboxChange}) => {
  const navigation = useNavigation();
 
  return (
    <FlatList
    showsVerticalScrollIndicator={true}
    data={filteredAllInvoices}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, index }) => (
        <Pressable style={styles.containerFlex} onPress={() => handleCheckboxChange(index)}>
            <View style={styles.item}>
                <Checkbox 
                    checked={item.checked} 
                    onChange={() => handleCheckboxChange(index)}
                /> 
                <Image
                    style={styles.image}
                    source={{ uri: item?.ImageUri }}
                />
                <Text style={styles.text}>{item?.Description.substring(0, 23)} - {item.SampleCode}</Text>
            </View> 
        </Pressable>
    )}

    ListFooterComponent={() => (
        
        <View>
              {(type === "select") && (
                   <TouchableOpacity style={styles.delRow} onPress={() => navigation.navigate('ListSelected')}>
                   <Image style={styles.delete} source={require('../../assets/icons8-delete-48.png')} />
                   <Text style={styles.titleProduct}>Delete selected product</Text> 
               </TouchableOpacity> 
            )} 
        </View>   
    )}
/>

  );
}; 

export default React.memo(FlatListSelect);
 