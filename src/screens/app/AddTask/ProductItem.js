




import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, 
  Alert,
  Image,
  ImageBackground,
  Pressable,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
  View,
  Keyboard,  
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import { Dimensions } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from '../../../components/Button';  
import Input from '../../../components/Input'; 
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setToUpdate } from '../../../store/invoices';
import colors from '../../../constants/colors';
import Title from '../../../components/Title';
import { choosePhotoFromLibrary, requestPermissions, takePhotoFromCamera, uploadImage } from '../../../constants/categories';
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk';
import { fetchProductSelect } from '../../../store/redux-thunks/ProductSelectThunk';
import { fetchproductInvoice } from '../../../store/redux-thunks/ProductInvoiceThunk';
import { fetchInvoiceData } from '../../../store/redux-thunks/InvoiceDataThunk';

const ProductItem = ({ navigation }) => {
  const imagePath = "https://png.pngtree.com/png-clipart/20200225/original/pngtree-image-upload-icon-photo-upload-icon-png-image_5279796.jpg"
  const dispatch = useDispatch();
  const [productItems, setProductItems] = useState([{ ImageUri: imagePath, Description: '', SampleCode: "", UnitPrice: '',uploaded:false, uploading: false }]);
  const [loading, setLoading] = useState(false);
  const { width, height } = Dimensions.get('window');
  const invoice  = useSelector(state => state?.invoices?.data);   
  const [errorLoading, setErrorLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); 
  const [transferred, setTransferred] = useState(0);
  const invoiceCreated = useSelector(state => state.invoices.invoiceCreated);
  const user = useSelector(state => state?.invoices?.user)
  const invoices = useSelector(state => state?.invoices?.data)  

 
  
  useEffect(() => {
    dispatch(fetchInvoiceData(user?.uid));
    requestPermissions()
  },[])


  useEffect(() => {

    const updatedProductItems = productItems.map(item => {
      return { ...item };  
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

  // Function to add a new product item
  const addProductItem = () => {
    setProductItems([...productItems, { ImageUri: imagePath, Description: '', SampleCode: "", UnitPrice: '',uploaded:false, uploading: false }]);
  };



  const deleteProductItem = (index) => {
    const updatedProductItems = [...productItems];
    updatedProductItems.splice(index, 1);
    setProductItems(updatedProductItems);
  }; 




  const HandleUploadImage = async (index) => {
    uploadImage(index, productItems, user, setProductItems, handleProductItemChange, setTransferred,imagePath)
 } 



  
  // Function to submit all product items
  const onSubmit = async () => {

    let incompleteProductItemIndex = -1;
    productItems.forEach((item, index) => { 
      if (!item.Description|| !item.UnitPrice ||!item.SampleCode || !item.Description.trim() === "" ||!item.UnitPrice.trim() === "" || !item.SampleCode.trim() === "") {
        incompleteProductItemIndex = index;
      }
    }); 
  
    if (incompleteProductItemIndex !== -1) {
      Alert.alert('Please complete the form for adding product item ' + (incompleteProductItemIndex + 1));
      setErrorLoading(true);
      return;
    }
  
  
   // Check if any image is not uploaded
   const imageNotUploadedIndex = productItems.findIndex(item => !item.uploaded);
   if (imageNotUploadedIndex !== -1) {
     Alert.alert('Please select and upload an image for all product items');
     return;
   }
 

    setLoading(true);
    setErrorLoading(false);

    try {
      await Promise.all(productItems.map(async (item) => { 
        await firestore().collection('ProductItem').add({
          ...item,  
          completeDescription: `${item?.Description} - ${item?.SampleCode}`,
          invoiceDate: new Date(),  
          invoiceNo: invoice ? invoice?.invoiceNo :'' , 
          checked: false, 
          userId: user?.uid,    
        });
      }));
      Alert.alert('All product items saved successfully');
      setLoading(false);
      dispatch(setToUpdate());
      setProductItems([{ ImageUri: imagePath, Description: '', UnitPrice: '',uploaded:false, uploading: false }])
      dispatch(fetchProductItem(user?.uid)) 
      dispatch(fetchProductSelect(user?.uid))     
      dispatch(fetchproductInvoice(user?.uid))   
      dispatch(fetchInvoiceData(user?.uid))
      navigation.navigate('AllInvoices'); 

      Keyboard.dismiss();
    } catch (error) {
      console.log('Error when adding product items:', error.message);
      setLoading(false);
      setErrorLoading(true);
      Alert.alert('Error', 'Failed to save product items',error.message);
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
      <Title type="thin">Add a New Product</Title>

      <ScrollView  keyboardShouldPersistTaps="handled">
        {productItems.map((item, index) => (
          <View key={index}>
          <Text style={styles.label}>Product Item {index+1}</Text>
            <TouchableOpacity onPress={() => setModalVisible(index)}>
              <View style={styles.Photo}>
                <ImageBackground source={{ uri: item?.ImageUri }} style={styles.imageBackground}>
                  <Text style={styles.labelPhoto}>Select an image</Text>  
                </ImageBackground>
              </View> 
            </TouchableOpacity>

            <Modal animationType="fade" transparent={true} visible={modalVisible  === index} onRequestClose={() => { setModalVisible(false); }}>
              
            <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
              <View style={styles.modalContent}>  

              <View  onPress={() => setModalVisible(false)} >
                 <AntDesign size={20}  style={styles.closeBtn} color={colors.black} name="close" /> 
                 </View>   
 
                <View style={styles.alignIcon}>
                <TouchableOpacity onPress={() => takePhotoFromCamera(index,setProductItems,setModalVisible)} style={styles.buttonUpload}>
                    <SimpleLineIcons onPress={() => takePhotoFromCamera(index,setProductItems,setModalVisible)} size={60}  color={colors.black} name="camera" /> 
                    <Text onPress={() => takePhotoFromCamera(index,setProductItems,setModalVisible)} style={styles.textStyle}>Camera</Text>
                  </TouchableOpacity>  

                  <TouchableOpacity onPress={() => choosePhotoFromLibrary(index,setProductItems,setModalVisible)} style={styles.buttonUpload}>
                    <MaterialIcons onPress={() => choosePhotoFromLibrary(index,setProductItems,setModalVisible)} size={60}  color={colors.black} name="photo-library" /> 
                    <Text onPress={() => choosePhotoFromLibrary(index,setProductItems,setModalVisible)} style={styles.textStyle}>Library</Text>  
                  </TouchableOpacity>  
                </View> 
                
                </View>     
              </Pressable>

            </Modal> 

            <View style={styles.PhotoContainer}>
              {item.uploading ? (
                <View style={styles.status}>
                  <Text>{transferred} % completed</Text>
                  <ActivityIndicator size="large" color="#0000ff" /> 
                </View> 
              ) : (    
                <TouchableOpacity onPress={() => HandleUploadImage(index)} style={styles.takePhoto}>
          <Text style={styles.textPhoto}> Upload Image</Text>  
        </TouchableOpacity> 
              )}
            </View>

            <Text style={styles.label}>Sample Description</Text>
            <Input
              value={item.Description}
              onChangeText={(value) => handleProductItemChange(index, 'Description', value)}
              outlined
              placeholder="Enter Description"
              multiline={true}
              numberOfLines={1}  
            />
        
        <Text style={styles.label}>Sample Code</Text> 
        <Input
          value={item?.SampleCode}
          onChangeText={(value) => handleProductItemChange(index, 'SampleCode', value)} 
          outlined
          placeholder="EQEC507" 
        />
      

            <Text style={styles.label}>Unit Price</Text>
            <Input
              value={item.UnitPrice}
              onChangeText={(value) => handleProductItemChange(index, 'UnitPrice', value)}
              outlined
              placeholder="N500" 
              keyboardType="numeric"
            />
           
           {productItems.length > 1 && (
             <Button style={styles.button}  del="red" onPress={() => deleteProductItem(index)}>
             <Text>Delete</Text> 
           </Button>  
           )}

           <View style={{height: 37}}></View>

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


export default React.memo(ProductItem);
