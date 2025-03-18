import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, TouchableOpacity, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/EvilIcons';
import { useDispatch, useSelector } from 'react-redux';
import FlatListRefurbishInvoiceList from '../../../components/FlatList/FlatListRefurbishInvoiceList';
import Header from '../../../components/Header';
import SearchInput from '../../../components/SearchInput';
import colors from '../../../constants/colors';
import { fetchGeneratedRefurbishInvoice } from '../../../store/redux-thunks/RefurbishList';
import styles from '../AddTask/styles';

const GeneratedRefurbishInvoiceList = () => { 
    const dispatch = useDispatch();  
    const navigation = useNavigation(); 
    const isFocused = useIsFocused();
    
    const user = useSelector(state => state?.invoices?.user);
    const newProduct = useSelector(state => state?.invoices?.GeneratedRefurbishInvoiceList);  
    const loading = useSelector(state => state?.invoices?.GeneratedRefurbishInvoiceListLoading); 
    const [showInitialLoader, setShowInitialLoader] = useState(true);
    const [keyword, setKeyword] = useState("");   
    const searchInputRef = useRef(null);
  

        const focusSearchInput = () => {
            if (searchInputRef.current) {
                searchInputRef.current.focus(); 
            } 
        };

        useEffect(() => {
            if (isFocused) {
                dispatch(fetchGeneratedRefurbishInvoice(user.uid)).finally(() => {
                    setShowInitialLoader(false);
                });
            }
        }, [isFocused, dispatch, user.uid]);
    
        // Memoize the filtered invoices based on newProduct and keyword
        const filteredInvoices = useMemo(() => {
            if (keyword.length > 2) {
                return newProduct.filter(product =>
                    product.Attention.toLowerCase().includes(keyword.toLowerCase()) ||
                    product.Address.toLowerCase().includes(keyword.toLowerCase()) || 
                    product.invoiceNo.toLowerCase().includes(keyword.toLowerCase()) ||
                    product.CompanyName.toLowerCase().includes(keyword.toLowerCase())
                );
            }
            return newProduct; 
        }, [newProduct, keyword]); 

    return ( 
        <SafeAreaView style={styles.container2}>   
            <Header title="Refurbishment History" />

                                <View style={styles.passwordContainer}  >
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
                            placeholder="Search Invoices"
                            ref={searchInputRef}
                            focusSearchInput={focusSearchInput}
                        /> 
                        </View>

            {showInitialLoader && loading ? (
                    <ActivityIndicator size="large" color={colors.blue} style={{ transform: [{ scale: 0.75 }] }} />
                  ) : (
                    <FlatListRefurbishInvoiceList filteredAllInvoices={filteredInvoices} />
                  )}  
        </SafeAreaView>
    ); 
};

export default GeneratedRefurbishInvoiceList; 
