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
  KeyboardAvoidingView,  
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';  
import Button from '../../../components/Button'; 
import Input from '../../../components/Input';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setGeneratedInvoice, setInvoiceList, setToUpdate } from '../../../store/invoices';
import Title from '../../../components/Title';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { calculateTotalAmount, numberToWords } from '../../../constants/categories';
import DateInput from '../../../components/DateInput';

const GenerateInvoiceEdit = ({ route }) => { 
  const navigation = useNavigation()
  const user = useSelector(state => state?.invoices?.user)
  const invoiceList = useSelector(state => state?.invoices?.InvoiceList);

  const dispatch = useDispatch(); 
  const isFocused = useIsFocused();
  const [Installation,setInstallation] = useState(invoiceList?.Installation)
  const [Transportation,setTransportation] = useState(invoiceList?.Transportation) 
  const [discountValue, setDiscountValue] = useState("")
  const [Discount,setDiscount] = useState(invoiceList?.Discount)  
  const [selectedWarranty, setSelectedWarranty] = useState(invoiceList?.selectedWarranty);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState(invoiceList?.selectedPaymentPlan);
  const [selectedVAT, setSelectedVAT] = useState(invoiceList?.selectedVAT) 
  const [DeliveryPeriod,setDeliveryPeriod] = useState(invoiceList?.DeliveryPeriod) 
  const [Note,setNote] = useState(invoiceList?.Note)
  const [loading, setLoading] = useState(false);
  const [errorLoading,SetErrorLoading] = useState(false) 
  const [Companyname, setCompanyname] = useState(invoiceList?.CompanyName);
  const [Address, setAddress] = useState(invoiceList?.Address);
  const [invoiceDate, setInvoiceDate] =  useState(invoiceList?.Date.toDate()); 
  const [invoiceType, setInvoiceType] = useState(invoiceList?.invoiceType);
  const [Attention, setAttention] = useState(invoiceList?.Attention);   


 let subTotal = Math.ceil(calculateTotalAmount(invoiceList?.Product))  

 

 useEffect(() => {
    if (isFocused) {
        // Update the state with new route params
        setInstallation(invoiceList?.Installation);
        setTransportation(invoiceList?.Transportation);
        setSelectedWarranty(invoiceList?.selectedWarranty)
        setSelectedPaymentPlan(invoiceList?.selectedPaymentPlan)
        setDeliveryPeriod(invoiceList?.DeliveryPeriod)
        setNote(invoiceList?.Note) 
        setInvoiceDate(invoiceList?.Date.toDate()) 
        setCompanyname(invoiceList?.CompanyName)
        setAddress(invoiceList?.Address)
        setInvoiceType(invoiceList?.invoiceType)
        setAttention(invoiceList?.Attention)  
        setDiscount(invoiceList?.Discount)

        subTotal = Math.ceil(calculateTotalAmount(invoiceList?.Product))  
    }
}, [isFocused, route.params]);

useEffect(() => {
    const calculateDiscount = () => {
   let discount = subTotal * (parseFloat(Discount) / 100)
   discount = Math.floor(discount)
   setDiscountValue(discount)
  console.log("discount", discountValue)
    };
    calculateDiscount(); 
  }, [Discount]);

  
const discount =  Discount.trim() !== "" ? subTotal * (parseFloat(Discount) / 100) : 0

let sumTotal = ( parseFloat(subTotal) + parseFloat(Transportation || 0) +  
parseFloat(Installation|| 0));

if (Discount.trim() !== "" || !isNaN(Discount)) {   
   sumTotal -= discount 
} 

let Vat = 0
if(selectedVAT === "Yes") {
  Vat = (7.5/100) * (sumTotal)
}
if(selectedVAT === "No") {
  Vat = 0
}

const GrandTotal = sumTotal + Vat

const AmountInWords = numberToWords(GrandTotal) 


  const setDiscountInput = (discount) => {
    const parsedDiscount = parseFloat(discount);
    if (parsedDiscount > 100 || parsedDiscount < 0) {
      setDiscountValue(100); 
      setDiscount("")
      Alert.alert("Discount must be between 0 and 100")
    } else {
      setDiscountValue(parsedDiscount);
      setDiscount(discount);
    }
  };

   
  
  let transport = "10000"
  let installation = "15000"
  if(subTotal) {
    transport = ((Math.ceil((6/100) * subTotal))).toString()
    installation = ((Math.ceil((4.5/100) * subTotal))).toString()
  }  

  const handleBack = () => {
    navigation.navigate("GeneratedInvoice");
  }; 

  const handleWarrantyChange = (value) => {
    setSelectedWarranty(value);
  };

  const handlePaymentPlan = (value) => {
    setSelectedPaymentPlan(value);
  };

  const handleInvoice = (value) => {
    setInvoiceType(value);
  };

  const handleVAT = (value) => {
    setSelectedVAT(value);
  };
  

  const onSubmit = () => {

    if(invoiceType !== "TECHNICAL PROPOSAL") {
        
      if (!selectedWarranty || !selectedPaymentPlan || !Transportation || !DeliveryPeriod ||
        selectedWarranty?.trim() === '' || selectedPaymentPlan?.trim() === '' || 
        Transportation?.trim() === '' || DeliveryPeriod?.trim() === '' || 
         !Address ||!Attention ||Attention?.trim() === "" || Address?.trim() === "") {
          SetErrorLoading(true);
      Alert.alert('Please complete the invoice form');
      return;    
    }

    } else { 

      if (!Address ||!Attention ||Attention?.trim() === "" || Address?.trim() === "") {
          SetErrorLoading(true);
      Alert.alert('Please complete the invoice form');
      return;    
    }
 
    }



    SetErrorLoading(true)
    setLoading(true);

    firestore()
    .collection('GeneratedInvoice') 
    .doc(invoiceList?.uid)  
    .update({  
      Discount: Discount,
      Installation: Installation,
      Transportation: Transportation, 
      selectedPaymentPlan:selectedPaymentPlan,
      selectedWarranty:selectedWarranty,
      DeliveryPeriod:DeliveryPeriod,
      selectedVAT: selectedVAT,  
      Note: Note,
      CompanyName:Companyname, 
      Address:Address,  
      Attention: Attention,
      invoiceType: invoiceType,
      Date:invoiceDate,
      subTotal:subTotal,
      sumTotal:sumTotal,
      Vat:Vat,
      discountValue:discount,
      AmountInWords:AmountInWords,  
      GrandTotal:GrandTotal,
    })  
      .then(() => {  
        dispatch(setToUpdate()); 
        Alert.alert('Data updated successfully'); 
        setLoading(false);  
        navigation.navigate('GeneratedInvoice'); 
        dispatch(setInvoiceList(invoiceList));       
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

        {invoiceType !== "TECHNICAL PROPOSAL" && (
           <>
                  <Text style={styles.label}>SubTotal</Text> 
            {subTotal > 0 && (<Text style={styles.labelAmount}> {subTotal}</Text>) }

            <Text style={styles.label}>Discount</Text> 
            <Input
                value={Discount} 
                onChangeText={setDiscountInput}
                outlined
                placeholder="22%" 
                keyboardType="numeric" // Add keyboardType prop
              />
            {Discount > 0 && !isNaN(Discount) ? (<Text style={styles.labelDiscount}> Discount: -{discountValue}</Text>) : "" }
              
      <Text style={styles.label}>Transportation</Text> 
              <Input
                value={Transportation}
                onChangeText={setTransportation}
                outlined
                placeholder={transport}
                keyboardType="numeric" // Add keyboardType prop
              />
                {(!Transportation?.trim() === '' ||!Transportation) && errorLoading  ? <Text style={styles.errorText}>Transportation is required</Text> : null} 

        
            <Text style={styles.label}>Installation</Text> 
              <Input  
                value={Installation}
                onChangeText={setInstallation}
                outlined
                placeholder={installation}
                keyboardType="numeric" // Add keyboardType prop
              />


              <Text style={styles.label}>Delivery Period</Text> 
              <Input
                value={DeliveryPeriod}
                onChangeText={setDeliveryPeriod}
                outlined 
                placeholder="21 Days"  
                keyboardType="numeric"
              />
          {(DeliveryPeriod?.trim() === ''  || !DeliveryPeriod) && errorLoading  ? <Text style={styles.errorText}>Delivery Period is required</Text> : null}  
              
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
        
            
            <Text style={styles.label}>Payment Plan</Text>
            <View style={styles.pickerBorder}>
              <Picker
              selectedValue={selectedPaymentPlan} style={styles.picker}
              onValueChange={(itemValue) => handlePaymentPlan(itemValue)}>
              <Picker.Item label="85-15" value="85% UPFRONT PAYMENT AND 15% BALANCE AFTER DELIVERY" />
              <Picker.Item label="75-25" value="75% UPFRONT PAYMENT AND 25% BALANCE AFTER DELIVERY" />
              <Picker.Item label="50-50" value="50% UPFRONT PAYMENT AND 50% BALANCE AFTER DELIVERY" />
              <Picker.Item label="100-0" value="100% Advance Payment Before Delivery" />
              <Picker.Item label="L. P. O" value="L. P. O"/>  
            </Picker> 
            </View>    

            <Text style={styles.label}>VAT</Text>
            <View style={styles.pickerBorder}>
              <Picker
              selectedValue={selectedVAT} style={styles.picker}
              onValueChange={(itemValue) => handleVAT(itemValue)}>
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker> 
            </View>   


            <Text style={styles.label}>Note</Text>  
              <Input
                value={Note}
                onChangeText={setNote} 
                outlined
                placeholder="Enter Note" 
                multiline={true}
                numberOfLines={1} 
              />

           </>
        )}
         

     
        {loading ? (
          <ActivityIndicator /> 
        ) : (
          <Button style={styles.button} type="blue" onPress={onSubmit}>
            <Text>Save </Text> 
          </Button>
        )} 
     
     <Button style={styles.button} type="blue"  onPress={handleBack}> 
            <Text>Cancel</Text> 
          </Button>  

      </ScrollView>
           
    </SafeAreaView>
  );
};

export default React.memo(GenerateInvoiceEdit);

//colour and amountInwords 