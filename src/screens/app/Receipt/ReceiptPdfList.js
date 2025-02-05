
import { View, Text, FlatList, SafeAreaView, Pressable, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Input from '../../../components/Input';
import FlatListReceiptPdfList from '../../../components/FlatList/FlatListReceiptPdfList';
import { fetchReceipt } from '../../../store/redux-thunks/ReceiptThunk'; 

const ReceiptPdfList = () => {  
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector(state => state?.invoices?.user) 
    const allProduct = useSelector(state => state?.invoices?.receiptStore); 
    const isFocused = useIsFocused();  
    const [filteredAllInvoices, setFilteredAllInvoices] = useState(allProduct);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false) 

    console.log(`allProduct`,allProduct)
 
 
    useEffect(() => { 
        if (keyword.length > 2) {
            const filteredItems = allProduct.filter(product => 
                product.Description.toLowerCase().includes(keyword.toLowerCase()) ||
                product.phoneNumber.toLowerCase().includes(keyword.toLowerCase()) || 
                product.invoiceNo.toLowerCase().includes(keyword.toLowerCase())  ||
                product.CompanyName.toLowerCase().includes(keyword.toLowerCase())
            );
            setFilteredAllInvoices(filteredItems);
        } else if (keyword.length < 1) {
            setFilteredAllInvoices(allProduct);
        } 
    }, [keyword, allProduct]);   

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
           dispatch(fetchReceipt(user?.uid))
          } catch (error) {
            console.error('Error fetching receipts:', error); 
          } finally {
            setLoading(false); // Stop loading after fetch completes
          } 
        };
    
        fetchData();
      }, [user, dispatch, isFocused]);


  console.log(`allProduct`,allProduct)
    
    return ( 
        <SafeAreaView style={{ flex: 1 }}> 
            <Header title="Receipt History" />
            <Input
                value={keyword} 
                onChangeText={setKeyword}
                outlined 
                placeholder="Search Receipt" 
            /> 


                    {loading ? (
                             <ActivityIndicator /> 
                            ) : (  
                                    <FlatListReceiptPdfList filteredAllInvoices={filteredAllInvoices} />
                             )}  

        </SafeAreaView>
    ); 
};

export default ReceiptPdfList; 
