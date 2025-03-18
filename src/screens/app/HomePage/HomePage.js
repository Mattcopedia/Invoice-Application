import React, { useCallback, useEffect, useState } from 'react'
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native'
import Header from '../../../components/Header'
import PlusIcon from '../../../components/PlusIcon'
import { setSubTotal } from '../../../store/invoices'
import styles from '../AddTask/styles'

import auth from '@react-native-firebase/auth'
import { useIsFocused } from '@react-navigation/native'


import { useDispatch, useSelector } from 'react-redux'
import CarouselSlider from '../../../components/CarouselSlider/index'
import InvoiceText from '../../../components/invoiceText/invoiceText'
import StatusCard from '../../../components/StatusCard'
import { getWelcomeName } from '../../../constants/categories'
import { setUserName } from '../../../store/invoices'
import { fetchGeneratedInvoice } from '../../../store/redux-thunks/GeneratedInvoiceThunk'
import { fetchInvoiceData } from '../../../store/redux-thunks/InvoiceDataThunk'
import { fetchproductInvoice } from '../../../store/redux-thunks/ProductInvoiceThunk'
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk'
import { fetchProductSelect } from '../../../store/redux-thunks/ProductSelectThunk'
import { fetchReceipt } from '../../../store/redux-thunks/ReceiptThunk'
import { fetchGeneratedRefurbishInvoice } from '../../../store/redux-thunks/RefurbishList'
import { fetchRefurbishSummary } from '../../../store/redux-thunks/RefurbishSummaryThunk'
import { fetchSummaryData } from '../../../store/redux-thunks/SummaryThunk'


 const HomePage = () => {
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const toUpdate = useSelector(state => state.invoices.toUpdate);
    const user = useSelector(state => state?.invoices?.user)
    const invoices = useSelector(state => state?.invoices?.data) 
    const [refreshing, setRefreshing] = useState(false);

    const allProduct = useSelector(state => state?.invoices?.allProduct); 
    const productSelect = useSelector(state => state?.invoices?.productSelect)
    const filterProductSelect = productSelect?.filter(product => product?.invoiceNo === invoices?.invoiceNo)
    const finalProducts = allProduct?.slice().reverse();
    const arrangedProducts = finalProducts?.concat(filterProductSelect) 

    
    const RefurbishInvoiceList = useSelector(state => state?.invoices?.GeneratedRefurbishInvoiceList);
    const receipt = useSelector(state => state?.invoices?.receiptStore);
    const InvoiceList = useSelector(state => state?.invoices?.GeneratedInvoice);
 

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      dispatch(fetchGeneratedRefurbishInvoice(user?.uid)) 
      dispatch(fetchReceipt(user?.uid)) 
      dispatch(fetchGeneratedInvoice(user?.uid))   
      dispatch(fetchProductItem(user?.uid))  
      dispatch(fetchProductSelect(user?.uid))     
      dispatch(fetchInvoiceData(user?.uid)) 
      dispatch(fetchSummaryData(user?.uid))
      dispatch(fetchRefurbishSummary(user?.uid))   
      setRefreshing(false); 
    }, []) 

    const calculateTotalAmount = (items) => {
      // Use reduce to sum up the Amount values
      const totalAmount = items?.reduce((total, item) => total + item.Amount, 0);
      dispatch(setSubTotal(totalAmount))
      return totalAmount; 
    };  

    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(setUserName(user))
      }
    }); 
    
      // Function to extract timestamp from the image path

    useEffect(() => {    
            dispatch(fetchGeneratedRefurbishInvoice(user?.uid))
            dispatch(fetchReceipt(user?.uid)) 
            dispatch(fetchGeneratedInvoice(user?.uid))   
            dispatch(fetchProductItem(user?.uid))  
            dispatch(fetchProductSelect(user?.uid))     
            dispatch(fetchproductInvoice(user?.uid))  
            dispatch(fetchInvoiceData(user?.uid)) 
            dispatch(fetchSummaryData(user?.uid))
            dispatch(fetchRefurbishSummary(user?.uid))
            unsubscribe()   
          calculateTotalAmount(allProduct);

      }, [user, isFocused]);


     
  
    return (

        <SafeAreaView style={styles.container}>
        <Header title="Invoice" />   
    <ScrollView
     refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    > 
    
          <View style={styles.padLeft}>
            <InvoiceText>Welcome, {getWelcomeName()} </InvoiceText>
          </View>
    
         <View style={styles.StatusContainer}>
          <StatusCard label={`Refurbish History`} count={RefurbishInvoiceList?.length} type = "normal" link="GeneratedRefurbishInvoiceList" /> 
          <StatusCard label={` Invoice History`} count={InvoiceList?.length} type = "normal" link="GeneratedInvoiceList"/> 
         </View>

         <View style={styles.StatusContainer}>
          <StatusCard label={`Receipt History`} count={receipt?.length} type = "normal" link="ReceiptPdfList" /> 
          <StatusCard label={`Products`} count={arrangedProducts?.length} type = "normal" link="AllInvoices"/> 
         </View>
    
        </ScrollView>

 <CarouselSlider InvoiceList1 = {InvoiceList} RefurbishInvoiceList1={RefurbishInvoiceList} receiptList1={receipt}/>

        <PlusIcon/>  

         
        </SafeAreaView>  
      )  
}
export default React.memo(HomePage)