import { View, Text, FlatList, SafeAreaView, Pressable, Image, ActivityIndicator } from 'react-native';
import React, { useDeferredValue, useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk';
import FlatListProduct from '../../../components/FlatList/FlatListProduct';
import { fetchProductSelect } from '../../../store/redux-thunks/ProductSelectThunk';
import { fetchInvoiceData } from '../../../store/redux-thunks/InvoiceDataThunk';
import { fetcher } from '../../../store/redux-thunks/ListCode';
import useSWR from 'swr';

const AllInvoices = () => { 
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector(state => state?.invoices?.user)
    const { data, error, isLoading, mutate } = useSWR(user?.uid , () => fetcher(user?.uid ? user?.uid : null,'GeneratedInvoice'));

    const invoices = useSelector(state => state?.invoices?.invoiceLatest)
    const allProduct = useSelector(state => state?.invoices?.allProduct); 
    const arrangedProducts = allProduct
    const isFocused = useIsFocused();   
    const [filteredAllInvoices, setFilteredAllInvoices] = useState(arrangedProducts);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);  
    const deferredfilteredAllInvoices = useDeferredValue(filteredAllInvoices);

    useEffect(() => { 
        if (keyword.length > 2) {
            const filteredItems = arrangedProducts.filter(product => product.Description.toLowerCase().includes(keyword.toLowerCase()));
            setFilteredAllInvoices(filteredItems);
        } else if (keyword.length < 1) {
            setFilteredAllInvoices(arrangedProducts);
        }
    }, [keyword, allProduct]);  
 

    useEffect(() => {   
        setLoading(true) 
       dispatch(fetchProductItem(user?.uid))  
       dispatch(fetchProductSelect(user?.uid))  
       dispatch(fetchInvoiceData(user?.uid)) 
        setLoading(false)        
      }, [user, dispatch, isFocused]);   
  
   
    return ( 
        <SafeAreaView style={{ flex: 1 }}> 
            <Header title="All Products" />
            <Input
                value={keyword} 
                onChangeText={setKeyword}
                outlined
                placeholder="Search for Product" 
            /> 
            
            <View style={{ flex: 1 }}> 
 
{isLoading ? (
          <ActivityIndicator />  
        ) : (
             
            <FlatListProduct filteredAllInvoices={deferredfilteredAllInvoices} /> 
        )}
              <View>

              <Button style={styles.button} type="blue" onPress={() => navigation.navigate("ProductItem")}>
            <Text>Add Product</Text> 
          </Button>  
      
              </View>  
            </View>

        </SafeAreaView> 
    );
};

export default React.memo(AllInvoices);
