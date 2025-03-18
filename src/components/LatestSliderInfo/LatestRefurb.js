import auth from '@react-native-firebase/auth';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ImageBackground, RefreshControl, SafeAreaView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { convertDate, getWelcomeName } from '../../constants/categories';
import { createPDF2 } from '../../constants/helperFunctions';
import { pdfContent4, pdfContent5 } from '../../constants/htmlContent';
import { refubishStylesFabric } from '../../constants/refubishStylesFabric';
import { refurbishStyles } from '../../constants/refurbishStyles';
import styles from '../../screens/app/Refurbish/styles';
import { setUserName } from '../../store/invoices';
import Button from '../Button';
import Header from '../Header';
import InvoiceText from '../invoiceText/invoiceText';
  
  
 
const LatestRefurbishInvoice = ({ route }) => {  
  const user = useSelector((state) => state?.invoices?.user);
  const invoiceList = route.params.InvoiceList  
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



  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUserName(user));
      }
    }); 
    return () => unsubscribe();
  }, [user]);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);


 const getName = () => {
  
    if (GoogleUser?.name) {
      return `<p class="color">Sales Rep.: ${GoogleUser?.name}</p>`;
    }
  
    if (UserName?.displayName) { 
      return `<p class="color">Sales Rep.: ${UserName?.displayName}</p>`;
    }
  
    return ''; 
  }

  const imageUris = invoiceList?.Product.map(product => product.ImageUri);
  const allSameImageUri = imageUris.every(uri => uri === imageUris[0]);
  const updatedList = {...invoiceList}
  updatedList.Product = finalSortedArray   
  const finalInvoiceList = {...updatedList}      
      
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
 
  
const generatePDF = () => {
  createPDF2(invoiceList,htmlContentPage,count,setCount,true) 
}

  return (
    <SafeAreaView style={styles.container} key={invoiceList?.uid || 'default'}>
         <Header title={`${invoiceList?.Attention} Invoice`}   />   
         <Text style={styles.invoiceText2}>Welcome, {getWelcomeName()} </Text>
         <FlatList
             data={invoiceList?.Product} 
             key={`${invoiceList?.Paid}`}    
             keyExtractor={(item) => item.uid || index.toString()} 
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

       

           {(!invoiceList?.CompanyName || invoiceList?.CompanyName.trim() === "") && (
                  <View>
                <Text style={styles.invoiceText}>Phone Number</Text>
                <InvoiceText>
                  {invoiceList?.phoneNumber}
                </InvoiceText>
                  </View>
                )}

          {(invoiceList?.Email || invoiceList?.Email.trim() !== "") && (
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




            </View>
          )} 
        />     

    </SafeAreaView>   
  ) 
}

export default React.memo(LatestRefurbishInvoice)

