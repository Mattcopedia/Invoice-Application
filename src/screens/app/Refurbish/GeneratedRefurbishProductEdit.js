import React, { useState,useEffect } from 'react';
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
  Keyboard, 
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'; 
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
import { useIsFocused, useNavigation } from '@react-navigation/native';
import PlusIcon from '../../../components/PlusIcon';
import { Picker } from '@react-native-picker/picker';
import { fetchGeneratedRefurbishInvoice } from '../../../store/redux-thunks/RefurbishList';
import { choosePhotoFromLibrary, takePhotoFromCamera } from '../../../constants/htmlContent';

const GeneratedRefurbishProductEdit = ({ route }) => {
 const navigation = useNavigation()
  const isFocused = useIsFocused();
  const imagePath = "https://png.pngtree.com/png-clipart/20200225/original/pngtree-image-upload-icon-photo-upload-icon-png-image_5279796.jpg"
  const user = useSelector(state => state?.invoices?.user)

  const dispatch = useDispatch(); 
  const [Description, setDescription] = useState(route.params.item?.Description);
  const [Amount, setAmount] = useState(route.params.item?.Amount);
  const [UnitPrice, setUnitPrice] = useState(route.params.item?.UnitPrice);
  const [selectedWarranty, setSelectedWarranty] = useState(route.params.item?.Warranty);
  const [Quantity, setQuantity] = useState(route.params.item?.Quantity);

  const [loading, setLoading] = useState(false);
  const [errorLoading,SetErrorLoading] = useState(false)
  const [image, setImage] = useState(route.params.item?.ImageUri)   
  const images = route.params.item?.ImageUri   
  const [modalVisible, setModalVisible] = useState(false);  
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0)
  const [uploaded,setUploaded] = useState(false)  
  const invoiceType =  route.params.item2.invoiceType 



  useEffect(() => {
    const calculateAmount = () => {
      const amount = UnitPrice * Quantity;
      setAmount(amount);
    };
 
    calculateAmount(); 
  }, [UnitPrice, Quantity]);  




  useEffect(() => {
    if (isFocused) {
        // Update the state with new route params
        setDescription(route.params.item?.Description);
        setAmount(route.params.item?.Amount);
        setUnitPrice(route.params.item?.UnitPrice)
        setImage(route.params.item?.ImageUri) 
        setQuantity(route.params.item?.Quantity)
    }
}, [isFocused, route.params]);

const handleBack = () => {
  navigation.navigate("GeneratedRefurbishInvoice") 
}; 

const handleWarrantyChange = (value) => {
  setSelectedWarranty(value);
};




console.log("Id",route.params.item2?.uid) 

  const UploadImage = async () => {

    if(image === images) {  
      Alert.alert( "Please select an image")   
      return;  
    }
    if (uploaded) {
      Alert.alert("Image is already uploaded");
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


  const onSubmit = async (productId) => {

    if (!UnitPrice  || !Description  || UnitPrice.trim() === ""
  ||Description.trim() === "" || !selectedWarranty || selectedWarranty.trim() === '' || !Quantity || Quantity.trim() === "") {
      Alert.alert('Please complete the form');
      SetErrorLoading(true)
      return;    
    }


 
    SetErrorLoading(true)
    setLoading(true);

    let downloadURL = null; // Initialize downloadURL to null

  if (image !== route.params.item?.ImageUri) {
    // New image has been uploaded, upload it to Firebase Storage
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1); 
    const extension = filename.split(".").pop();
    const name = filename.split(".").slice(0, -1).join(".");
    filename = name + Date.now() + "." + extension;

    const directory = user?.uid;
    const storageRef = storage().ref(`${directory}/images/${filename}`);
    
    try {
      const taskSnapshot = await storageRef.putFile(uploadUri);
      downloadURL = await storageRef.getDownloadURL();
      console.log("downloadUri", downloadURL);
    } catch (e) {
      console.log(e);
      setLoading(false);
      SetErrorLoading(false);
      Alert.alert('Error uploading image', e.message);
      return;
    }
  } else {
    // Use the existing ImageUri
    downloadURL = route.params.item?.ImageUri;  
  }
    

  const docRef = firestore().collection('GeneratedRefurbishInvoice').doc(route.params.item2?.uid);
  const invoiceDoc = await docRef.get();

 
const products = invoiceDoc.data().Product;
    const updatedProducts = products.map(product => {
      if (product.uid === productId) {
        return { ...product, Description: Description, Quantity: Quantity,  UnitPrice: UnitPrice, Amount: Amount, ImageUri: downloadURL, Warranty: selectedWarranty, };
      }
      return product  
    });  

    docRef.update({ Product: updatedProducts })
      .then(() => {  
        dispatch(setToUpdate());  
        Alert.alert('Data updated successfully');  
        setLoading(false);  
        navigation.navigate('GeneratedRefurbishInvoice');  
        Keyboard.dismiss();
      })
      .catch(e => {
        console.log('error when updating invoice :>> ', e);
        setLoading(false);  
        SetErrorLoading(false)
        Alert.alert(e.message);   
      });

  }; 


  const handleDelete =  async (item) => {
    const docRef = firestore().collection('GeneratedRefurbishInvoice').doc(route.params.item2?.uid);
    const invoiceDoc = await docRef.get()
    const products = invoiceDoc.data()?.Product || [];

    const updatedProducts = products.filter(product => { 
      return !(
        product.Address === item.Address && 
        product.Amount === item.Amount && 
        product.Attention === item.Attention && 
        product.Companyname === item.Companyname &&
        product.Description === item.Description &&
        product.ImageUri === item.ImageUri &&
        product.Quantity === item.Quantity && 
        product.UnitPrice === item.UnitPrice &&
        product.Warranty === item.Warranty &&
        product.invoiceNo === item.invoiceNo &&
        product.invoiceType === item.invoiceType &&
        product.label === item.label 
      ); 
  })    
    console.log("UpdatedProducts",updatedProducts) 
    await docRef.update({ Product: updatedProducts })
      .then(() => { 
            console.log("Product Deleted!")  
            navigation.navigate("GeneratedRefurbishInvoice");
            Keyboard.dismiss();
          });     
 
}    


  return (
   
    <SafeAreaView style={styles.container} >
      <Pressable style={styles.backContainer} hitSlop={8} onPress={handleBack}>
        <Image
          style={styles.backIcon}
          source={require('../../../assets/back.png')}
        />
      </Pressable> 
           
      <ScrollView  keyboardShouldPersistTaps="handled"> 
      <Title type="thin">Update Product</Title> 
      <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.Photo}>
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
  
       
       {uploading ? (
        <View style={styles.status}>
          <Text>{transferred} % completed</Text>
          <ActivityIndicator size="large" color="#0000ff" /> 
        </View>
      ) : (    
       <View style={styles.PhotoContainer}>
       <TouchableOpacity onPress={UploadImage} style={styles.takePhoto}>
        <Text style={styles.textPhoto}> Upload Image</Text>  
       </TouchableOpacity>      
       </View>  
      )}

    
        <Text style={styles.label}>Description</Text>
        <Input
          value={Description}  
          onChangeText={setDescription}
          outlined
          placeholder="Enter Description"
          multiline={true}
          numberOfLines={1} 
        /> 
         {(!Description ||Description?.trim() === "" ) && errorLoading  ? <Text style={styles.errorText}>Description is required</Text> : null}
  
         <Text style={styles.label}>Quantity</Text> 
        <Input
          value={Quantity}
          onChangeText={setQuantity}
          outlined
          placeholder="2"
          keyboardType="numeric" // Add keyboardType prop
        />
           {(!Quantity || Quantity?.trim() === "") && errorLoading  ? <Text style={styles.errorText}>Quantity is required</Text> : null} 
 

<Text style={styles.label}>Unit Price</Text>
        <Input
          value={UnitPrice}
          onChangeText={setUnitPrice}
          outlined
          placeholder="N500"  
          keyboardType="numeric"
        />
          {(!UnitPrice || UnitPrice?.trim() === "") && errorLoading ? <Text style={styles.errorText}>Unit price is required</Text> : null}
     
          <View>
                        <Text style={styles.label}>Amount</Text>
                        <Text style={styles.labelAmount}>{Amount}</Text> 
                        </View> 

          <Text style={styles.label}>Warranty</Text>
       <View style={styles.pickerBorder}>
        <Picker
        selectedValue={selectedWarranty}   style={styles.picker}   
        onValueChange={(itemValue) => handleWarrantyChange(itemValue)}>
        <Picker.Item label="NO WARRANTY" value="NO WARRANTY" />
        <Picker.Item label="3 MONTHS" value="3 MONTHS" />
        <Picker.Item label="6 MONTHS" value="6 MONTHS" />
        <Picker.Item label="12 MONTHS" value="12 MONTHS" />
      </Picker>
      </View>  
   
        {loading ? (
          <ActivityIndicator /> 
        ) : (
          <Button style={styles.button} type="blue" onPress={() => onSubmit(route.params.item?.uid)}> 
            <Text>Save</Text> 
          </Button>
        )} 

<Button style={styles.button} type="blue"  onPress={() => handleBack()}> 
            <Text>Cancel</Text> 
         </Button>  

         <Button style={styles.button} del="red"  onPress={() => handleDelete(route.params.item)}> 
            <Text>Delete</Text> 
          </Button>
      </ScrollView>
    </SafeAreaView> 
  );  
};

export default React.memo(GeneratedRefurbishProductEdit);