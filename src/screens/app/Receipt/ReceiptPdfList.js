
import { View, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../../../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import FlatListReceiptPdfList from '../../../components/FlatList/FlatListReceiptPdfList';
import { fetchReceipt } from '../../../store/redux-thunks/ReceiptThunk'; 
import SearchInput from '../../../components/SearchInput';
import MaterialIcon from 'react-native-vector-icons/EvilIcons'; 
import colors from '../../../constants/colors';


const ReceiptPdfList = () => {  
const dispatch = useDispatch();  
const navigation = useNavigation(); 
const isFocused = useIsFocused();
const user = useSelector(state => state?.invoices?.user);
const newProduct = useSelector(state => state?.invoices?.receiptStore);  
const loading = useSelector(state => state?.invoices?.receiptStoreLoading);  
const [showInitialLoader, setShowInitialLoader] = useState(true);
const [keyword, setKeyword] = useState("");   
const searchInputRef = useRef(null);


 useEffect(() => {
      if (isFocused && user?.uid) {
        dispatch(fetchReceipt(user.uid)).finally(() => {
            setShowInitialLoader(false);
          });
      }
    }, [isFocused, user?.uid]); 

            const focusSearchInput = () => {
                if (searchInputRef.current) {
                    searchInputRef.current.focus(); 
                }
            };

        // Use useMemo to filter invoices dynamically
        const filteredInvoices = useMemo(() => {
            if (keyword.length > 2) {
                return newProduct.filter(product =>
                    product.Description.toLowerCase().includes(keyword.toLowerCase()) ||
                    product.phoneNumber.toLowerCase().includes(keyword.toLowerCase()) || 
                    product.invoiceNo.toLowerCase().includes(keyword.toLowerCase())  ||
                    product.CompanyName.toLowerCase().includes(keyword.toLowerCase())
                );
            }
            return newProduct; 
        }, [newProduct, keyword]); 
            
    return ( 
        <SafeAreaView style={{ flex: 1 }}> 
            <Header title="Receipt History" />
            <View style={styles.passwordContainer}>
                            <TouchableOpacity style={styles.eyeIcon} onPress={focusSearchInput} > 
                            <MaterialIcon
                                name={`search`} 
                                size={35}
                                color={colors.black}
                            /> 
                            </TouchableOpacity>
                    
                            <SearchInput 
                            value={keyword} 
                            onChangeText={setKeyword} 
                            placeholder="Search Receipts"
                            ref={searchInputRef}
                            focusSearchInput={focusSearchInput}
                        /> 
                        </View> 

        {showInitialLoader && loading ? (
                            <ActivityIndicator size="large" color={colors.blue} style={{ transform: [{ scale: 0.75 }] }} />
                        ) : (
                            <FlatListReceiptPdfList filteredAllInvoices={filteredInvoices} />
                        )}   

        </SafeAreaView>
    ); 
};

export default ReceiptPdfList; 


