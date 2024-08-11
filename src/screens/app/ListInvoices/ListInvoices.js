import { View, Text, FlatList, SafeAreaView, Pressable, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk';
import FlatListProduct from '../../../components/FlatList/FlatListProduct';
import { fetchProductSelect } from '../../../store/redux-thunks/ProductSelectThunk';

const AllInvoices = () => { 
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector(state => state?.invoices?.user)
    const invoices = useSelector(state => state?.invoices?.data)
    const allProduct = useSelector(state => state?.invoices?.allProduct); 
    const productSelect = useSelector(state => state?.invoices?.productSelect)
    const filterProductSelect = productSelect?.filter(product => product?.invoiceNo === invoices?.invoiceNo)
    const finalProducts = allProduct?.slice().reverse();
    const arrangedProducts = finalProducts?.concat(filterProductSelect) 
    const isFocused = useIsFocused();   
    const [filteredAllInvoices, setFilteredAllInvoices] = useState(arrangedProducts);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);  

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

{loading ? (
          <ActivityIndicator /> 
        ) : (
            
            <FlatListProduct filteredAllInvoices={filteredAllInvoices} /> 
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

export default AllInvoices;
