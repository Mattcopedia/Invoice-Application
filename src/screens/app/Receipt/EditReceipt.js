import moment from 'moment';
import React, { useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View, 
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';  
import Button from '../../../components/Button'; 
import DateInput from '../../../components/DateInput';
import Input from '../../../components/Input';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux'; 
import { setReceipt, setToUpdate } from '../../../store/invoices';
import Title from '../../../components/Title';
import { setinvoiceCreated } from '../../../store/invoices';
import { useNavigation } from '@react-navigation/native';
import { fetchReceipt } from '../../../store/redux-thunks/ReceiptThunk';

const EditReceipt = ({ route }) => {
  const navigation = useNavigation()
  const user = useSelector(state => state?.invoices?.user)
  const receiptList = useSelector(state => state?.invoices?.receiptList)   
  const receipt = receiptList  
  const dispatch = useDispatch();
  const [CheckNumber, setCheckNumber] = useState(receipt?.CheckNumber); 
  const [Description, setDescription] = useState(receipt?.Description);
  const [AmountPaid, setAmountPaid] = useState(receipt?.AmountPaid); 
  const [loading, setLoading] = useState(false);
  const [errorLoading,SetErrorLoading] = useState(false)
  const [paymentMethod, setpaymentMethod] = useState(receipt?.paymentMethod);
  const [Job, setJob] = useState(receipt?.Job)
  const [Quantity, setQuantity] = useState(receipt?.Quantity) 

  const handleBack = () => {
    navigation.goBack();
  }; 
const handleJob = (value) => {
  setJob(value)
}

  const handlePaymentMethod = (value) => {
    setpaymentMethod(value);
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
      .doc(receipt?.uid)  
      .update({   
        CheckNumber, 
        Description,
        AmountPaid,
        paymentMethod,
        Job,  
        Quantity,
        userId: user?.uid, 
      }) 
      .then(() => { 
        setLoading(false);
        SetErrorLoading(false)
        dispatch(fetchReceipt(user?.uid))   
        dispatch(setToUpdate()); 
        dispatch(setinvoiceCreated(true));  
        console.log("receipt",receipt)  
        navigation.navigate('GeneratedReceiptPdf');    
        setCheckNumber(''); 
        setDescription("");  
        setAmountPaid(""); 
        setpaymentMethod("Transfer"); 
        Alert.alert("Data saved successfully");
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
      <Title type="thin">Update Receipt form</Title> 

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

export default React.memo(EditReceipt);  