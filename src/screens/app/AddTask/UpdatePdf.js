import moment from 'moment';
import React, { useState } from 'react';
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
import { Picker } from '@react-native-picker/picker';  
import Button from '../../../components/Button'; 
import DateInput from '../../../components/DateInput';
import Input from '../../../components/Input';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setToUpdate } from '../../../store/tasks';
import colors from '../../../constants/colors';
import Title from '../../../components/Title';

const UpdatePdf = ({ navigation }) => {
  const user = useSelector(state => state.user.data);
  const imagePath = "https://png.pngtree.com/png-clipart/20200225/original/pngtree-image-upload-icon-photo-upload-icon-png-image_5279796.jpg"
  const invoices = useSelector(state => state.invoices.data)
  const images =  useSelector(state => state.images.data);   
  const dispatch = useDispatch();
  const [Companyname, setCompanyname] = useState(invoices.Companyname);
  const [Address, setAddress] = useState(invoices.Address);
  const [Description, setDescription] = useState(invoices.Description);
  const [invoiceDate, setInvoiceDate] =  useState(new Date()); 
  const [Amount, setAmount] = useState(invoices.Amount);
  const [UnitPrice, setUnitPrice] = useState(invoices.UnitPrice);
  const [Quantity, setQuantity] = useState(invoices.Quantity);
  const [selectedWarranty, setSelectedWarranty] = useState(invoices.selectedWarranty);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState(invoices.selectedPaymentPlan);
  const [loading, setLoading] = useState(false);
  const [errorLoading,SetErrorLoading] = useState(false)
  const [image, setImage] = useState(images)   
  const [modalVisible, setModalVisible] = useState(false); 
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0)
  const [uploaded,setUploaded] = useState(false)
 
  const handleBack = () => {
    navigation.navigate("ExportPdf");  
  }; 

  const handleWarrantyChange = (value) => {
    setSelectedWarranty(value);
    // You can also add code here to store the selected warranty in Firebase
  };

  const handlePaymentPlan = (value) => {
    setSelectedPaymentPlan(value);
    // You can also add code here to store the selected warranty in Firebase
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300, 
      cropping: true,
      compressImageQuality: 0.8,
      mediaType: 'photo',
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


  const onSubmit = () => {

    if (!Companyname || !Address || !Amount || !Quantity || !UnitPrice  || !Description ) {
      Alert.alert('Please complete the invoice form');
      SetErrorLoading(true)
      return;   
    }
     
    SetErrorLoading(true)
    setLoading(true);

    firestore()
    .collection('invoices') 
    .doc(invoices?.uid)  
    .update({ 
      Companyname:Companyname,
      invoiceDate:invoiceDate,
      Address:Address, 
      Description: Description,  
      Quantity:Quantity,
      UnitPrice:UnitPrice, 
      Amount:Amount,
      selectedPaymentPlan:selectedPaymentPlan,
      selectedWarranty:selectedWarranty,
    })  
      .then(() => { 
        dispatch(setToUpdate()); 
        Alert.alert('Invoice updated successfully');  
        setLoading(false);  
        navigation.navigate('ExportPdf');    
      })
      .catch(e => {
        console.log('error when updating invoice :>> ', e);
        setLoading(false);  
        SetErrorLoading(false)
        Alert.alert(e.message);
      });
  };

  return (
   
    <SafeAreaView style={styles.container} >
      <Pressable style={styles.backContainer} hitSlop={8} onPress={handleBack}>
        <Image
          style={styles.backIcon}
          source={require('../../../assets/back.png')}
        />
      </Pressable> 

      {invoices?.Companyname ? (
           
      <ScrollView>
      <Title type="thin">Update Invoice</Title> 

        <Text style={styles.label}>Company name</Text>
        <Input 
          value={Companyname} 
          onChangeText={setCompanyname}
          outlined
          placeholder="Type here..."
        />
       {!Companyname && errorLoading ? <Text style={styles.errorText}>Company name is required</Text> : null}
        <Text style={styles.label}>Address</Text> 
        <Input
          value={Address}
          onChangeText={setAddress} 
          outlined
          placeholder="Enter Address" 
          multiline={true}
          numberOfLines={1} 
        />
       {!Address && errorLoading  ?  <Text style={styles.errorText}>Address is required</Text> : null}
 
        <Text style={styles.label}>Date</Text>
        <DateInput value={invoiceDate} onChange={setInvoiceDate} />
         
        <Text style={styles.label}>Description</Text>
        <Input
          value={Description}  
          onChangeText={setDescription}
          outlined
          placeholder="Enter Description"
          multiline={true}
          numberOfLines={1} 
        /> 
         {!Description && errorLoading  ? <Text style={styles.errorText}>Description is required</Text> : null}

<Text style={styles.label}>Quantity</Text> 
        <Input
          value={Quantity}
          onChangeText={setQuantity}
          outlined
          placeholder="2"
          keyboardType="numeric" // Add keyboardType prop
        />
           {!Quantity && errorLoading  ? <Text style={styles.errorText}>Quantity is required</Text> : null} 
 
<Text style={styles.label}>Unit Price</Text>
        <Input
          value={UnitPrice}
          onChangeText={setUnitPrice}
          outlined
          placeholder="N500" 
          keyboardType="numeric" // Add keyboardType prop
        />
          {!UnitPrice && errorLoading ? <Text style={styles.errorText}>Unit price is required</Text> : null}

<Text style={styles.label}>Amount</Text>
        <Input
          value={Amount}  
          onChangeText={setAmount}
          outlined
          placeholder="N2000" 
          keyboardType="numeric" // Add keyboardType prop
        /> 
          {!Amount && errorLoading  ? <Text style={styles.errorText}>Amount is required</Text> : null}
       
         <Text style={styles.label}>Warranty Period</Text>
       <View style={styles.pickerBorder}>
        <Picker
        selectedValue={selectedWarranty}   style={styles.picker}   
        onValueChange={(itemValue) => handleWarrantyChange(itemValue)}>
        <Picker.Item label="No Warranty" value="No Warranty" />
        <Picker.Item label="3 Months" value="3 Months" />
        <Picker.Item label="6 Months" value="6 Months" />
        <Picker.Item label="12 Months" value="12 Months" />
      </Picker>
      </View> 
   
       
      <Text style={styles.label}>Payment Plan</Text>
      <View style={styles.pickerBorder}>
        <Picker
        selectedValue={selectedPaymentPlan} style={styles.picker}
        onValueChange={(itemValue) => handlePaymentPlan(itemValue)}>
        <Picker.Item label="85-15" value="85-15" />
        <Picker.Item label="75-25" value="75-25" />
        <Picker.Item label="50-50" value="50-50" />
      </Picker> 
      </View>    
        

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

        {loading ? (
          <ActivityIndicator /> 
        ) : (
          <Button style={styles.button} type="blue" onPress={onSubmit}> 
            <Text>Update Invoice</Text> 
          </Button>
        )} 

         <Button style={styles.button} type="blue"  onPress={handleBack}> 
            <Text>Cancel</Text> 
          </Button>
      </ScrollView>
        ) : (
          <Text style={styles.invoiceText}> Fill in an invoice form</Text>
        )}   
      
    </SafeAreaView> 
  ); 
};

export default React.memo(UpdatePdf);