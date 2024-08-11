

import moment from 'moment'; 
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, 
  Alert,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
  View,
  BackHandler,  
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Button from '../../../components/Button';  
import Input from '../../../components/Input';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setToUpdate } from '../../../store/invoices';
import colors from '../../../constants/colors';
import Title from '../../../components/Title';
import InvoiceText from '../../../components/invoiceText/invoiceText';
import { useNavigation } from '@react-navigation/native';
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk';
import { fetchProductSelect } from '../../../store/redux-thunks/ProductSelectThunk';

const ProductSelected = ({ route }) => {
    const navigation = useNavigation()
  const dispatch = useDispatch();
  const filteredSelectedItem = useSelector(state => state?.invoices?.filteredSelectedItem); 
  console.log("filteredSelectedItem",filteredSelectedItem)

  const [productItems, setProductItems] = useState(
    filteredSelectedItem.map(item => ({ImageUri: item?.ImageUri, completeDescription: item?.completeDescription, Description: item?.Description,SampleCode: item?.SampleCode, Quantity: "1", UnitPrice:item?.UnitPrice, Amount: '', checked:item.checked,
        invoiceDate: item.invoiceDate,}))
  ); 

   console.log("productItems",productItems) 
  const [loading, setLoading] = useState(false);
  const invoice  = useSelector(state => state?.invoices?.data);  
  const [errorLoading, setErrorLoading] = useState(false); 
  const user = useSelector(state => state?.invoices?.user)
  const invoices  = useSelector(state => state?.invoices?.data);  


  useEffect(() => {
    setProductItems(
      filteredSelectedItem.map(item => ({
        ImageUri: item.ImageUri,
        Description: item.Description,
        Quantity: '',
        UnitPrice:  '',
        Amount: '',
        checked: item.checked,
        invoiceDate: item.invoiceDate,
      }))
    );
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
      await Promise.all(productItems.map(async (item) => { 
        await firestore().collection('SelectedItem').add({
            Description:item?.Description,
            completeDescription: item?.completeDescription,
            SampleCode: item?.SampleCode, 
            ImageUri:item?.ImageUri,
            Amount:item?.Amount,  
            Quantity:item?.Quantity, 
            UnitPrice:item?.UnitPrice, 
            checked:item?.checked,
            invoiceDate: item?.invoiceDate,
            invoiceNo: invoices.invoiceNo, 
            userId: user?.uid,    
        }); 
      }));
      Alert.alert('All product items selected successfully');
      setLoading(false);
      dispatch(setToUpdate());
      setProductItems([{ Quantity: '', UnitPrice: '', Amount: '',SampleCode: "" }])
      dispatch(fetchProductItem(user?.uid))  
      dispatch(fetchProductSelect(user?.uid))   
      if(invoices.invoiceType === "TECHNICAL PROPOSAL") {
        navigation.navigate('ExportPdf') 
      } else {
        navigation.navigate('Summary')
      } 
   
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

      <ScrollView>
        {productItems.map((item, index) => (
          <View key={index}>
          <Text style={styles.label}>Product Item {index+1}</Text>
            <TouchableOpacity>
                {item?.ImageUri && (
                 <View style={styles.Photo}>
                 <ImageBackground source={{ uri: item.ImageUri }} style={styles.imageBackground}>
                 </ImageBackground>
               </View> 
                )} 
            </TouchableOpacity>

            <Text style={styles.invoiceText}>Description</Text>
                    <InvoiceText>
                    {item?.completeDescription}
                    </InvoiceText> 

            <Text style={styles.label}>Quantity</Text>
            <Input
              value={item.Quantity}
              onChangeText={(value) => handleProductItemChange(index, 'Quantity', value)}
              outlined
              placeholder="2"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Unit Price</Text>
            <Input
              value={item.UnitPrice}
              onChangeText={(value) => handleProductItemChange(index, 'UnitPrice', value)}
              outlined
              placeholder="N500" 
              keyboardType="numeric"
            />

            <Text style={styles.label}>Amount</Text>
            <Text style={styles.labelAmount}>{item?.Amount}</Text> 
        

           <View style={{height: 37}}></View>

          </View>
        ))}
 
          
        {loading ? (
          <ActivityIndicator /> 
        ) : (
          <Button style={styles.button} type="blue" onPress={onSubmit}>
            <Text>Done</Text> 
          </Button>
        )}  
      </ScrollView>
    </SafeAreaView>
  );
}






export default React.memo(ProductSelected);
