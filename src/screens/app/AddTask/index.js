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
import { Tabs } from '../../../components/Tabs';

const AddTask = ({ navigation }) => {
  const user = useSelector(state => state.user.data);
  const imagePath = "https://png.pngtree.com/png-clipart/20200225/original/pngtree-image-upload-icon-photo-upload-icon-png-image_5279796.jpg"
  const dispatch = useDispatch();
  const [Companyname, setCompanyname] = useState('');
  const [Address, setAddress] = useState('');
  const [Description, setDescription] = useState('');
  const [invoiceDate, setInvoiceDate] =  useState(new Date()); 
  const [Amount, setAmount] = useState('');
  const [UnitPrice, setUnitPrice] = useState('');
  const [Quantity, setQuantity] = useState('');
  const [selectedWarranty, setSelectedWarranty] = useState('No Warranty');
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('50-50');
  const [loading, setLoading] = useState(false);
  const [errorLoading,SetErrorLoading] = useState(false)
  const [image, setImage] = useState(imagePath)  
  const [modalVisible, setModalVisible] = useState(false); 
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0)
  const  [uploaded,setUploaded] = useState(false)
 
  const handleBack = () => {
    navigation.goBack();
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


  const onSubmit = () => {
    const today = moment(new Date()).format('YYYY-MM-DD');
    const DateFormatted = moment(Date).format('YYYY-MM-DD'); 
    
    if (!Companyname || !Address || !Amount || !Quantity || !UnitPrice  || !Description ) {
      Alert.alert('Please complete the invoice form');
      SetErrorLoading(true)
      return;   
    }

    if(image === imagePath || !uploaded) { 
      Alert.alert( "Please select and upload an image")    
      return;    
    }
     
    SetErrorLoading(true)
    setLoading(true);
    firestore()
      .collection('invoices') 
      .add({
        Companyname,
        invoiceDate,
        Address,
        Description, 
        Quantity,
        UnitPrice, 
        Amount,
        selectedPaymentPlan,
        selectedWarranty,
        userId: user?.uid, 
      })
      .then(() => { 
        Alert.alert('Invoice saved successfully'); 
        setLoading(false);
        SetErrorLoading(false)
        dispatch(setToUpdate()); 
        navigation.navigate('ExportPdf');   
        setCompanyname('');
        setAddress(""); 
        setInvoiceDate(new Date()); 
        setDescription("");
        setQuantity("");
        setUnitPrice("");
        setAmount("");
        setSelectedWarranty("No Warranty"); 
        setSelectedPaymentPlan("50-50");  
      })
      .catch(e => {
        console.log('error when adding invoice :>> ', e);
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

      <ScrollView>
      <Title type="thin">Fill in the Invoice</Title> 

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
            <Text>Preview Invoice</Text> 
          </Button>
        )} 
      </ScrollView>
        
  
    </SafeAreaView>
  );
};

export default React.memo(AddTask);