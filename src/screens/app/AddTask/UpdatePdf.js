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
  KeyboardAvoidingView, 
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';  
import Button from '../../../components/Button'; 
import DateInput from '../../../components/DateInput';
import Input from '../../../components/Input';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setToUpdate } from '../../../store/invoices';
import Title from '../../../components/Title';

const UpdatePdf = ({ navigation }) => {
  const invoices = useSelector(state => state?.invoices?.data)
  const summary = useSelector(state => state?.invoices?.summary)
  const ProductItem = useSelector(state => state?.invoices?.ProductItem) 

  const dispatch = useDispatch();
  const [Companyname, setCompanyname] = useState(invoices?.Companyname);
  const [Address, setAddress] = useState(invoices?.Address);
  const [invoiceDate, setInvoiceDate] =  useState(invoices?.invoiceDate.toDate())  
  const [loading, setLoading] = useState(false);
  const [errorLoading,SetErrorLoading] = useState(false)
  const [invoiceType, setInvoiceType] = useState(invoices?.invoiceType);
  const [Note,setNote] = useState(invoices?.Note)
  const [Attention, setAttention] = useState(invoices?.Attention); 
 
  const handleBack = () => {
    navigation.goBack();
  };
  
  const handleInvoice = (value) => {
    setInvoiceType(value);
  };


  const onSubmit = () => {

    if ( !Address ||!Attention ||Attention?.trim() === "" || Address?.trim() === "") {
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
      Address:Address, 
      Attention: Attention,
      invoiceType: invoiceType,
      invoiceDate:invoiceDate, 
    })    
      .then(() => {  
        dispatch(setToUpdate()); 
        Alert.alert('Data updated successfully');  
        setLoading(false);  
        navigation.navigate('UpdateSummary');    
        if(invoiceType === "TECHNICAL PROPOSAL") {
          navigation.navigate('ExportPdf')
        } else {
          navigation.navigate('Summary')
        } 
      })  
      .catch(e => {
        console.log('error when updating invoice :>> ', e);
        setLoading(false);  
        SetErrorLoading(false)
        Alert.alert(e.message);
      });
  };

   
  if (!invoices?.userId) {
   return (
    <SafeAreaView style={styles.container}>
    <Pressable style={styles.backContainer} hitSlop={8} onPress={handleBack}>
        <Image
          style={styles.backIcon}
          source={require('../../../assets/back.png')}
        /> 
      </Pressable> 

<ScrollView> 

<Title type="thin">Update Invoice</Title> 
      {/* <Text style={styles.text1}> Complete the invoice and summary form</Text>  */}
    </ScrollView>
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
      <Title type="thin">Update Invoice</Title> 

       
      <Text style={styles.label}>Invoice Type</Text>
      <View style={styles.pickerBorder}>
        <Picker
        selectedValue={invoiceType} style={styles.picker}
        onValueChange={(itemValue) => handleInvoice(itemValue)}>
        <Picker.Item label="QUOTATION" value="QUOTATION" />
        <Picker.Item label="PROFORMA INVOICE" value="PROFORMA INVOICE" />
        <Picker.Item label="INVOICE" value="INVOICE"/>  
        <Picker.Item label="TECHNICAL PROPOSAL" value="TECHNICAL PROPOSAL"/>  
      </Picker> 
      </View>  

 
      <Text style={styles.label}>Company name</Text>
        <Input 
          value={Companyname} 
          onChangeText={setCompanyname}
          outlined
          placeholder="Type here..."
          autoFocus={true} 
        />

       <Text style={styles.label}>Attention</Text>
        <Input 
          value={Attention} 
          onChangeText={setAttention}
          outlined
          placeholder="Type here..."
        />
      {(!Attention || Attention?.trim() === "") && errorLoading ? <Text style={styles.errorText}>Attention is required</Text> : null}

        <Text style={styles.label}>Address</Text> 
        <Input
          value={Address}
          onChangeText={setAddress} 
          outlined
          placeholder="Enter Address" 
          multiline={true}
          numberOfLines={1} 
        />
       {(!Address || Address?.trim() === "") && errorLoading  ?  <Text style={styles.errorText}>Address is required</Text> : null}
 
        <Text style={styles.label}>Date</Text>
        <DateInput value={invoiceDate} onChange={setInvoiceDate} />
         
       
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
      </ScrollView> 
    
    </SafeAreaView> 
  );  
};

export default React.memo(UpdatePdf);

//colour and amountInwords 