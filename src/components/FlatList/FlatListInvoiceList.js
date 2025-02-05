import React, { useCallback, useState } from 'react';
import {Pressable, View,FlatList, Image,Text, RefreshControl} from 'react-native';
import styles from './InvoiceStyles';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setInvoiceList } from '../../store/invoices';
import { fetchGeneratedInvoice } from '../../store/redux-thunks/GeneratedInvoiceThunk';

const FlatListProduct = ({filteredAllInvoices}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const user = useSelector(state => state?.invoices?.user) 
  const [refreshing, setRefreshing] = useState(false);

  const handleNavigateInvoice = (item) => { 
    navigation.navigate('GeneratedInvoice')
    dispatch(setInvoiceList(item));    
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
      dispatch(fetchGeneratedInvoice(user?.uid)) 
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
        <Pressable onPress={() => handleNavigateInvoice(item)} style={styles.containerFlex}>
     <Text style={styles.num}>{index+1}</Text> 
            <View style={styles.item}>
                <Text style={styles.text}>{item?.invoiceType}</Text> 
            {item?.CompanyName && (
                 <Text style={styles.text}>{item?.CompanyName}</Text>
            )}  
                <Text style={styles.text}>{item?.Attention}</Text>
                <Text style={styles.text}>{item?.Address?.substring(0, 80)}</Text> 
                <Text style={styles.text}>{item?.invoiceNo?.slice(0,6)}</Text>    
            </View>
        </Pressable>
    )} 

    ListHeaderComponent={ 
      <>
                  {!filteredAllInvoices || filteredAllInvoices.length === 0 && (
                          <Text style={styles.text2}>Create an Invoice</Text> 
                      )}  
      </>
    }
     
/>
  );
}; 

export default React.memo(FlatListProduct);
 