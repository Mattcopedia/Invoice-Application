import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  Keyboard,  
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectField, setToUpdate } from '../../../store/invoices';
import Title from '../../../components/Title';
import { useNavigation } from '@react-navigation/native';
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk';
import { fetchProductSelect } from '../../../store/redux-thunks/ProductSelectThunk';
import { fetchInvoiceData } from '../../../store/redux-thunks/InvoiceDataThunk';
import SelectedProducts from '../../../components/SelectedProducts';
import { fetchselectedItem } from '../../../store/redux-thunks/selectedItemThunk';

const ProductSelected = ({ route }) => {
    const navigation = useNavigation()
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const invoice  = useSelector(state => state?.invoices?.invoiceLatest);  
  const [errorLoading, setErrorLoading] = useState(false); 
  const user = useSelector(state => state?.invoices?.user)
  const invoices  = useSelector(state => state?.invoices?.invoiceLatest); 
  const filteredSelectedItem = useSelector(state => state?.invoices?.filteredSelectedItem); 


  const [productItems, setProductItems] = useState(
    filteredSelectedItem.map(item => ({ImageUri: item?.ImageUri, completeDescription: item?.completeDescription, Description: item?.Description,SampleCode: item?.SampleCode, Quantity: "1", UnitPrice:item?.UnitPrice, Amount: '', checked:item.checked,
        invoiceDate: item.invoiceDate, invoiceNo:invoices?.invoiceNo  })) 
  );  
  


  useEffect(() => {
    setProductItems(
      filteredSelectedItem.map(item => ({
        ImageUri: item.ImageUri,
        Description: item.Description,
        Quantity: '', 
        UnitPrice:  '',
        Amount: '',
        invoiceDate: item.invoiceDate,
      }))
    );
    dispatch(fetchInvoiceData(user?.uid))
  }, [filteredSelectedItem]);


  useEffect(() => {

    const calculateAmount = (Quantity, UnitPrice) => {
      return Quantity * UnitPrice;
    };

    const updatedProductItems = productItems.map(item => {
      const Amount = calculateAmount(item.Quantity, item.UnitPrice);
      return { ...item, Amount };
    });

    setProductItems(prevProductItems => {
      if (JSON.stringify(prevProductItems) !== JSON.stringify(updatedProductItems)) {
        return updatedProductItems;
      }
      return prevProductItems;
    });
  },[productItems]); 


   // Function to handle changes in product item fields 
   const handleProductItemChange = (index, field, value) => {
    const updatedProductItems = productItems.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });  
    setProductItems(updatedProductItems);
  }; 

  const handleBack = () => {
    navigation.goBack();
  }; 



  const onSubmit = async () => {

    let incompleteProductItemIndex = -1;
    productItems.forEach((item, index) => { 
      if (!item.Quantity ||!item.UnitPrice || !item.Quantity.trim() === "" ||!item.UnitPrice.trim() === "") {
        incompleteProductItemIndex = index;
      }
    });
  
    if (incompleteProductItemIndex !== -1) {
      Alert.alert('Please complete the form for adding product item ' + (incompleteProductItemIndex + 1));
      setErrorLoading(true);
      return;
    }
  
    setLoading(true);
    setErrorLoading(false);

    try {
      setLoading(false);
      dispatch(setSelectField(productItems)) 
      dispatch(fetchProductItem(user?.uid))   
      dispatch(fetchProductSelect(user?.uid))   
      dispatch(fetchInvoiceData(user?.uid)) 
      dispatch(fetchselectedItem(user?.uid)) 
      navigation.navigate("AddProduct") 
      Keyboard.dismiss();
    } catch (error) { 
      console.log('Error when selecting product items:', error.message);
      setLoading(false);
      setErrorLoading(true);
      Alert.alert('Error', 'Failed to save product items');
    }


  };

  
  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backContainer} hitSlop={8} onPress={handleBack}>
        <Image
          style={styles.backIcon}
          source={require('../../../assets/back.png')}
        /> 
      </Pressable> 
      <Title type="thin">Selected Products</Title> 
             <SelectedProducts color={true} productItems={productItems} onSubmit={onSubmit} handleProductItemChange={handleProductItemChange} loading={loading} /> 
    </SafeAreaView>
  );
} 






export default React.memo(ProductSelected);
