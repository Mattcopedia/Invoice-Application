import moment from 'moment';
import React, { useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { setToUpdate } from '../../../store/invoices';
import Title from '../../../components/Title';
import { setinvoiceCreated } from '../../../store/invoices';

const AddTask = ({ navigation }) => {
  const user = useSelector(state => state?.invoices?.user)
  const GoogleUser = useSelector(state =>state?.invoices?.GoogleUser )
const UserName = useSelector(state => state?.invoices?.UserName ) 
  const dispatch = useDispatch();
  const [Companyname, setCompanyname] = useState('');
  const [Address, setAddress] = useState('');
  const [Attention, setAttention] = useState(''); 
  const [invoiceDate, setInvoiceDate] =  useState(new Date()); 
  const [loading, setLoading] = useState(false);
  const [errorLoading,SetErrorLoading] = useState(false)
  const [invoiceType, setInvoiceType] = useState('QUOTATION');
  
 
      
  const handleBack = () => {
    navigation.goBack();
  }; 

  const handleAddProduct = () => {
    navigation.navigate('ProductItem')
  }

  const handleWarrantyChange = (value) => {
    setSelectedWarranty(value);
  };

  const handlePaymentPlan = (value) => {
    setSelectedPaymentPlan(value);
  };

  const handleInvoice = (value) => {
    setInvoiceType(value);
  };



  const GenerateInvoiceNo = () => {
   let currentDate = new Date();
   let monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
   let currentMonthIndex = currentDate.getMonth();
   let currentMonth = monthNames[currentMonthIndex];
   let num1, num2;
   do {
     num1 = Math.floor(Math.random() * 100);
     num2 = Math.floor(Math.random() * 100); 
   } while (num1 === num2); 
   var result = num1.toString()
    const str = "2024" + currentMonth + result
    console.log(str)
    return str
  }
 

 
  const onSubmit = () => {
    if ( !Address ||!Attention  ||Address.trim() ==="" || Attention.trim() === ""  ) {
      Alert.alert('Please complete the invoice form');
      SetErrorLoading(true)
      return;    
    }

    const invoiceNo = GenerateInvoiceNo(); // Generate invoice number here
     
    SetErrorLoading(true)
    setLoading(true);
    firestore()
      .collection('invoices') 
      .add({
        Companyname,
        invoiceDate,
        Address,
        invoiceNo,
        Attention,
        invoiceType,
        userId: user?.uid, 
      })
      .then(() => { 
        setLoading(false);
        SetErrorLoading(false)
        dispatch(setToUpdate()); 
        dispatch(setinvoiceCreated(true)); 
        navigation.navigate('AddProduct');    
        setCompanyname(''); 
        setAddress(""); 
        setInvoiceDate(new Date()); 
        setAttention(""); 
        setInvoiceType("QUOTATION"); 
        Alert.alert("Invoice saved successfully");
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

      <ScrollView>
      <Title type="thin">Fill in the Invoice</Title> 

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
          // ref={CompanynameInputRef}  
          autoFocus={true} 
        />

       <Text style={styles.label}>Attention</Text>
        <Input 
          value={Attention} 
          onChangeText={setAttention}
          outlined 
          placeholder="Type here..."
        />
      {(!Attention || Attention.trim() === "") && errorLoading ? <Text style={styles.errorText}>Attention is required</Text> : null}

        <Text style={styles.label}>Address</Text> 
        <Input
          value={Address}
          onChangeText={setAddress} 
          outlined
          placeholder="Enter Address" 
          multiline={true}
          numberOfLines={1}  
        />
       {(!Address || Address.trim() === "") && errorLoading  ?  <Text style={styles.errorText}>Address is required</Text> : null}
 
        <Text style={styles.label}>Date</Text>
        <DateInput value={invoiceDate} onChange={setInvoiceDate} />
         

        {loading ? (
          <ActivityIndicator /> 
        ) : (
          <Button style={styles.button} type="blue" onPress={onSubmit}>
            <Text>Next </Text> 
          </Button> 
        )} 
{/* 
<Text style={[styles.invoiceText, {textAlign: "center"}]}> Already filled in an invoice,</Text>
          <Button style={styles.button} type="blue" onPress={handleAddProduct}>
            <Text>Add a new Product </Text> 
          </Button>  */}
 
      </ScrollView> 
           
    </SafeAreaView>
  );
};

export default React.memo(AddTask);