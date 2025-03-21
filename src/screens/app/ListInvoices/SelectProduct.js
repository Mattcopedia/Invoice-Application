import { View, Text, FlatList, SafeAreaView, Pressable, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { setfilteredSelectedItem } from '../../../store/invoices';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk';
import FlatListSelect from '../../../components/FlatList/FlatListSelect';
import { fetchProductSelect } from '../../../store/redux-thunks/ProductSelectThunk';
import SearchInput from '../../../components/SearchInput';
import MaterialIcon from 'react-native-vector-icons/EvilIcons';  
import colors from '../../../constants/colors';


const SelectProduct = () => { 
    const dispatch = useDispatch(); 
    const navigation = useNavigation();
    const user = useSelector(state => state?.invoices?.user);
    const invoices = useSelector(state => state?.invoices?.invoiceLatest)
    const allProduct = useSelector(state => state?.invoices?.allProduct); 
    const productSelect = useSelector(state => state?.invoices?.productSelect)
    const filterProductSelect = productSelect?.filter(product => product?.invoiceNo === invoices?.invoiceNo)
    const finalProducts = allProduct?.slice().reverse();
    const arrangedProducts = finalProducts?.concat(filterProductSelect) 
    const isFocused = useIsFocused();  
    const [filteredAllInvoices, setFilteredAllInvoices] = useState(arrangedProducts);
    const [keyword, setKeyword] = useState("");
    const searchInputRef = useRef(null);

    const handleBack = () => { 
        navigation.goBack(); 
    }; 

    useEffect(() => { 
        if (keyword.length > 2) {
            const filteredItems = arrangedProducts.filter(product => product.Description.toLowerCase().includes(keyword.toLowerCase()));
            setFilteredAllInvoices(filteredItems);
        } else {
            setFilteredAllInvoices(arrangedProducts);
        }
    }, [keyword, allProduct]);  

    const focusSearchInput = () => {
        if (searchInputRef.current) {
            searchInputRef.current.focus(); 
        }
    };

    useEffect(() => {   
        if (user && isFocused) { 
            dispatch(fetchProductItem(user?.uid)) 
            dispatch(fetchProductSelect(user?.uid))    
            setFilteredAllInvoices(arrangedProducts); 
        }       
    }, [user, isFocused, dispatch]); 



    const handleCheckboxChange = (index) => {
        const updatedProducts = [...filteredAllInvoices];
        updatedProducts[index].checked = !updatedProducts[index].checked; 
        setFilteredAllInvoices(updatedProducts);
    };
 
    const selectProductItem = () => {
        const selected = filteredAllInvoices.filter(product => product.checked);
        if (selected.length === 0) {
            Alert.alert('Please select a product');
            return; 
        }
        dispatch(setfilteredSelectedItem(selected)); 
        navigation.navigate('ProductSelected', { item3: selected });
    };
   
    return ( 
        <SafeAreaView style={{ flex: 1 }}> 
            <Pressable style={styles.backContainer} hitSlop={8} onPress={handleBack}>
                <Image
                    style={styles.backIcon}
                    source={require('../../../assets/back.png')}
                />
            </Pressable> 
            <Text style={styles.titleProduct}>Select a product</Text> 
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

            {(!arrangedProducts || arrangedProducts.length === 0) && (
                <Text style={styles.text2}>No products available</Text>
            )} 
            <View style={{ flex: 1 }}> 
                <FlatListSelect filteredAllInvoices={filteredAllInvoices}  handleCheckboxChange={handleCheckboxChange}
                /> 
            </View>
            <Button style={styles.button} type="blue" onPress={selectProductItem}>
                <Text>Select Product</Text> 
            </Button>  
        </SafeAreaView>
    );
};

export default React.memo(SelectProduct);
