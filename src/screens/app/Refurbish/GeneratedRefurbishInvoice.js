import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ImageBackground, RefreshControl, SafeAreaView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import InvoiceText from '../../../components/invoiceText/invoiceText';
import { convertDate, DuplicateInvoiceRefurb, getWelcomeName } from '../../../constants/categories';
import { createPDF2 } from '../../../constants/helperFunctions';
import { pdfContent4, pdfContent5 } from '../../../constants/htmlContent';
import { refubishStylesFabric } from '../../../constants/refubishStylesFabric';
import { refurbishStyles } from '../../../constants/refurbishStyles';
import { setGeneratedRefurbishInvoiceList, setRefurbishInvoiceList, setUserName } from '../../../store/invoices';
import { fetchGeneratedRefurbishInvoice } from '../../../store/redux-thunks/RefurbishList';
import { fetchRefurbish } from '../../../store/redux-thunks/RefurbishThunk';
import styles from './styles';

  
 
const GeneratedRefurbishInvoice = ({ route }) => {  
  const user = useSelector((state) => state?.invoices?.user);
  const localInvoiceList = useSelector((state) => state?.invoices?.RefurbishInvoiceList);
  const [invoiceList, setLocalInvoiceList] = useState(localInvoiceList);
  const GoogleUser = useSelector(state => state?.invoices?.GoogleUser);
  const UserName = useSelector(state => state?.invoices?.UserName);
  const [refreshing, setRefreshing] = useState(false);
  const [count, setCount] = useState(1);
  const navigation = useNavigation(); 
  const dispatch = useDispatch();
  const isFocused = useIsFocused();  
  const dateFormatted = convertDate(invoiceList?.Date.toDate())    

  const finalSortedArray = Object.values(
    invoiceList?.Product.reduce((acc, product) => {
      const { label } = product;
   
      if (!acc[label]) {
        acc[label] = {
          label: label,
          Product: []
        };
      }
  
      acc[label].Product.push({...product,});
  
      return acc;
    }, {})
  );

  const imageUris = invoiceList?.Product.map(product => product.ImageUri);
  const allSameImageUri = imageUris.every(uri => uri === imageUris[0]);
  const updatedList = {...invoiceList}
  updatedList.Product = finalSortedArray   
  const finalInvoiceList = {...updatedList}  

  console.log(`finalInvoiceList3`,finalInvoiceList)

   
  const handleNavigateEditInvoice = () => { 
    dispatch(setRefurbishInvoiceList(invoiceList));   
    navigation.navigate('GeneratedRefurbishInvoiceEdit')
  }  

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUserName(user));
      }
    }); 
    return () => unsubscribe();
  }, [user]);

  const fetchInvoices = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('GeneratedRefurbishInvoice') 
        .where('userId', '==', user?.uid)
        .get();

      const newProductItem = [];
      querySnapshot.forEach((documentSnapshot) => {
        newProductItem.push({
          uid: documentSnapshot.id,
          ...(documentSnapshot.data() || {}),
        });
      });

      const sortedGeneratedInvoice = newProductItem.sort((a, b) => b.invoiceDate - a.invoiceDate);
      const targetInvoice = sortedGeneratedInvoice.find((invoice) => invoice.uid === invoiceList.uid);
      dispatch(setGeneratedRefurbishInvoiceList(targetInvoice));
      setLocalInvoiceList(targetInvoice);
    } catch (error) {
      console.error('Error fetching invoices:', error);  
    }
  }   

  useEffect(() => {
    if (isFocused) { 
      fetchInvoices();
    } 
  }, [isFocused, user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchInvoices();
    setRefreshing(false);
  }, [fetchInvoices]);


 const getName = () => {
  
    if (GoogleUser?.name) {
      return `<p class="color">Sales Rep.: ${GoogleUser?.name}</p>`;
    }
  
    if (UserName?.displayName) { 
      return `<p class="color">Sales Rep.: ${UserName?.displayName}</p>`;
    }
  
    return ''; 
  }


      
    const htmlContentPage = `
         <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="shortcut icon" type="image/png" href="/icon.png" /> 
    
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
    
      <style> 
          ${ allSameImageUri ? refurbishStyles : refubishStylesFabric}  
        </style>  
      </head>
    
    
                <body> 
       ${ allSameImageUri ? 
        pdfContent4(invoiceList,dateFormatted,getName,getWelcomeName)?.join('') :
       pdfContent5(finalInvoiceList,invoiceList,dateFormatted,getName,getWelcomeName)?.join('')}   

              </body>  
            </html>
    
     ` 
  

const item2 = invoiceList

const handleDelete = async () => {
  try {
 await firestore()
  .collection('GeneratedRefurbishInvoice') 
  .doc(item2?.uid)   
  .delete() 
  .then(() => {  
      console.log("Invoice Deleted!")
       dispatch(fetchGeneratedRefurbishInvoice(user?.uid))  
      navigation.navigate("GeneratedRefurbishInvoiceList")    
  }); 
     
  } catch (error) {
      console.error("Error deleting product: ", error);
  }
};


const DuplicateInvoice2 = async (invoiceList) => {
  DuplicateInvoiceRefurb(invoiceList) 
   dispatch(fetchGeneratedRefurbishInvoice(user?.uid))   
 navigation.navigate("GeneratedRefurbishInvoiceList")      
} 
  
const generatePDF = () => {
  createPDF2(invoiceList,htmlContentPage,count,setCount,true) 
      dispatch(fetchRefurbish(user?.uid));   
}

  return (
    <SafeAreaView style={styles.container} key={invoiceList?.uid || 'default'}>
         <Header title={`${invoiceList?.Attention} Invoice`}   />   
         <Text style={styles.invoiceText2}>Welcome, {getWelcomeName()} </Text>
         <FlatList
             data={invoiceList?.Product} 
             key={`${invoiceList?.Paid}`}    
            // extraData={{ Paid: invoiceList?.Paid, invoiceType: invoiceList?.invoiceType }}    
             keyExtractor={(item,index) => item.uid || index.toString()} 
          ListHeaderComponent={() => ( 
            <View style={[styles.padLeft, styles.stickyHeader]}>  
            <Text style={styles.titleProduct}>Product Details</Text>
          </View> 
          )} 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }

          ListFooterComponent={() => ( 
             <>
            <View style={styles.container}>   
            <Text style={styles.titleProduct}>Invoice Details</Text>
 
            <Text style={styles.invoiceText}>Date</Text>
           <InvoiceText>
              {dateFormatted} 
           </InvoiceText>
 
           <Text style={styles.invoiceText}>Invoice No</Text>
           <InvoiceText>
              {invoiceList?.invoiceNo}
           </InvoiceText> 
 
           <Text style={styles.invoiceText}>Invoice Type</Text>
           <InvoiceText>
              {invoiceList?.invoiceType}
           </InvoiceText>

               
      
 
           {invoiceList?.CompanyName?.trim() !== "" && (
             <View>
            <Text style={styles?.invoiceText}>Company name</Text>
            <InvoiceText>
            {invoiceList?.CompanyName}
            </InvoiceText> 
            </View>
           ) 
           }
 
           <Text style={styles.invoiceText}>Attention</Text>
           <InvoiceText>
              {invoiceList?.Attention} 
           </InvoiceText>

       

           {(!invoiceList?.CompanyName || invoiceList?.CompanyName?.trim() === "") && (
                  <View>
                <Text style={styles.invoiceText}>Phone Number</Text>
                <InvoiceText>
                  {invoiceList?.phoneNumber}
                </InvoiceText>
                  </View>
                )}

          {(invoiceList?.Email || invoiceList?.Email?.trim() !== "") && (
                                <View>
                                 <Text style={styles.invoiceText}>Email address</Text>
                                        <InvoiceText>
                                          {invoiceList?.Email}
                                        </InvoiceText>
                                          </View>   
                                        )}  
          
         
           <Text style={styles.invoiceText}>Address</Text>
           <InvoiceText>
              {invoiceList?.Address}
           </InvoiceText>

           {invoiceList?.invoiceType !== "TECHNICAL PROPOSAL"  &&  (
            <>
               <Text style={styles.invoiceText}>Payment Terms</Text>
           <InvoiceText>
              {invoiceList?.selectedPaymentPlan}
           </InvoiceText>
 
         
           {invoiceList?.Discount?.trim() !== "" && (
                  <View>

                <Text style={styles?.invoiceText}>DISCOUNT</Text>
                {invoiceList?.Discount?.trim() !== "0" ? (  
                  <InvoiceText>
                {invoiceList?.Discount}%
                </InvoiceText> ) :
               (  <InvoiceText>  
                     N/A
                </InvoiceText> )
                }  
 
                </View>
                ) 
                }

                <Text style={styles?.invoiceText}>Installation</Text>

                {invoiceList?.Installation?.trim() !== "0" ? (  
                  <InvoiceText>
                ₦{invoiceList?.Installation}
                </InvoiceText> ) : 
              (  <InvoiceText>
                     FREE
                </InvoiceText> )
                } 

                <Text style={styles?.invoiceText}>Transportation</Text>
                {invoiceList?.Transportation?.trim() !== "0" ? (  
                  <InvoiceText>
                ₦{invoiceList?.Transportation}
                </InvoiceText> ) :
               (  <InvoiceText>
                     FREE
                </InvoiceText> ) 
                }  
  
       
           <Text style={styles?.invoiceText}>Delivery Period</Text>
           <InvoiceText>
            {invoiceList?.DeliveryPeriod} DAYS
           </InvoiceText> 
 
           <Text style={styles?.invoiceText}>Validity of Quote</Text>
           <InvoiceText>
           {invoiceList?.Validity} DAYS 
           </InvoiceText> 

           {invoiceList?.Note?.trim() !== "" && (
             <View>
            <Text style={styles?.invoiceText}>Note</Text>
            <InvoiceText> 
            {invoiceList?.Note} 
            </InvoiceText> 
            </View>
           ) 
           }
            
           
            </>
  )}
 
            <View>
            <Text style={styles?.invoiceText}>Paid</Text>
            <InvoiceText>
            {invoiceList?.Paid} 
            </InvoiceText> 
            </View>
        
           <Button style={styles.button} type="blue" onPress={generatePDF}>
                  <Text>View Invoice</Text>    
                </Button> 
          
                <Button style={styles.button} type="blue" onPress={() => DuplicateInvoice2(invoiceList)}>
                  <Text>Duplicate Invoice</Text>   
                </Button>   

                <Button style={styles.button} type="blue" onPress={handleNavigateEditInvoice}>
                  <Text>Edit Invoice</Text>   
                </Button>    

                {invoiceList?.Paid === "Yes" && invoiceList?.invoiceType === "INVOICE"  &&  (
                  <View>
                    <Button style={styles.button} type="blue" onPress={() => navigation.navigate('ReceiptForm', { item2 })}>
                  <Text>Create Receipt</Text>   
                </Button>  
                  </View>  
                )}


          <Button style={styles.button} del="red"  onPress={handleDelete}> 
            <Text>Delete</Text> 
          </Button> 

          </View> 
          </> 
          )}
          renderItem={({ item, index }) => (
            
            <View style={styles.containerProduct}>   
              <Text style={styles.label2}>{item.label}</Text> 
        <View style={styles.Photo}>  
       <ImageBackground source={{ uri:item?.ImageUri }} style={styles.imageBackgroundFlat}>
       </ImageBackground>  
       </View> 
              
              <Text style={styles.invoiceText}>Description</Text>
        <InvoiceText>
          {item?.Description}
        </InvoiceText>  
    
                        <View>
                      <Text style={styles.invoiceText}>Quantity</Text>
                    <InvoiceText>
                    {item?.Quantity}
                    </InvoiceText> 
                        </View> 
                       
         
        <Text style={styles?.invoiceText}>Unit Price</Text>
        <InvoiceText>
        ₦{item?.UnitPrice}
        </InvoiceText> 

                        <View>
                       <Text style={styles?.invoiceText}>Amount</Text>
                      <InvoiceText>
                      ₦{item?.Amount}
                      </InvoiceText> 
                        </View> 

                        <View>
                       <Text style={styles?.invoiceText}>Warranty</Text>
                      <InvoiceText>
                      ₦{item?.Warranty}   
                      </InvoiceText> 
                        </View> 


     

        <Button style={styles.button} type="blue" onPress={() => navigation.navigate('GeneratedRefurbishProductEdit', { item,item2})}>
                  <Text>Edit Product</Text>   
                </Button> 

            </View>
          )} 
        />     

    </SafeAreaView>   
  ) 
}
 
export default React.memo(GeneratedRefurbishInvoice)

