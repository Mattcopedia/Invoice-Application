import { View, Text, FlatList, SafeAreaView, Pressable, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import Header from '../../../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../AddTask/styles';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk';
import FlatListProduct from '../../../components/FlatList/FlatListProduct';
import colors from '../../../constants/colors'; 
import MaterialIcon from 'react-native-vector-icons/EvilIcons'; 
import SearchInput from '../../../components/SearchInput';


const AllInvoices = () => {  
      const dispatch = useDispatch(); 
      const navigation = useNavigation(); 
      const isFocused = useIsFocused();
      const user = useSelector(state => state?.invoices?.user);
      const newProduct = useSelector(state => state?.invoices?.allProduct);   
      const loading = useSelector(state => state?.invoices?.allProductLoading);   
      const [showInitialLoader, setShowInitialLoader] = useState(true);
      const searchInputRef = useRef(null); 
      const [keyword, setKeyword] = useState("");  
    
        useEffect(() => {
            if (isFocused && user?.uid) {
        dispatch(fetchProductItem(user.uid)).finally(() => {
            setShowInitialLoader(false); 
          });

            }
          }, [isFocused, user?.uid, dispatch]);

          const focusSearchInput = () => {
            if (searchInputRef.current) {
                searchInputRef.current.focus(); 
            }
        };

      // Use useMemo to filter invoices dynamically
      const filteredInvoices = useMemo(() => {
          if (keyword.length > 2) {
              return newProduct.filter(product =>
                  product.Description.toLowerCase().includes(keyword.toLowerCase()) 
              );
          }
          return newProduct;
      }, [newProduct, keyword]);
  
   
    return ( 
        <SafeAreaView style={styles.container2}>  
            <Header title="All Products" />

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
            
            <View style={{ flex: 1 }}> 
 

        {showInitialLoader && loading ? (
                    <ActivityIndicator size="large" color={colors.blue} style={{ transform: [{ scale: 0.75 }] }} />
                  ) : (
                    <FlatListProduct filteredAllInvoices={filteredInvoices} /> 
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
