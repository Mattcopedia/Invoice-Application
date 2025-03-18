import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, TouchableOpacity, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/EvilIcons';
import { useDispatch, useSelector } from 'react-redux';
import FlatListInvoiceList from '../../../components/FlatList/FlatListInvoiceList';
import Header from '../../../components/Header';
import SearchInput from '../../../components/SearchInput';
import colors from '../../../constants/colors';
import { fetchGeneratedInvoice } from '../../../store/redux-thunks/GeneratedInvoiceThunk';
import styles from '../AddTask/styles';
 
 
const GeneratedInvoiceList = () => { 
  const dispatch = useDispatch(); 
  const navigation = useNavigation(); 
  const isFocused = useIsFocused();
  
  const user = useSelector(state => state?.invoices?.user);
  const newProduct = useSelector(state => state?.invoices?.GeneratedInvoice);  
  const loading = useSelector(state => state?.invoices?.GeneratedInvoiceLoading); 
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const searchInputRef = useRef(null);  
  const [keyword, setKeyword] = useState("");  

    useEffect(() => {
      if (isFocused && user?.uid) {
        dispatch(fetchGeneratedInvoice(user.uid)).finally(() => {
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
          <Header title=" History" /> 

          <View style={styles.passwordContainer}  onPress={focusSearchInput}  >
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
                    <FlatListInvoiceList filteredAllInvoices={filteredInvoices} />
                  )}  

      </SafeAreaView> 
  );
};

export default GeneratedInvoiceList; 


