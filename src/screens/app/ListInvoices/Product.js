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
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
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
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk';
import { fetchProductSelect } from '../../../store/redux-thunks/ProductSelectThunk';

const Product = ({ route }) => {
 const navigation = useNavigation()
  const isFocused = useIsFocused();
  const user = useSelector(state => state?.invoices?.user)
  const invoices = useSelector(state => state?.invoices?.data)

  const images =  useSelector(state => state.invoices.images);   
  const dispatch = useDispatch(); 
  const [Description, setDescription] = useState(route.params.item?.Description);
  const [UnitPrice, setUnitPrice] = useState(route.params.item?.UnitPrice);
  const [SampleCode, setSampleCode] = useState(route.params.item?.SampleCode);
  const [loading, setLoading] = useState(false);
  const [errorLoading,SetErrorLoading] = useState(false)
  const [image, setImage] = useState(route.params.item?.ImageUri)    
  const [modalVisible, setModalVisible] = useState(false);  
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0)
  const [uploaded,setUploaded] = useState(false)  
 



  useEffect(() => {
    if (isFocused) {
        // Update the state with new route params
        setDescription(route.params.item?.Description);
        setUnitPrice(route.params.item?.UnitPrice)
        setSampleCode(route.params.item?.SampleCode)
        setImage(route.params.item?.ImageUri)
    }
}, [isFocused, route.params]);

const handleBack = () => {
  navigation.navigate("AllInvoices");
};

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300, 
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.8,
      mediaType: 'photo',
      sortOrder: 'desc', 
      includeExif: true,
      forceJpg: true, 
    }).then(image => {
      console.log(image);
      setImage(image.path) 
      setModalVisible(false);
    }); 
  }

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.8,
      mediaType: 'photo',
      sortOrder: 'desc', 
      includeExif: true,
      forceJpg: true, 
    }).then(image => {
      console.log(image);
      setImage(image.path)
      setModalVisible(false);
    }); 
  }



  const UploadImage = async () => {
    if(image === images) {  
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
 

  const onSubmit = async () => {

    if ( !SampleCode || !UnitPrice  || !Description || SampleCode.trim() === "" || UnitPrice.trim() === ""
  ||Description.trim() === "") { 
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
    
    firestore() 
    .collection('ProductItem') 
    .doc(route.params.item?.uid)   
    .update({ 
        Description: Description, 
        completeDescription: `${Description} - ${SampleCode}`,
        SampleCode: SampleCode,
        UnitPrice: UnitPrice, 
        ImageUri: downloadURL, 
        SampleCode: SampleCode, 
      }) 
      .then(() => {  
        dispatch(setToUpdate());  
        Alert.alert('Data updated successfully');  
        setLoading(false);  
        dispatch(fetchProductItem(user?.uid))  
        dispatch(fetchProductSelect(user?.uid))  
        navigation.navigate('AllInvoices');   
      })
      .catch(e => {
        console.log('error when updating invoice :>> ', e);
        setLoading(false);  
        SetErrorLoading(false)
        Alert.alert(e.message);   
      });
  }; 


  const handleDelete = () => {
  const result= firestore()
        .collection('ProductItem')
        .doc(route.params.item?.uid).delete()
        result.then(() => { 
            console.log("Product Deleted!")
            dispatch(setToUpdate());
            dispatch(fetchProductItem(user?.uid))  
            dispatch(fetchProductSelect(user?.uid))  
            navigation.navigate("AllInvoices")
      
        });
}   



if (!invoices?.userId ) {

  return (
      <SafeAreaView style={styles.container}>
           <Pressable style={styles.backContainer} hitSlop={8} onPress={handleBack}>
      <Image
        style={styles.backIcon}
        source={require('../../../assets/back.png')}
      />
    </Pressable> 
         
       <Title type="thin">Update Product</Title> 
  <ScrollView> 
  
        <Text style={styles.invoiceText}> Add a Product</Text>
  
      </ScrollView>
      <PlusIcon />  
       
      </SafeAreaView>  
    
  )  
}  

  return (
   
    <SafeAreaView style={styles.container} >
      <Pressable style={styles.backContainer} hitSlop={8} onPress={handleBack}>
        <Image
          style={styles.backIcon}
          source={require('../../../assets/back.png')}
        />
      </Pressable> 
           
      <ScrollView>
      <Title type="thin">Update Product</Title> 
      <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.Photo}>
            <ImageBackground source={{ uri: image }} style={styles.imageBackground}>
            <Text style={styles.labelPhoto}>Select an image</Text>  
            </ImageBackground>
            </View> 
        </TouchableOpacity>
  
        <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => {
          setModalVisible(false);  
        }}> 

                <View style={styles.centeredView}> 
                  <View style={styles.modalView}>
                    <TouchableOpacity onPress={takePhotoFromCamera} style={styles.buttonUpload}>
                      <SimpleLineIcons size={60}  color={colors.black} name="camera" /> 
                      <Text style={styles.textStyle}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={choosePhotoFromLibrary} style={styles.buttonUpload}>
                      <MaterialIcons size={60}  color={colors.black} name="photo-library" /> 
                      <Text style={styles.textStyle}>Library</Text>  
                    </TouchableOpacity>
                    <AntDesign size={20} onPress={() => setModalVisible(false)}  style={styles.closeButton} color={colors.black} name="close" /> 
                  </View>   
                </View>   
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
          // autoFocus={true}
        /> 
         {(!Description ||Description?.trim() === "" ) && errorLoading  ? <Text style={styles.errorText}>Description is required</Text> : null}


<Text style={styles.label}>Sample Code</Text> 
        <Input
          value={SampleCode}
          onChangeText={setSampleCode}
          outlined
          placeholder="2"
        />
           {(!SampleCode || SampleCode?.trim() === "") && errorLoading  ? <Text style={styles.errorText}>Sample Code is required</Text> : null} 
 
<Text style={styles.label}>Unit Price</Text>
        <Input
          value={UnitPrice}
          onChangeText={setUnitPrice}
          outlined
          placeholder="N500" 
          keyboardType="numeric" // Add keyboardType prop
        />
          {(!UnitPrice || UnitPrice?.trim() === "") && errorLoading ? <Text style={styles.errorText}>Unit price is required</Text> : null}
   


        {loading ? (
          <ActivityIndicator /> 
        ) : (
          <Button style={styles.button} type="blue" onPress={onSubmit}> 
            <Text>Save</Text> 
          </Button>
        )} 

<Button style={styles.button} type="blue"  onPress={handleBack}> 
            <Text>Cancel</Text> 
         </Button> 

         <Button style={styles.button} del="red"  onPress={handleDelete}> 
            <Text>Delete</Text> 
          </Button>
      </ScrollView>
    </SafeAreaView>  
  );  
};

export default React.memo(Product);