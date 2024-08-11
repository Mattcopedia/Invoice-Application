import { View, Text, FlatList, SafeAreaView, Pressable, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { setGeneratedInvoice, setInvoiceList, setToUpdate } from '../../../store/invoices';
import Input from '../../../components/Input';
import { fetchGeneratedInvoice } from '../../../store/redux-thunks/GeneratedInvoiceThunk';
import FlatListInvoiceList from '../../../components/FlatList/FlatListInvoiceList';
 
const GeneratedInvoiceList = () => { 
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector(state => state?.invoices?.user)
    const allProduct = useSelector(state => state?.invoices?.GeneratedInvoice);
    const arrangedProducts = allProduct?.slice().reverse();
    const isFocused = useIsFocused();  
    const [filteredAllInvoices, setFilteredAllInvoices] = useState(arrangedProducts);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false); 

 
    useEffect(() => {
        if (keyword.length > 2) {
            const filteredItems = arrangedProducts.filter(product => 
                product.Attention.toLowerCase().includes(keyword.toLowerCase()) ||
                product.Address.toLowerCase().includes(keyword.toLowerCase()) || 
                product.invoiceNo.toLowerCase().includes(keyword.toLowerCase())
            );
            setFilteredAllInvoices(filteredItems);
        } else if (keyword.length < 1) {
            setFilteredAllInvoices(arrangedProducts);
        } 
    }, [keyword, allProduct]);   

    useEffect(() => {   
         setLoading(true)
         dispatch(fetchGeneratedInvoice(user?.uid))  
            setLoading(false)    
      }, [user, dispatch, isFocused]); 

  
    
    return ( 
        <SafeAreaView style={{ flex: 1 }}> 
            <Header title="History" />
            <Input
                value={keyword} 
                onChangeText={setKeyword}
                outlined
                placeholder="Search Invoices"
            /> 
               {(allProduct?.length === 0 || !allProduct) && (
                <Text style={styles.text2}>Create an Invoice</Text>
            )} 

            {loading ? (
                    <ActivityIndicator /> 
                    ) : (
                  
            <View style={{ flex: 1 }}> 
        <FlatListInvoiceList filteredAllInvoices={filteredAllInvoices} />
        </View> 
                    )}

        </SafeAreaView>
    );
};

export default GeneratedInvoiceList; 
