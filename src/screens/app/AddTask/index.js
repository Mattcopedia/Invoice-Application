import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/Button';
import DateInput from '../../../components/DateInput';
import Input from '../../../components/Input';
import Title from '../../../components/Title';
import { GenerateInvoiceNo } from '../../../constants/categories';
import colors from '../../../constants/colors';
import { setCheckBoxSelectedItem, setinvoiceCreated, setInvoiceLatest, setSelectedItem, setSelectField, setToUpdate } from '../../../store/invoices';
import styles from './styles';

import { fetchInvoiceData } from '../../../store/redux-thunks/InvoiceDataThunk';

export const imagePath = "https://png.pngtree.com/png-clipart/20200225/original/pngtree-image-upload-icon-photo-upload-icon-png-image_5279796.jpg"

export const items = [   
  {  id: '1', label: 'Mat/Velvet Fabric',  Description: '', Quantity: "1", UnitPrice: '', Amount: '' , Warranty:'NO WARRANTY'} ,
  {  id: '2', label: 'Suede Fabric',  Description: '', Quantity: "1", UnitPrice: '', Amount: '' , Warranty:'NO WARRANTY'} ,
  {  id: '3', label: 'Synthetic Leather',  Description: '', Quantity: "1", UnitPrice: '', Amount: '' , Warranty:'NO WARRANTY'} ,
  {  id: '4', label: 'Semi Animal Skin Leather',  Description: '', Quantity: "1", UnitPrice: '', Amount: '' , Warranty:'NO WARRANTY'} ,
  {  id: '5', label: 'Animal Skin Leather',  Description: '', Quantity: "1", UnitPrice: '', Amount: '' , Warranty:'NO WARRANTY'} ,
]; 
  
 export const labelOrder = ['Mat/Velvet Fabric', 'Suede Fabric', 'Synthetic Leather', 'Semi Animal Skin Leather', 'Animal Skin Leather'];

    
const AddTask = ({ navigation }) => {
  const user = useSelector(state => state?.invoices?.user) 
  
  const isFocused = useIsFocused();
  const selectedItems = useSelector(state => state?.invoices?.checkBoxSelectedItems) 
  const dispatch = useDispatch();
  const [Companyname, setCompanyname] = useState('');
  const [Address, setAddress] = useState('');
  const [Email, setEmail] = useState('');
  const [Attention, setAttention] = useState(''); 
  const [phoneNumber, setphoneNumber] = useState(''); 
  const [invoiceDate, setInvoiceDate] =  useState(new Date()); 
  const [loading, setLoading] = useState(false);
  const [errorLoading,SetErrorLoading] = useState(false)
  const [invoiceType, setInvoiceType] = useState('QUOTATION');
  const [refurbish, setRefurbish] = useState('NO');
   
  
  useEffect(() => {
    if (isFocused) { 
      dispatch(setCheckBoxSelectedItem([])); 
      dispatch(fetchInvoiceData(user?.uid));  
    }
}, [isFocused]); 
  
const handleSelection = (item) => {
  let updatedSelection;
  if (selectedItems.some(selected => selected.label === item.label)) {
    updatedSelection = selectedItems.filter(selected => selected.label !== item.label);
  } else {
    updatedSelection = [...selectedItems, item];
  }
  updatedSelection.sort((a, b) => labelOrder.indexOf(a.label) - labelOrder.indexOf(b.label));
  dispatch(setCheckBoxSelectedItem(updatedSelection));   
};

  const handleBack = () => {
    navigation.goBack();
  }; 

  const handleInvoice = (value) => { 
    setInvoiceType(value);
  };

  const handleRefurbish = (value) => {
    setRefurbish(value) 
  };


 

 
  const onSubmit = () => {
    if (!Attention || Attention.trim() === "" ) {
      Alert.alert('Please complete the invoice form')
      SetErrorLoading(true) 
      return;      
    }

    if ( refurbish.trim() === "YES" && selectedItems.length === 0 ) {
      Alert.alert('Please select an item')
      return;        
    }
    const invoiceNo = GenerateInvoiceNo(); // Generate invoice number here

  const data = {
    Companyname,
    invoiceDate, 
    createdAt: firestore.FieldValue.serverTimestamp(), 
    Address,
    Email, 
    invoiceNo, 
    Attention, 
    phoneNumber, 
    invoiceType, 
    userId: user?.uid,   
  }

    dispatch(setInvoiceLatest(data));  

    SetErrorLoading(true)
    setLoading(true);
    firestore()
      .collection('invoices') 
      .add(data)
      .then(() => { 
        setLoading(false);
        SetErrorLoading(false)
        dispatch(setToUpdate()); 
        dispatch(setinvoiceCreated(true)); 
    
        if( refurbish.trim() === "YES" ) {
          navigation.navigate('RefurbishProduct')   
        } else { 
          navigation.navigate('AddProduct')
        }    
        setCompanyname(Companyname);  
        setAddress(Address); 
        setInvoiceDate(invoiceDate);
        setEmail(Email); 
        setAttention(Attention); 
        setInvoiceType(invoiceType); 
        setphoneNumber(phoneNumber)
        setRefurbish(refurbish)
        dispatch(setSelectedItem([]))  
        dispatch(setSelectField([])) 
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
    <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }} >

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>

      <Pressable style={styles.backContainer} hitSlop={8} onPress={handleBack}>
        <Image
          style={styles.backIcon}
          source={require('../../../assets/back.png')}
        />
      </Pressable> 
  
      <FlatList
        data={refurbish.trim() === "YES" ? items : []} // Use the list conditionally
        keyExtractor={(item) => item?.id}
         keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          refurbish.trim() === "YES" && (
            <TouchableOpacity
              onPress={() => handleSelection(item)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                backgroundColor: selectedItems?.includes(item)
                  ? colors.grey
                  : '#fff',
                borderRadius: 5,
                marginBottom: 5,
              }}
            >
              <Text style={{ marginRight: 10 }}>
                {selectedItems?.includes(item) ? '✓' : '◻'}
              </Text>
              <Text style={styles.textRef}>{item.label}</Text>  
            </TouchableOpacity>
          )
        )}
        ListHeaderComponent={ 
          <>
            <Title type="thin">Fill in the Invoice</Title>
  
            <Text style={styles.label}>Invoice Type</Text>
            <View style={styles.pickerBorder}>
              <Picker
                selectedValue={invoiceType}
                style={styles.picker}
                onValueChange={(itemValue) => handleInvoice(itemValue)}
              >
                <Picker.Item label="QUOTATION" value="QUOTATION" />
                <Picker.Item label="PROFORMA INVOICE" value="PROFORMA INVOICE" />
                <Picker.Item label="INVOICE" value="INVOICE" />
                <Picker.Item label="TECHNICAL PROPOSAL" value="TECHNICAL PROPOSAL" />
              </Picker>
            </View>
  
            <Text style={styles.label}>Refurbish Product</Text>
            <View style={styles.pickerBorder}>
              <Picker
                selectedValue={refurbish}
                style={styles.picker}
                onValueChange={(itemValue) => handleRefurbish(itemValue)}
              >
                <Picker.Item label="YES" value="YES" />
                <Picker.Item label="NO" value="NO" />
              </Picker>
            </View>
          </>
        }
        ListFooterComponent={
          <>
              <View>  
            <Text style={styles.label}>Company name</Text>
            <Input
              value={Companyname} 
              onChangeText={setCompanyname}
              outlined 
              placeholder=""
              autoFocus={true}
            />
            </View>  
  
            <Text style={styles.label}>Attention</Text>
            <Input
              value={Attention}
              onChangeText={setAttention}
              outlined
              placeholder=""
            />
            {(!Attention || Attention.trim() === "") && errorLoading ? (
              <Text style={styles.errorText}>Attention is required</Text>
            ) : null}

              <View> 
                     <Text style={styles.label}>Phone Number</Text>
                     <Input
                       value={phoneNumber}
                       onChangeText={setphoneNumber}
                       outlined
                       placeholder=""
                       keyboardType="numeric"
                     />
                
                     </View>   

                     <Text style={styles.label}>Email address</Text>
            <Input
              value={Email}
              onChangeText={setEmail}
              outlined 
              placeholder="Enter Email"
              multiline={true}
              numberOfLines={1}
            /> 
  
  
            <Text style={styles.label}>Address</Text>
            <Input
              value={Address}
              onChangeText={setAddress}
              outlined
              placeholder="Enter Address"
              multiline={true}
              numberOfLines={1}
            /> 
      
  
            <Text style={styles.label}>Date</Text>
            <DateInput value={invoiceDate} onChange={setInvoiceDate} />
  
            {loading ? (
              <ActivityIndicator />
            ) : (
              <View>
              <Button style={styles.button} type="blue" onPress={onSubmit}>
                <Text>Next </Text>
              </Button>
          
             </View>
            )}
          </>
        }
      /> 
         </View> 
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView> 
    </SafeAreaView>
  ); 
  
};

export default React.memo(AddTask);