

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
  PermissionsAndroid,
  Keyboard,  
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'; 
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import UploadImage1 from '../../../components/UploadImage';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from '../../../components/Button';  
import Input from '../../../components/Input'; 
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setCheckBoxSelectedItem, setToUpdate } from '../../../store/invoices';
import colors from '../../../constants/colors';
import Title from '../../../components/Title';
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk';
import { fetchProductSelect } from '../../../store/redux-thunks/ProductSelectThunk';
import { Picker } from '@react-native-picker/picker';
import { fetchInvoiceData } from '../../../store/redux-thunks/InvoiceDataThunk';
import { choosePhotoFromLibrary, takePhotoFromCamera } from '../../../constants/htmlContent';
import { choosePhotoFromLibrary2, takePhotoFromCamera2, uploadImage, uploadImageRefurb } from '../../../constants/categories';
import { AmountCalculator, handleProductItemChange } from '../../../constants/helperFunctions';
import { items } from './index';

export const imagePath = "https://png.pngtree.com/png-clipart/20200225/original/pngtree-image-upload-icon-photo-upload-icon-png-image_5279796.jpg"
  

const RefurbishProduct = ({ navigation }) => { 
  const dispatch = useDispatch();
  const selectedItems = useSelector(state => state?.invoices?.checkBoxSelectedItems)
  const [imageData, setImageData] = useState({ ImageUri: imagePath, uploading: false, uploaded: false });
  const product = [ { ImageUri: imagePath, uploading: false, uploaded: false }, [...selectedItems] ]
  console.log(`product`,product) 
  const [productItems, setProductItems] = useState([
    { ImageUri: imagePath, uploading: false, uploaded: false },
    [...selectedItems]
  ]);    
  const [loading, setLoading] = useState(false);  
  const invoice  = useSelector(state => state?.invoices?.invoiceLatest);     
  const [errorLoading, setErrorLoading] = useState(false); 
  const [image, setImage] = useState(imagePath)      
  const [modalVisible, setModalVisible] = useState(false); 
  const [transferred, setTransferred] = useState(0);
  const [uploading, setUploading] = useState(false)  
  const [uploaded,setUploaded] = useState(false)  
  const user = useSelector(state => state?.invoices?.user)   
  const invoices = useSelector(state => state?.invoices?.invoiceLatest)   

   console.log(`productItemsM`,productItems) 

   useEffect(() => {
    // Whenever selectedItems change, update the state correctly
    setProductItems(prevState => [
      { ...prevState[0] }, // Ensure the first item remains unchanged
      [...selectedItems]   // Make sure the second array is updated
    ]);
  }, [selectedItems]);
 
  useEffect(() => {    
     dispatch(setCheckBoxSelectedItem(selectedItems))  
     dispatch(fetchInvoiceData(user?.uid));  
  }, [selectedItems]);
 


  useEffect(() => {
  AmountCalculator(productItems,setProductItems)
  },[productItems]);   


  const handleBack = () => { 
    navigation.goBack();
  }; 

  const addProductItem = () => {
    setProductItems([...productItems,productItems])    
  };  

  const handleProductItemChange = (index, field, value,index1) => {
    const updatedProductItems = productItems[1].map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value }; 
      } 
      return item;
    });
    setProductItems([{...productItems[index1]}, updatedProductItems]);   
  }; 

    const HandleUploadImage = async (index) => {
      uploadImageRefurb(index, productItems[index][0], user, setProductItems, handleProductItemChange, setTransferred,imagePath)
   }   
 

  const deleteProductItem = (index) => {
    const updatedProductItems = [...productItems];
    updatedProductItems.splice(index, 1); 
    setProductItems(updatedProductItems);   
  };   


  
  // Function to submit all product items
  const onSubmit = async () => {

    let incompleteProductItemIndex = -1;
    productItems[1].forEach((item, index) => { 
      if (!item.Description  || !item.UnitPrice || !item.Description.trim() === "" ||
       !item.UnitPrice.trim() === ""  ) {
        incompleteProductItemIndex = index;
      } 
    }); 
  
    if (incompleteProductItemIndex !== -1) {
      Alert.alert('Please complete the form for adding all product items ' + (incompleteProductItemIndex + 1));
      setErrorLoading(true);
      return; 
    } 

    const imageNotUploadedIndex = productItems[0].findIndex(item => !item.uploaded);
       if (imageNotUploadedIndex !== -1) { 
         Alert.alert('Please select and upload an image for all product items');
         return;
       } 
     
  
    setLoading(true);
    setErrorLoading(false);   
 
    try { 
      await Promise.all(productItems[1].map(async (item) => { 
        const querySnapshot = await firestore()
        .collection('RefurbishmentProduct') 
        .where('Description', '==', item.Description)
        .where('label', '==', item.label)  
        .where('Amount', '==', item.Amount) 
        .where('invoiceNo', '==', invoice?.invoiceNo)
        .where('userId', '==', user?.uid)
        .get();
      
        if (!querySnapshot.empty) {
          console.log(`Skipping duplicate product: ${item.Description} - ${item.invoiceNo}`); 
          return; // Skip adding duplicate product   
        }

        await firestore().collection('RefurbishmentProduct').add({ 
          id: item?.id, 
          label: item?.label, 
          Description:item?.Description, 
          Quantity: item?.Quantity, 
          UnitPrice: item?.UnitPrice,
          Warranty:item?.Warranty,  
          ImageUri: item?.ImageUri,  
          Amount: item.Amount,   
          completeDescription: `${item.Description}`,   
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
        }); 
      })); 


      Alert.alert('All product items saved successfully');
      setLoading(false);
      dispatch(setToUpdate());
      dispatch(setCheckBoxSelectedItem([]))
      if(invoice?.invoiceType === "TECHNICAL PROPOSAL" ) {
        navigation.navigate('RefurbishmentPdf')   
      } else { 
        navigation.navigate('RefurbishSummary') 
      }  
      dispatch(fetchProductItem(user?.uid))  
      dispatch(fetchProductSelect(user?.uid))   
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
        
        {productItems.map((item, index1) => (    
        <View>
                <UploadImage1 setProductItems={setProductItems} setModalVisible ={setModalVisible} modalVisible ={modalVisible} index={index1} item={item} transferred={transferred} HandleUploadImage={HandleUploadImage} />  
                  {Array.isArray(item[1]) && item[1]?.map((item, index) => (   
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
