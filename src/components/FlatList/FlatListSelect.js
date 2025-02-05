import React, { useCallback, useState } from 'react';
import {Pressable, View,FlatList, Image,Text, TouchableOpacity} from 'react-native';
import styles from './SelectStyles';
import { useNavigation } from '@react-navigation/native';
import Checkbox from '../Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshControl } from 'react-native-gesture-handler';
import { fetchProductItem } from '../../store/redux-thunks/ProductItemThunk';
import { fetchProductSelect } from '../../store/redux-thunks/ProductSelectThunk';

const FlatListSelect = ({filteredAllInvoices,type,handleCheckboxChange}) => { 
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state => state?.invoices?.user) 
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(fetchProductItem(user?.uid))  
    dispatch(fetchProductSelect(user?.uid))  
    setRefreshing(false); 
  }, [])    

 
  return (
    <FlatList
    showsVerticalScrollIndicator={true}
    data={filteredAllInvoices}
    refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
 