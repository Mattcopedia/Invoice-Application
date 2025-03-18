

import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from 'react-native';

import UploadImage1 from '../../../components/UploadImage';

import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Title from '../../../components/Title';
import { uploadImageRefurb } from '../../../constants/categories';
import { AmountCalculatorRefurb } from '../../../constants/helperFunctions';
import { setCheckBoxSelectedItem, setToUpdate } from '../../../store/invoices';
import { fetchInvoiceData } from '../../../store/redux-thunks/InvoiceDataThunk';
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk';
import { fetchProductSelect } from '../../../store/redux-thunks/ProductSelectThunk';
import styles from './styles';

export const imagePath = "https://png.pngtree.com/png-clipart/20200225/original/pngtree-image-upload-icon-photo-upload-icon-png-image_5279796.jpg"
  

const RefurbishProduct = ({ navigation }) => { 
  const dispatch = useDispatch();
  const selectedItems = useSelector(state => state?.invoices?.checkBoxSelectedItems)
  
  const [productItems, setProductItems] = useState([ { ImageUri: imagePath, uploading: false, uploaded: false, products: [...selectedItems]} ])
  const product = [ { ImageUri: imagePath, uploading: false, uploaded: false, products: [...selectedItems]} ]
  const [loading, setLoading] = useState(false);  
  const invoice  = useSelector(state => state?.invoices?.invoiceLatest);     
  const [errorLoading, setErrorLoading] = useState(false); 
  const [image, setImage] = useState(imagePath)      
  const [modalVisible, setModalVisible] = useState(false); 
  const [transferred, setTransferred] = useState(0);
  const user = useSelector(state => state?.invoices?.user)   

   console.log(`productItemsM`,productItems)  
   console.log(`product`,product)

   useEffect(() => {
    setProductItems(prevState => 
    [{...prevState, products: [...selectedItems]}] 
    );
  }, [selectedItems])
  
 
  useEffect(() => {    
     dispatch(setCheckBoxSelectedItem(selectedItems))  
     dispatch(fetchInvoiceData(user?.uid));  
  }, [selectedItems]);
  

  useEffect(() => {
  AmountCalculatorRefurb(productItems,setProductItems)
  },[productItems]);   


  const handleBack = () => { 
    navigation.goBack();
  }; 

  const addProductItem = () => {
    setProductItems([
      ...productItems,
      { ImageUri: imagePath,uploading: false, uploaded: false, products: [...productItems[0].products] }
    ]);       
  };  


  const handleProductItemChange = (productIndex, field, value, batchIndex ) => {
    setProductItems(prevState => {
      return prevState.map((batch, i) => {
        if (i === batchIndex) {
          // Ensure a new copy of the products array
          const updatedProducts = batch.products.map((product, j) => 
            j === productIndex ? { ...product, [field]: value } : product
          );
          return { ...batch, products: updatedProducts };
        }
        return batch; 
      });
    });
  };
  

    const HandleUploadImage = async (index) => {
      uploadImageRefurb(index, productItems, user, setProductItems, handleProductItemChange, setTransferred,imagePath)
   }   
 

  const deleteProductItem = (index) => {
    const updatedProductItems = [...productItems];
    updatedProductItems.splice(index, 1); 
    setProductItems(updatedProductItems);   
  };   


  
  const onSubmit = async () => {
    let incompleteProductItemIndex = -1;
  
    // Check for missing product details
    productItems.forEach((batch, batchIndex) => {
      batch.products.forEach((item, index) => {
        if (!item.Description || !item.UnitPrice || item.Description.trim() === "" || item.UnitPrice.trim() === "") {
          incompleteProductItemIndex = `${batchIndex}-${index}`;
        }
      });
    });
  
    if (incompleteProductItemIndex !== -1) {
      Alert.alert(`Please complete the form for all product items (Batch: ${incompleteProductItemIndex})`);
      setErrorLoading(true);
      return;
    }
  
    // Check if all images are uploaded
    const imageNotUploadedIndex = productItems.findIndex(batch => !batch.ImageUri || !batch.uploaded);
    if (imageNotUploadedIndex !== -1) {
      Alert.alert('Please select and upload an image for all product items');
      return;
    }
  
    setLoading(true);
    setErrorLoading(false);
  
    try {

      const allProducts = productItems.flatMap(batch => 
        batch.products.map(product => ({
          ...product,
          ImageUri: batch.ImageUri,
          completeDescription: `${product.Description}`,   
          invoiceDate: invoice.invoiceDate,  
          checked: false,  
          Companyname:invoice?.Companyname,
          Address:invoice?.Address,
          invoiceNo:invoice?.invoiceNo,
          Attention: invoice?.Attention,
          invoiceType: invoice?.invoiceType,   
          uploaded:false, 
          uploading: false, 
          userId: user?.uid, 
        }))
      );

      console.log(`allProducts20`,allProducts)
      console.log(`invoiceNo20`,invoice?.invoiceNo) 

      await Promise.all(
          // Ensure the batch is not a duplicate
          allProducts.map(async (item) => {

            const querySnapshot = await firestore()
            .collection('RefurbishmentProduct')
            .where('invoiceNo', '==', invoice?.invoiceNo) 
            .where('ImageUri', '==', item.ImageUri) 
            .where('Description', '==', item?.Description)
            .where('UnitPrice', '==', item.UnitPrice) 
            .where('Quantity', '==', item.Quantity) 
            .get(); 
  
          if (!querySnapshot.empty) {
            console.log(`Skipping duplicate batch with image: ${item.ImageUri}-${invoice.invoiceNo}`);
            return;
          } 
          await firestore().collection('RefurbishmentProduct').add(item); 
          }) 
         
      ); 


      Alert.alert('All product items saved successfully');
      setLoading(false);
      dispatch(setToUpdate());
  
      if (invoice?.invoiceType === "TECHNICAL PROPOSAL") {
        navigation.navigate('RefurbishmentPdf');
      } else {
        navigation.navigate('RefurbishSummary'); 
      }
  
      dispatch(fetchProductItem(user?.uid));
      dispatch(fetchProductSelect(user?.uid));
      dispatch(fetchInvoiceData(user?.uid));
  
      Keyboard.dismiss();
    } catch (error) {
      console.log('Error when adding product items:', error.message);
      setLoading(false);
      setErrorLoading(true);
      Alert.alert('Error', 'Failed to save product items');
    }
  };
  
   
  return (
    <SafeAreaView style={styles.container} >
      <Pressable style={styles.backContainer} hitSlop={8} onPress={handleBack}>
        <Image
          style={styles.backIcon}
          source={require('../../../assets/back.png')}
        />
      </Pressable> 
      <Title type="thin">Add a New Product </Title>

      <ScrollView  keyboardShouldPersistTaps="handled" >
        
        {productItems.map((batch, index1) => (    
        <View key={index1}>
                <UploadImage1 setProductItems={setProductItems} setModalVisible ={setModalVisible} modalVisible ={modalVisible} index={index1} item={batch} transferred={transferred} HandleUploadImage={HandleUploadImage} />  
                  { batch.products?.map((item, index) => (   
                      <View key={index}>  
                      <Text style={styles.label2}>{item.label}</Text> 
             
                        <Text style={styles.label}>Sample Description</Text> 
                        <Input 
                          value={item.Description} 
                          onChangeText={(value) => handleProductItemChange(index, 'Description', value,index1)}
                          outlined
                          placeholder="Enter Description"
                          multiline={true}
                          numberOfLines={1}  
                        />
                    
            
                        <Text style={styles.label}>Unit Price</Text>
                        <Input
                          value={item.UnitPrice}
                          onChangeText={(value) => handleProductItemChange(index, 'UnitPrice', value,index1)}
                          outlined
                          placeholder="N500" 
                          keyboardType="numeric"
                        />
            
                <Text style={styles.label}>Quantity</Text>
                            <Input
                              value={item.Quantity}
                              onChangeText={(value) => handleProductItemChange(index, 'Quantity', value,index1)}
                              outlined
                              placeholder="1"
                              keyboardType="numeric" 
                            />
            
            
                          <View>
                              <Text style={styles.label}>Amount</Text>
                              <Text style={styles.labelAmount}>{item.Amount}</Text> 
                              </View>  
            
                              
                    <Text style={styles.label}>Warranty</Text>
                          <View style={styles.pickerBorder}>
                            <Picker 
                            selectedValue={item.Warranty}   style={styles.picker}   
                            onValueChange={(value) => handleProductItemChange(index, 'Warranty', value,index1)}>
                            <Picker.Item label="NO WARRANTY" value="NO WARRANTY" />
                            <Picker.Item label="3 MONTHS" value="3 MONTHS" />
                            <Picker.Item label="6 MONTHS" value="6 MONTHS" />
                            <Picker.Item label="12 MONTHS" value="12 MONTHS" />
                          </Picker>
                          </View>  
                          
            
                        <View style={{height: 37}}></View>  
            
                      </View>
                
                    ))} 

          {productItems.length > 1 && (
        <Button style={styles.button}  del="red" onPress={() => deleteProductItem(index1)}>
        <Text>Delete</Text> 
      </Button>  
      )}
 
          </View>
        ))}
         

         <Button style={styles.button} type="blue" onPress={addProductItem}>
            <Text>Add Product</Text> 
          </Button> 

   
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


};


export default React.memo (RefurbishProduct); 
