import moment from 'moment';
import React, { useEffect, useState} from 'react';
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
import { setAddProduct, setSelectedItem, setToUpdate } from '../../../store/invoices';
import { setProductItem } from '../../../store/invoices';
import Title from '../../../components/Title';
import { useIsFocused } from '@react-navigation/native';
import { setAllProduct,setSubTotal } from '../../../store/invoices';
import { calculateTotalAmount } from '../../../constants/categories';

const Summary = ({ navigation }) => { 
  const user = useSelector(state => state?.invoices?.user)
  const allProduct = useSelector(state => state?.invoices?.addProduct);
  const invoice  = useSelector(state => state?.invoices?.data); 
  const dispatch = useDispatch(); 
  const isFocused = useIsFocused();
  const [Installation,setInstallation] = useState("")
  const [Transportation,setTransportation] = useState("") 
  const [Discount,setDiscount] = useState("") 
  const [discountValue, setDiscountValue] = useState("")
  const [selectedWarranty, setSelectedWarranty] = useState('NO WARRANTY');
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('50% UPFRONT PAYMENT AND 50% BALANCE AFTER DELIVERY');
  const [selectedVAT, setSelectedVAT] = useState("Yes")
  const [invoiceDate, setInvoiceDate] =  useState(new Date()); 
  const [loading, setLoading] = useState(false);
  const [errorLoading,SetErrorLoading] = useState(false)
  const [DeliveryPeriod,setDeliveryPeriod] = useState("")
  const [Note,setNote] = useState("")
  

  const selectedItem  = useSelector(state => state?.invoices?.selectedItem); 
  const filterselectedProducts = selectedItem?.filter(product => product?.invoiceNo === invoice?.invoiceNo)
  const filteredProducts = allProduct?.filter(product => product?.invoiceNo === invoice?.invoiceNo)
  const arrangedProducts = filteredProducts?.slice().reverse();  
  const finalProduct = filterselectedProducts.concat(arrangedProducts); 

  let subTotal = Math.ceil(calculateTotalAmount(finalProduct))   
   
  useEffect(() => {   
    firestore()  
        .collection('ProductInvoice') 
        .where('userId', '==', user?.uid)
        .get() 
        .then(querySnapshot => {
            const newProductItem = []; 
            querySnapshot.forEach(documentSnapshot => {
              newProductItem.push({
                uid: documentSnapshot.id,
                ...(documentSnapshot.data() || {}),
              }); 
            });
           
            const sortedProducts = newProductItem.sort((a, b) => b.invoiceDate - a.invoiceDate);
            dispatch(setAddProduct(sortedProducts));   
        });       

       subTotal = Math.ceil(calculateTotalAmount(finalProduct))   
  }, [user, dispatch, isFocused]); 

  useEffect(() => {   
    firestore() 
        .collection('SelectedItem') 
        .where('userId', '==', user?.uid)
        .get() 
        .then(querySnapshot => {
            const newProductItem = []; 
            querySnapshot.forEach(documentSnapshot => {
              newProductItem.push({
                uid: documentSnapshot.id, 
                ...(documentSnapshot.data() || {}),
              }); 
            }); 
           
            const sortedProducts = newProductItem.sort((a, b) => b.invoiceDate - a.invoiceDate);
            dispatch(setSelectedItem(sortedProducts));   
        });       
        subTotal = Math.ceil(calculateTotalAmount(finalProduct)) 
  }, [user, dispatch, isFocused]);
  

  
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



  useEffect(() => {
    const calculateDiscount = () => {
   let discount = subTotal * (parseFloat(Discount) / 100)
   discount = Math.floor(discount)
   setDiscountValue(discount)
  console.log("discount", discountValue)
    };
    calculateDiscount(); 
  }, [Discount]);



     
  const handleBack = () => {
    navigation.goBack();
  };  

  const handleWarrantyChange = (value) => {
    setSelectedWarranty(value);
  };

  const handlePaymentPlan = (value) => {
    setSelectedPaymentPlan(value);
  };
  const handleVAT = (value) => {
    setSelectedVAT(value);
  };


  const onSubmit = () => {
    if (!selectedWarranty || !selectedPaymentPlan || !Transportation || !DeliveryPeriod ||
      selectedWarranty.trim() === '' || selectedPaymentPlan.trim() === '' || 
      Transportation.trim() === '' || DeliveryPeriod.trim() === '') {
        SetErrorLoading(true);
    Alert.alert('Please complete the invoice form');
    return;    
  }

     
    SetErrorLoading(true)
    setLoading(true);
    firestore()
      .collection('Summary') 
      .add({ 
        DeliveryPeriod,
        selectedPaymentPlan, 
        selectedWarranty,
        selectedVAT,
        Installation,
        Transportation,
        Discount,
        invoiceNo:invoice.invoiceNo, 
        Note,
        invoiceDate,
        userId: user?.uid,  
      })
      .then(() => { 
        setLoading(false);
        SetErrorLoading(false)
        dispatch(setToUpdate()); 
        navigation.navigate('ExportPdf');    
        setInvoiceDate(new Date()); 
        setDeliveryPeriod("");
        setNote("");
        setInstallation("");
        setTransportation("");
        setDiscount("");
        setSelectedWarranty("NO WARRANTY");;
        setSelectedPaymentPlan("50% UPFRONT PAYMENT AND 50% BALANCE AFTER DELIVERY");  
        Alert.alert('Invoice saved successfully');
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
      <Title type="thin">Summary</Title> 

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
      {Discount > 0 && (<Text style={styles.labelDiscount}> Discount: -{discountValue}</Text>) }
        
        
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


        <Text style={styles.label}>Delivery Period</Text> 
        <Input
          value={DeliveryPeriod}
          onChangeText={setDeliveryPeriod}
          outlined 
          placeholder="21 Days"  
          keyboardType="numeric"
        />
     {(DeliveryPeriod.trim() === ''  || !DeliveryPeriod) && errorLoading  ? <Text style={styles.errorText}>Delivery Period is required</Text> : null}  
         
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

export default React.memo(Summary);