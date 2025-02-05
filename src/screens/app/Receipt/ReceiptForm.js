import moment from 'moment';
import React, { useState,useRef, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View, 
} from 'react-native';
import firestore from '@react-native-firebase/firestore'; 
import SignatureCapture from 'react-native-signature-capture';
import { Picker } from '@react-native-picker/picker'; 
import Button from '../../../components/Button'; 
import Input from '../../../components/Input'; 
import styles, { height, width } from './styles';
import { useDispatch, useSelector } from 'react-redux'; 
import { setReceipt, setToUpdate } from '../../../store/invoices';
import Title from '../../../components/Title';
import { setinvoiceCreated } from '../../../store/invoices';
import { useNavigation } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import { fetchReceipt } from '../../../store/redux-thunks/ReceiptThunk';
import { ImageEditor } from '@react-native-community/image-editor'; 
import RNFS from 'react-native-fs';

import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';



const ReceiptForm = ({route}) => {

  const navigation = useNavigation()
  const user = useSelector(state => state?.invoices?.user)
  const receipt = useSelector(state => state?.invoices?.receiptStore) 
  const [filterReceipt, setFilterReceipt] = useState([]);
  const [signature, setSign] = useState('')  
  const [ImageUriSave,setImageUriSave] = useState(''); 
  const canvasRef = useRef(null); 
  const dispatch = useDispatch();
  const [CheckNumber, setCheckNumber] = useState(''); 
  const [Description, setDescription] = useState('');
  const [AmountPaid, setAmountPaid] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [errorLoading,SetErrorLoading] = useState(false)
  const [paymentMethod, setpaymentMethod] = useState('Transfer');
  const [Job, setJob] = useState('Supply of furniture')
  const [Quantity, setQuantity] = useState('1');
  const invoiceList = route.params.item2  


  
  useEffect(() => {
    dispatch(fetchReceipt(user?.uid))  
    console.log('filterReceipt',receipt?.[0])  
  },[dispatch,user])


  useEffect(() => {
    // Filter receipts whenever `receipt` changes
    if (receipt?.length > 0) {
      const filtered = receipt.filter(
        (r) => r?.ImageUriSave && /[a-zA-Z]/.test(r?.ImageUriSave)
      );
      setFilterReceipt(filtered);
      if (filtered.length > 0) {
        setSign(filtered[0]?.ImageUriSave);
        setImageUriSave(filtered[0]?.ImageUriSave);
      }
    }
  }, [receipt]);
  

  const handleBack = () => {
    navigation.goBack();
  }; 

const handleJob = (value) => {
  setJob(value)
}

const handleClear = () => {
  setSign(''); // Reset the signature state
  if (canvasRef.current) {
    canvasRef.current.clear(); // Call the clear method on the canvas 
  }
};


  const handlePaymentMethod = (value) => {
    setpaymentMethod(value);
  };

  const onSaveEvent = async (success, filePath) => {
    if (!success) {
      console.error("Sketch saving failed.");
      Alert.alert("Error", "Failed to save signature. Please try again.");
      return;
    }
  
    try {
      console.log("Signature saved at:", filePath);
      setLoading(true)
      // Ensure the file path is valid
      const absolutePath = `file://${filePath}`;
      console.log("Absolute File Path:", absolutePath);
      setSign(absolutePath);
      // Prepare the filename for upload
      const timestamp = new Date().getTime();
      const fileName = `signature_${timestamp}.png`;
  
      // Upload to Firebase Storage
      const directory = user?.uid; // Assuming user ID is available
      const storageRef = storage().ref(`${directory}/updatedSignature/${fileName}`);
      await storageRef.putFile(absolutePath);
  
      // Get the download URL
      const downloadURL = await storageRef.getDownloadURL();
      setImageUriSave(downloadURL);
      console.log("Download URL:", downloadURL);
      setLoading(false) 
    } catch (error) {
      console.error("Error saving/uploading signature:", error);
      Alert.alert("Error", "Failed to upload signature. Please try again.");
    }
  };
  

  const onSubmit = () => {
    if ( !Description ||!AmountPaid  ||Description.trim() ==="" || AmountPaid.trim() === ""  ) {
      Alert.alert('Please complete the invoice form');
      SetErrorLoading(true)
      return;    
    } 

     
    SetErrorLoading(true)
    setLoading(true);
    firestore()
      .collection('Receipt') 
      .add({
        CheckNumber, 
        Description,
        AmountPaid,
        paymentMethod,
        Job, 
        Date: invoiceList?.Date,
        createdAt: firestore.FieldValue.serverTimestamp(),
        CompanyName: invoiceList?.CompanyName,  
        Address: invoiceList?.Address,
        invoiceNo: invoiceList?.invoiceNo, 
        GrandTotal: invoiceList?.GrandTotal ? invoiceList?.GrandTotal : invoiceList?.Product[0]?.GrandTotal, 
        userName:invoiceList?.userName ? invoiceList?.userName: "",    
        GoogleUserName: invoiceList?.GoogleUserName ? invoiceList?.GoogleUserName : "", 
        Quantity,
        Attention: invoiceList?.Attention,
        phoneNumber: invoiceList?.phoneNumber,
        userId: user?.uid, 
        ImageUriSave:ImageUriSave ? ImageUriSave : "",     
      })
      .then(() => { 
        setLoading(false);
        SetErrorLoading(false)
        dispatch(fetchReceipt(user?.uid))   
        dispatch(setToUpdate()); 
        dispatch(setinvoiceCreated(true));  
        console.log("receipt3",receipt) 
        navigation.navigate('ReceiptPdfList');         
        setCheckNumber(""); 
        setDescription("");  
        setAmountPaid(""); 
        setQuantity(""); 
        setpaymentMethod(paymentMethod) 
        Alert.alert("Receipt saved successfully");
        Keyboard.dismiss();
      })
      .catch(e => { 
        console.log('error when adding information :>> ', e);
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

    <ScrollView  keyboardShouldPersistTaps="handled"> 
    <Title type="thin">Fill in the Receipt form</Title> 

    <Text style={styles.label}>Payment Method</Text>

    <View style={styles.pickerBorder}>
      <Picker
      selectedValue={paymentMethod} style={styles.picker}
      onValueChange={(itemValue) => handlePaymentMethod(itemValue)}>
      <Picker.Item label="Transfer" value="Transfer" />
      <Picker.Item label="Cheque" value="Cheque" />
 
    </Picker>   

    </View>    

    {paymentMethod.trim() === "Cheque" && (  
                <View>

                 <Text style={styles.label}>Check number</Text>
                      <Input 
                      value={CheckNumber} 
                      onChangeText={setCheckNumber}
                      outlined
                      placeholder="Type here..."
                      autoFocus={true} 
                       keyboardType="numeric"
                      />
              </View>  
              )
              } 

           <Text style={styles.label}>Job</Text>
          <View style={styles.pickerBorder}>
                          <Picker
                          selectedValue={Job} style={styles.picker}
                          onValueChange={(itemValue) => handleJob(itemValue)}>
                          <Picker.Item label="Supply of furniture" value="Supply of furniture" />
                          <Picker.Item label="Refurbishment of furniture" value="Refurbishment of furniture" /> 
                          </Picker>  
        
              </View> 

     
     <Text style={styles.label}>Amount Paid</Text>
      <Input 
        value={AmountPaid} 
        onChangeText={setAmountPaid}
        outlined 
        placeholder="5000"
        keyboardType="numeric"

      />
    {(!AmountPaid || AmountPaid.trim() === "") && errorLoading ? <Text style={styles.errorText}>Amount Paid is required</Text> : null}

      <Text style={styles.label}>Description</Text> 
      <Input
        value={Description}
        onChangeText={setDescription} 
        outlined
        placeholder="Enter Description" 
        multiline={true}
        numberOfLines={1}  
        
      />

     {(!Description || Description.trim() === "") && errorLoading  ?  <Text style={styles.errorText}>Description is required</Text> : null}

     <Text style={styles.label}>Quantity</Text> 
      <Input
        value={Quantity}
        onChangeText={setQuantity} 
        outlined
        placeholder="1"  
        multiline={true}
        numberOfLines={1}  
        keyboardType="numeric"
      />

     {(!Quantity || Quantity.trim() === "") && errorLoading  ?  <Text style={styles.errorText}>Quantity is required</Text> : null}


     <Text style={styles.label}>Draw your Signature</Text> 
     <View style={{ flex: 1 }}>
     <View style={styles.preview}> 
     {filterReceipt.length > 0 && (
          <Text style={styles.labelsav}>Previously Saved Signature</Text>
        )}  
      {signature ? (
        <Image
          resizeMode={"contain"}
          style={{ width: width * 0.8, height: 90 }}
          source={{ uri: signature }}
        />
      ) : null}
    </View>
    <View >

    <View style={styles.container2}> 
      <View style={[{ width: 335, height: 150 }]}>
        <RNSketchCanvas
         ref={canvasRef}
          containerStyle={[{ backgroundColor: 'transparent' },styles.borderSig]}
          canvasStyle={[{ backgroundColor: 'transparent', width: 367, height: 85 }]}
          defaultStrokeIndex={0} 
          defaultStrokeWidth={0.3} 
          maxStrokeWidth={0.3}
          minStrokeWidth={0.3}  
          strokeColors={[{ color: '#0000FF' }, {color: '#FF0000'}, {color: '#000000'}]}
          StrokeWidth={0.3} 
          undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Undo</Text></View>}
          clearComponent={
            <View  style={styles.functionButton}>
              <Text  style={{ color: 'white' }}>Clear</Text>
            </View>
        }
          eraseComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Eraser</Text></View>}
          strokeComponent={color => (
            <View style={[{ backgroundColor: color }, styles.strokeColorButton]} /> 
          )}
          strokeSelectedComponent={(color, index, changed) => (
            <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
          )}
         
          saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Save</Text></View>}
          savePreference={() => ({
            folder: 'RNSketchCanvas',
            filename: String(Math.ceil(Math.random() * 100000000)),
            transparent: false,
            imageType: 'png'
          })}
          onSketchSaved={onSaveEvent}
        />
      </View>
    </View>




      </View>
    </View>

  

        {loading ? (
          <ActivityIndicator /> 
        ) : (
          <Button style={styles.button} type="blue" onPress={onSubmit}>
            <Text>Next </Text> 
          </Button> 
        )} 

 
      </ScrollView> 
           
    </SafeAreaView>


  );
};



export default ReceiptForm
