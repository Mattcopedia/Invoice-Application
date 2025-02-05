import moment from 'moment';
import React, { useEffect, useState} from 'react';
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
import { setCheckBoxSelectedItem, setRefurbishSummaryLatest, setToUpdate } from '../../../store/invoices';
import { setProductItem } from '../../../store/invoices';
import Title from '../../../components/Title';
import { useIsFocused } from '@react-navigation/native';
import { setAllProduct,setSubTotal } from '../../../store/invoices';
import { calculateTotalAmount } from '../../../constants/categories';
import { fetchRefurbish } from '../../../store/redux-thunks/RefurbishThunk';
import { fetchInvoiceData } from '../../../store/redux-thunks/InvoiceDataThunk';

const RefurbishSummary = ({ navigation }) => { 
  const user = useSelector(state => state?.invoices?.user)
  const refurbishProduct = useSelector(state => state?.invoices?.refurbish);
  const invoice  = useSelector(state => state?.invoices?.invoiceLatest); 
  const dispatch = useDispatch();   
  const isFocused = useIsFocused();
  const [Installation,setInstallation] = useState("")
  const [Transportation,setTransportation] = useState("") 
  const [Discount,setDiscount] = useState("") 
  const [discountValue, setDiscountValue] = useState("")
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('50% UPFRONT PAYMENT AND 50% BALANCE AFTER DELIVERY');
  const [selectedVAT, setSelectedVAT] = useState("Yes")
  const [invoiceDate, setInvoiceDate] =  useState(new Date()); 
  const [loading, setLoading] = useState(false);
  const [errorLoading,SetErrorLoading] = useState(false)
  const [DeliveryPeriod,setDeliveryPeriod] = useState("")
  const [Validity,setValidity] = useState("")
  const [Note,setNote] = useState("")
  const finalProduct = refurbishProduct?.filter(product => product?.invoiceNo === invoice?.invoiceNo)  

 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        dispatch(fetchRefurbish(user?.uid))   
        dispatch(fetchInvoiceData(user?.uid));  
      } catch (error) {
        console.error('Error fetching data:', error)
        Alert.alert('Error', 'Failed to fetch data. Please try again.') 
      } finally { 
        setLoading(false);
      }
    }; 
    fetchData()
    console.log(`invoice`,invoice)
     console.log("finalProduct",finalProduct)
  console.log("refurbishProduct",refurbishProduct)  
  }, [user, dispatch, isFocused])  

  
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
  const number = Number(finalProduct?.[0]?.Amount) 
  console.log("number",number) 

  let transport = "10000"
  let installation = "15000"
  if(finalProduct) {
    transport = ((Math.ceil((6/100) * number))).toString()
    installation = ((Math.ceil((4.5/100) * number))).toString()  
  } 







     
  const handleBack = () => {
    navigation.goBack();
  };  


  const handlePaymentPlan = (value) => {
    setSelectedPaymentPlan(value);
  };
  const handleVAT = (value) => {
    setSelectedVAT(value);
  };


  const onSubmit = () => {
    if ( !selectedPaymentPlan || !Transportation || !DeliveryPeriod || !Validity  || selectedPaymentPlan.trim() === '' || 
      Transportation.trim() === '' || DeliveryPeriod.trim() === '' || Validity.trim() === '') {
        SetErrorLoading(true);
    Alert.alert('Please complete the invoice form');
    return;    
  }

     const data = { 
      DeliveryPeriod,
      selectedPaymentPlan, 
      selectedVAT,
      Installation,
      Transportation,
      Discount,
      Validity,
      invoiceNo:invoice.invoiceNo, 
      createdAt: firestore.FieldValue.serverTimestamp(),
      Note,
      invoiceDate,
      userId: user?.uid,  
    }
    dispatch(setRefurbishSummaryLatest(data));  
    SetErrorLoading(true)
    setLoading(true);
    firestore()
      .collection('RefurbishSummary') 
      .add(data)
      .then(() => { 
        setLoading(false);
        SetErrorLoading(false)
        dispatch(setToUpdate()); 
        navigation.navigate('RefurbishmentPdf');      
        setInvoiceDate(invoiceDate); 
        setDeliveryPeriod(DeliveryPeriod);
        setNote(Note);
        setInstallation(Installation);
        setTransportation(Transportation);
        setDiscount(Discount);
        setSelectedPaymentPlan(selectedPaymentPlan);  
        Alert.alert('Invoice saved successfully');  
        dispatch(setCheckBoxSelectedItem([]))  
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
      <Title type="thin">Refurbish Summary</Title> 


      <Text style={styles.label}>Discount</Text> 
       <Input 
          value={Discount}
          onChangeText={setDiscountInput}
          outlined
          placeholder="22%" 
          keyboardType="numeric" // Add keyboardType prop 
        />
        
        
      <Text style={styles.label}>Transportation</Text> 
        <Input
          value={Transportation}
          onChangeText={setTransportation}
          outlined
          placeholder={transport}
          keyboardType="numeric" 
        />
           {(!Transportation?.trim() === '' ||!Transportation) && errorLoading  ? <Text style={styles.errorText}>Transportation is required</Text> : null} 

  
      <Text style={styles.label}>Installation</Text> 
        <Input 
          value={Installation}
          onChangeText={setInstallation}
          outlined
          placeholder={installation}
          keyboardType="numeric" 
        />

        
<Text style={styles.label}>Validity of Quote</Text> 
        <Input
          value={Validity}
          onChangeText={setValidity}
          outlined 
          placeholder="5 Days"  
          keyboardType="numeric"
        />
     {(Validity.trim() === ''  || !Validity) && errorLoading  ? <Text style={styles.errorText}>Validity of Quote is required</Text> : null}  
        



        <Text style={styles.label}>Delivery Period</Text> 
        <Input
          value={DeliveryPeriod}
          onChangeText={setDeliveryPeriod}
          outlined 
          placeholder="21 Days"  
          keyboardType="numeric"
        />
     {(DeliveryPeriod.trim() === ''  || !DeliveryPeriod) && errorLoading  ? <Text style={styles.errorText}>Delivery Period is required</Text> : null}  
         
   
       
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

        {loading ? (
          <ActivityIndicator /> 
        ) : (
          <Button style={styles.button} type="blue" onPress={onSubmit}>
            <Text>Preview Invoice </Text> 
          </Button>
        )} 

      </ScrollView>
           
    </SafeAreaView>
  );
};

export default React.memo(RefurbishSummary);