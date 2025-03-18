import React, { useCallback, useState } from 'react';
import {Pressable, View,FlatList, Image,Text, RefreshControl} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { fetchProductItem } from '../../store/redux-thunks/ProductItemThunk';
import { fetchProductSelect } from '../../store/redux-thunks/ProductSelectThunk';
import { useDispatch, useSelector } from 'react-redux';

const FlatListProduct = ({filteredAllInvoices,mutate}) => {
    const navigation = useNavigation(); 
    const [refreshing, setRefreshing] = useState(false);
    const user = useSelector(state => state?.invoices?.user) 
    const dispatch = useDispatch();

    const handleNavigate = (item) => {
        if (item.type === 'productSelect') {
          navigation.navigate('ProductSelect', { item });  
        } else {
          navigation.navigate('Product', { item });  
        }
        
      };

      const onRefresh = useCallback(async () => {
        setRefreshing(true);
        dispatch(fetchProductSelect(user?.uid)) 
        dispatch(fetchProductItem(user?.uid))   
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
        <Pressable onPress={() => handleNavigate(item)} style={styles.containerFlex3}>
            <View style={styles.item}>
                <Text style={styles.num}>{index+1}</Text>
                <Image
                    style={styles.image}
                    source={{
                        uri: item?.ImageUri,
                    }}
                />
                <Text style={styles.text}>{item?.Description?.substring(0, 23)} - {item.SampleCode}</Text>
            </View>
        </Pressable>
    )}
/>
  );
}; 

export default React.memo(FlatListProduct);
  