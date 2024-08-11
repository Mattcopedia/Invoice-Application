import React from 'react';
import {Pressable, View,FlatList, Image,Text} from 'react-native';
import styles from './InvoiceStyles';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setInvoiceList } from '../../store/invoices';

const FlatListProduct = ({filteredAllInvoices}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const handleNavigateInvoice = (item) => { 
    navigation.navigate('GeneratedInvoice')
    dispatch(setInvoiceList(item));  
  }

  return (
    <FlatList
    showsVerticalScrollIndicator={true}
    data={filteredAllInvoices} 
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, index }) => (
        <Pressable onPress={() => handleNavigateInvoice(item)} style={styles.containerFlex}>
     <Text style={styles.num}>{index+1}</Text>
            <View style={styles.item}>
                <Text style={styles.text}>{item?.Attention}</Text>
                <Text style={styles.text}>{item?.invoiceType}</Text>
                <Text style={styles.text}>{item?.Address.substring(0, 80)}</Text>
                <Text style={styles.text}>{item?.invoiceNo}</Text>
            </View>
        </Pressable>
    )} 
/>
  );
}; 

export default React.memo(FlatListProduct);
 