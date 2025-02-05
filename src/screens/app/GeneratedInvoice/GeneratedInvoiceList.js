import { View, Text, FlatList, SafeAreaView, Pressable, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Input from '../../../components/Input';
import { fetchGeneratedInvoice } from '../../../store/redux-thunks/GeneratedInvoiceThunk';
import FlatListInvoiceList from '../../../components/FlatList/FlatListInvoiceList';
import { fetchInvoiceList } from '../../../store/redux-thunks/ListCode';
import useSWR from 'swr';
 
const GeneratedInvoiceList = () => { 
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector(state => state?.invoices?.user)
    const { data, error, isLoading, mutate } = useSWR(user?.uid , () => fetchInvoiceList(user?.uid ? user?.uid : null,'GeneratedInvoice'));
    const newProduct = useSelector(state => state?.invoices?.GeneratedInvoice);  
    const arrangedProducts = newProduct
    const isFocused = useIsFocused();      
    const [filteredAllInvoices, setFilteredAllInvoices] = useState(arrangedProducts);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);   
 

    useEffect(() => {  
        dispatch(fetchGeneratedInvoice(user?.uid))
        if (keyword.length > 2) {
            const filteredItems = arrangedProducts.filter(product => 
                product.Attention.toLowerCase().includes(keyword.toLowerCase()) ||
                product.Address.toLowerCase().includes(keyword.toLowerCase()) || 
                product.invoiceNo.toLowerCase().includes(keyword.toLowerCase()) ||
                product.CompanyName.toLowerCase().includes(keyword.toLowerCase())
            );
            setFilteredAllInvoices(filteredItems);
        } else if (keyword.length < 1) { 
            setFilteredAllInvoices(arrangedProducts);
        } 
    }, [keyword, newProduct]);   


      useEffect(() => {  
        const fetchData = async () => {
          setLoading(true); 
          try { 
            dispatch(fetchGeneratedInvoice(user?.uid))  
          } catch (error) {
            console.error('Error fetching receipts:', error);  
          } finally {
            setLoading(false);    
          }
        };
        if(isFocused) {
          fetchData(); 
        }
      }, [user, isFocused]); 
      
  
    
    return ( 
        <SafeAreaView style={{ flex: 1 }}> 
         
            <Header title="History" />
            <Input
                value={keyword}  
                onChangeText={setKeyword}
                outlined
                placeholder="Search Invoices"
            /> 
 
                  {loading ? (
                            <ActivityIndicator /> 
                          ) : (  
                            <FlatListInvoiceList mutate={mutate} filteredAllInvoices={filteredAllInvoices} />
                          )}
   
        </SafeAreaView>
    );
};

export default GeneratedInvoiceList; 
