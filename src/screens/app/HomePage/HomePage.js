import React, { useEffect } from 'react'
import styles from '../AddTask/styles'
import { SafeAreaView,ScrollView,Text,View} from 'react-native'
import Header from '../../../components/Header'
import PlusIcon from '../../../components/PlusIcon'

import { setSummary } from '../../../store/invoices'
import { setAllProduct,setSubTotal } from '../../../store/invoices'
import { setProductItem } from '../../../store/invoices'

import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import auth from '@react-native-firebase/auth';
import { setUserName } from '../../../store/invoices'
import firestore from '@react-native-firebase/firestore';
import { setInvoices } from '../../../store/invoices'
import InvoiceText from '../../../components/invoiceText/invoiceText'
import storage from '@react-native-firebase/storage'; 
import { setImages } from '../../../store/invoices'
import { extractTimestamp, getWelcomeName } from '../../../constants/categories'
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk'


 const HomePage = () => {
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const toUpdate = useSelector(state => state.invoices.toUpdate);
    const user = useSelector(state => state?.invoices?.user)
    const invoices = useSelector(state => state?.invoices?.data)
    const summary = useSelector(state => state?.invoices?.summary)
    const allProduct = useSelector(state => state?.invoices?.allProduct);
    const ProductItem = useSelector(state => state?.invoices?.ProductItem) 
    const images =  useSelector(state => state.invoices.images);   
    const subTotal = useSelector(state => state?.invoices?.subTotal)


    const calculateTotalAmount = (items) => {
      // Use reduce to sum up the Amount values
      const totalAmount = items?.reduce((total, item) => total + item.Amount, 0);
      dispatch(setSubTotal(totalAmount))
      return totalAmount; 
    };  

    const getSampleImage = async () => {
      try { 
        const storageRef = storage().ref(`${user?.uid}/images`);  
        const imagesList = await storageRef.listAll();
        const sortedImages = imagesList.items.sort((a, b) => {
          const timestampA = extractTimestamp(a.path);
          const timestampB = extractTimestamp(b.path);
          return timestampB - timestampA;
        });
        const latestImage = sortedImages[0];
        const uri = await latestImage?.getDownloadURL(); 
        dispatch(setImages(uri));    
      } catch (error) {
        console.error('Error getting image:', error);
        return null;
      }
    }
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(setUserName(user))
      }
    }); 
    
      // Function to extract timestamp from the image path

    useEffect(() => {   
        firestore() 
            .collection('Summary') 
            .where('userId', '==', user?.uid)
            .get() 
            .then(querySnapshot => {
                const newSummary = []; 
                querySnapshot.forEach(documentSnapshot => {
                  newSummary.push({
                    uid: documentSnapshot.id,
                    ...(documentSnapshot.data() || {}),
                  }); 
                });
               
                //function to get the latest invoice. 
          const sortedSummary =  newSummary.sort((a, b) => b.invoiceDate - a.invoiceDate);
                 dispatch(setSummary(sortedSummary[0]));    
            });       
      }, [user, dispatch, isFocused]);


      useEffect(() => {   
        firestore() 
            .collection('ProductItem') 
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
                dispatch(setProductItem(sortedProducts[0]));
                dispatch(setAllProduct(sortedProducts)); 

            });       
      }, [user, dispatch, isFocused]);
  
    
      useEffect(() => {  
            firestore() 
                .collection('invoices')
                .where('userId', '==', user?.uid)
                .get()
                .then(querySnapshot => {
                    const newInvoices = [];
    
                    querySnapshot.forEach(documentSnapshot => {
                      newInvoices.push({
                        uid: documentSnapshot.id,
                        ...(documentSnapshot.data() || {}),
                      }); 
                    });
                   
                    //function to get the latest invoice. 
              const sortedInvoices =  newInvoices.sort((a, b) => b.invoiceDate - a.invoiceDate);      
                     dispatch(setInvoices(sortedInvoices[0]));    
                });       
              
               getSampleImage() 
                unsubscribe() 
              calculateTotalAmount(allProduct);
    }, [user, toUpdate, dispatch,isFocused]);
  
    return (

        <SafeAreaView style={styles.container}>
        <Header title="Invoice" />  
    <ScrollView> 
    
          <View style={styles.padLeft}>
            <InvoiceText>Welcome, {getWelcomeName()} </InvoiceText>
          </View>
    
        {/* <Text style={styles.text1}>Fill out an invoice form and then add a new product</Text> */}
    
        </ScrollView>
        <PlusIcon/>  
         
        </SafeAreaView>  
      )  
}
export default React.memo(HomePage)