

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
import { choosePhotoFromLibrary2, takePhotoFromCamera2, uploadImage } from '../../../constants/categories';
import { AmountCalculator, handleProductItemChange } from '../../../constants/helperFunctions';
import { items } from './index';

const RefurbishProduct = ({ navigation }) => { 
  const imagePath = "https://png.pngtree.com/png-clipart/20200225/original/pngtree-image-upload-icon-photo-upload-icon-png-image_5279796.jpg"
    const [productItems2, setProductItems2] = useState([]); 
  const dispatch = useDispatch();
  const selectedItems = useSelector(state => state?.invoices?.checkBoxSelectedItems)
  const [productItems, setProductItems] = useState(selectedItems);
  const [loading, setLoading] = useState(false);
  const invoice  = useSelector(state => state?.invoices?.invoiceLatest);   
  const [uploading, setUploading] = useState(false) 
  const [errorLoading, setErrorLoading] = useState(false);
  const [image, setImage] = useState(imagePath)      
  const [modalVisible, setModalVisible] = useState(false); 
  const [transferred, setTransferred] = useState(0);
  const [transferred2, setTransferred2] = useState(0);
  const [uploaded,setUploaded] = useState(false)  
  const user = useSelector(state => state?.invoices?.user)   
  const invoices = useSelector(state => state?.invoices?.invoiceLatest)   

 
  useEffect(() => { 
     dispatch(setCheckBoxSelectedItem(selectedItems))  
     dispatch(fetchInvoiceData(user?.uid));  
  }, [selectedItems]);



  useEffect(() => {
  AmountCalculator(productItems,setProductItems)
  AmountCalculator(productItems2,setProductItems2) 
  },[productItems,productItems2]);   

  console.log(`productItems`,productItems)
  console.log(`productItems2`,productItems2)
  console.log(`invoice?.invoiceNo`,invoice?.invoiceNo) 

  const handleBack = () => { 
    navigation.goBack();
  }; 

  const addProductItem = () => {
  
    setProductItems2(selectedItems); 
  }; 

  console.log(selectedItems,selectedItems)


  const deleteProductItem = (index) => {
    const updatedProductItems = [...productItems2];
    updatedProductItems.splice(index, 1); 
    setProductItems2(updatedProductItems);   
  };   


 const handleProductItemChange2 = (index, field, value) => { 
    const updatedProductItems = productItems2.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setProductItems2(updatedProductItems); 
  };  
  
 
   const HandleUploadImage = async (index) => {
    console.log(`index`,productItems2[index]) 
      uploadImage(index, productItems2, user, setProductItems2, handleProductItemChange2, setTransferred2,imagePath)
   }  
   
  
  const UploadImage = async () => {
    if(image === imagePath) {  
      Alert.alert( "Please select an image")   
      return;  
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
    
    //Add timestamp so that every Image will be unique for every occurence of image upload.
    const extension = filename.split(".").pop();
    const name = filename.split(".").slice(0,-1).join("."); 
    filename = name + Date.now() + "." + extension //by adding timestamp to it, we make every data unique
 
    setUploading(true);
    setTransferred(0)
    const directory = user?.uid;   
    const task = storage().ref(`${directory}/images/${filename}`).putFile(uploadUri) 
     
    //Set Transferred State 
      task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
        setTransferred(Math.round(taskSnapshot.bytesTransferred/taskSnapshot.totalBytes) * 100)   
      });

    try {
      await task;
      setUploading(false);
      Alert.alert(
        "Image Uploaded",
        "Image Uploaded to the Cloud Successfully") 
    } catch(e) {
      console.log(e);
    }
     setImage(uploadUri);   
     setUploaded(true)   
  }



  
  // Function to submit all product items
  const onSubmit = async () => {

    let incompleteProductItemIndex = -1;
    productItems.forEach((item, index) => { 
      if (!item.Description  || !item.UnitPrice || !item.Description.trim() === "" ||
       !item.UnitPrice.trim() === ""  ) {
        incompleteProductItemIndex = index;
      } 
    }); 
  
    if (incompleteProductItemIndex !== -1) {
      Alert.alert('Please complete the form for adding product item ' + (incompleteProductItemIndex + 1));
      setErrorLoading(true);
      return; 
    } 
  
    if (!uploaded) {
      Alert.alert('Please select and upload an image ');
      return;
    } 
  
    setLoading(true);
    setErrorLoading(false);

    const realProductItems2 = productItems2.map(item => ({
      ...item,
      UpdateImage: true, 
      }))
 

    const allProductItems = [...productItems,...realProductItems2]    
 
    try { 
      await Promise.all(allProductItems.map(async (item) => { 
        await firestore().collection('RefurbishmentProduct').add({
           ...item,  
          ImageUri: item?.UpdateImage ? item?.ImageUri : image, 
          Amount: item?.Amount,  
          completeDescription: `${item?.Description}`, 
          invoiceDate: invoice.invoiceDate,  
          checked: false,  
          Companyname:invoice?.Companyname,
          Address:invoice?.Address,
          invoiceNo:invoice?.invoiceNo,
          Attention: invoice?.Attention,
          invoiceType: invoice?.invoiceType,   
          userId: user?.uid,     
        }); 
      })); 


      Alert.alert('All product items saved successfully');
      setLoading(false);
      dispatch(setToUpdate());
      dispatch(setCheckBoxSelectedItem([]))
      // setProductItems([{ id: '1', label: 'Mat/Velvet Fabric', ImageUri: imagePath, Description: '', Quantity: 1, UnitPrice: '', Amount: '',uploaded:false,  }])
      navigation.navigate('RefurbishSummary');    
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

      <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.PhotoView}>
            <ImageBackground source={{ uri: image }} style={styles.imageBackground}>
            <Text style={styles.labelPhoto}>Select an image</Text>  
            </ImageBackground>
            </View> 
        </TouchableOpacity>
  
        <Modal animationType="fade" transparent={true} visible={modalVisible } onRequestClose={() => { setModalVisible(false); }}>
               
        <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
              <View style={styles.modalContent}>  

              <View  onPress={() => setModalVisible(false)} >
                 <AntDesign size={20}  style={styles.closeBtn} color={colors.black} name="close" /> 
                 </View>   
 
                <View style={styles.alignIcon}>
                <Pressable onPress={() => takePhotoFromCamera(setImage,setModalVisible,setUploaded)} style={styles.buttonUpload}>
                    <SimpleLineIcons onPress={() => takePhotoFromCamera(setImage,setModalVisible,setUploaded)} size={60}  color={colors.black} name="camera" /> 
                    <Text onPress={() => takePhotoFromCamera(setImage,setModalVisible,setUploaded)} style={styles.textStyle}>Camera</Text>
                  </Pressable>

                  <Pressable onPress={() => choosePhotoFromLibrary(setImage,setModalVisible,setUploaded)} style={styles.buttonUpload}>
                    <MaterialIcons onPress={() => choosePhotoFromLibrary(setImage,setModalVisible,setUploaded)} size={60}  color={colors.black} name="photo-library" /> 
                    <Text onPress={() => choosePhotoFromLibrary(setImage,setModalVisible,setUploaded)} style={styles.textStyle}>Library</Text>  
                  </Pressable>  
                </View> 
                
                </View>     
              </Pressable>
  
              </Modal> 
  
         <View style={styles.statusView}></View>
       {uploading ? (
        <View style={styles.status}>
          <Text>{transferred} % completed</Text>
          <ActivityIndicator size="large" color="#0000ff" /> 
        </View>
      ) : (    
       <View style={styles.PhotoContainerView}>
       <TouchableOpacity onPress={UploadImage} style={styles.takePhoto}>
        <Text style={styles.textPhoto}> Upload Image</Text>  
       </TouchableOpacity>      
       </View>  
      )} 


        {productItems.map((item, index) => ( 
          <View key={index}>
          <Text style={styles.label2}>{item.label}</Text> 

            <Text style={styles.label}>Sample Description</Text>
            <Input
              value={item?.Description}
              onChangeText={(value) => handleProductItemChange(index, 'Description', value,productItems,setProductItems)}
              outlined
              placeholder="Enter Description"
              multiline={true}
              numberOfLines={1}  
            />
        

            <Text style={styles.label}>Unit Price</Text>
            <Input
              value={item?.UnitPrice}
              onChangeText={(value) => handleProductItemChange(index, 'UnitPrice', value,productItems,setProductItems)}
              outlined
              placeholder="N500" 
              keyboardType="numeric"
            />

    <Text style={styles.label}>Quantity</Text>
                <Input
                  value={item?.Quantity}
                  onChangeText={(value) => handleProductItemChange(index, 'Quantity', value,productItems,setProductItems)}
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
                selectedValue={item?.Warranty}   style={styles.picker}   
                onValueChange={(value) => handleProductItemChange(index, 'Warranty', value,productItems,setProductItems)}>
                <Picker.Item label="NO WARRANTY" value="NO WARRANTY" />
                <Picker.Item label="3 MONTHS" value="3 MONTHS" />
                <Picker.Item label="6 MONTHS" value="6 MONTHS" />
                <Picker.Item label="12 MONTHS" value="12 MONTHS" />
              </Picker>
              </View>  
             

           <View style={{height: 37}}></View> 

          </View>
        ))}
         










 



         { productItems2.map((item, index) => (  
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
        <TouchableOpacity onPress={() => takePhotoFromCamera2(index,setProductItems2,setModalVisible)} style={styles.buttonUpload}>
            <SimpleLineIcons onPress={() => takePhotoFromCamera2(index,setProductItems2,setModalVisible)} size={60}  color={colors.black} name="camera" /> 
            <Text onPress={() => takePhotoFromCamera2(index,setProductItems2,setModalVisible)} style={styles.textStyle}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => choosePhotoFromLibrary2(index,setProductItems2,setModalVisible)} style={styles.buttonUpload}>
            <MaterialIcons onPress={() => choosePhotoFromLibrary2(index,setProductItems2,setModalVisible)} size={60}  color={colors.black} name="photo-library" /> 
            <Text onPress={() => choosePhotoFromLibrary2(index,setProductItems2,setModalVisible)} style={styles.textStyle}>Library</Text>  
          </TouchableOpacity>    
        </View>
        
        </View>     
      </Pressable> 

      </Modal>  



    <View style={styles.PhotoContainer}>
      {item.uploading ? (
        <View style={styles.status}>
          <Text>{transferred2} % completed</Text>
          <ActivityIndicator size="large" color="#0000ff" /> 
        </View> 
      ) : (    
        <TouchableOpacity onPress={() => HandleUploadImage(index)} style={styles.takePhoto}>
          <Text style={styles.textPhoto}> Upload Image</Text>  
        </TouchableOpacity>      
      )}
    </View>

    <Text style={styles.label}>Fabric Type</Text>
              <View style={styles.pickerBorder}>
                <Picker 
                selectedValue={item?.label}   style={styles.picker}   
                onValueChange={(value) => handleProductItemChange(index, 'label', value,productItems2,setProductItems2)}>
                <Picker.Item label="Mat/Velvet Fabric" value="Mat/Velvet Fabric" />
                <Picker.Item label="⁠Suede Fabric" value="⁠Suede Fabric" />
                <Picker.Item label="⁠Synthetic Leather" value="⁠Synthetic Leather" />
                <Picker.Item label="Semi Animal Skin Leather" value="Semi Animal Skin Leather" />
                <Picker.Item label="Animal Skin Leather" value="Animal Skin Leather" />

              </Picker>
              </View>
 

    <Text style={styles.label}>Sample Description</Text>
    <Input
      value={item?.Description}
      onChangeText={(value) => handleProductItemChange(index, 'Description', value,productItems2,setProductItems2)}
      outlined
      placeholder="Enter Description"
      multiline={true}
      numberOfLines={1}  
    />

      


<Text style={styles.label}>Unit Price</Text>
    <Input
      value={item.UnitPrice}
      onChangeText={(value) => handleProductItemChange(index, 'UnitPrice', value,productItems2,setProductItems2)}
      outlined
      placeholder="N500" 
      keyboardType="numeric"
    /> 

    <Text style={styles.label}>Quantity</Text>
    <Input
      value={item.Quantity}
      onChangeText={(value) => handleProductItemChange(index, 'Quantity', value,productItems2,setProductItems2)}
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
                selectedValue={item?.Warranty}   style={styles.picker}   
                onValueChange={(value) => handleProductItemChange(index, 'Warranty', value,productItems2,setProductItems2)}>
                <Picker.Item label="NO WARRANTY" value="NO WARRANTY" />
                <Picker.Item label="3 MONTHS" value="3 MONTHS" />
                <Picker.Item label="6 MONTHS" value="6 MONTHS" />
                <Picker.Item label="12 MONTHS" value="12 MONTHS" />
              </Picker>
              </View>

   
   {productItems.length > 1 && (
     <Button style={styles.button}  del="red" onPress={() => deleteProductItem(index)}>
     <Text>Delete</Text> 
   </Button>  
   )}

   <View style={{height: 37}}></View>
 
  </View>


)) 
 }
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
