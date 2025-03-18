import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState, } from 'react';
import { ActivityIndicator, Alert, FlatList, ImageBackground, SafeAreaView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { labelOrder } from '.';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import InvoiceText from '../../../components/invoiceText/invoiceText';
import { calculateTotalAmount, convertDate, getWelcomeName } from '../../../constants/categories';
import { createPDF } from '../../../constants/helperFunctions';
import { pdfContent, pdfContent3 } from '../../../constants/htmlContent';
import { setUserName } from '../../../store/invoices';
import { fetchInvoiceData } from '../../../store/redux-thunks/InvoiceDataThunk';
import { fetchRefurbishSummary } from '../../../store/redux-thunks/RefurbishSummaryThunk';
import { fetchRefurbish } from '../../../store/redux-thunks/RefurbishThunk';
import { fetchSummaryData } from '../../../store/redux-thunks/SummaryThunk';
import styles from './styles';
 
 
const RefurbishmentPdf = ({ navigation }) => {   
  const dispatch = useDispatch(); 
  const isFocused = useIsFocused(); 
  const [count,setCount] = useState(1) 
  const [loading,setLoading] = useState(false)
  const user = useSelector(state => state?.invoices?.user)
  const invoices = useSelector(state => state?.invoices?.invoiceLatest)
  const dateString = invoices?.invoiceDate
  const invoiceDate = firestore.Timestamp.fromDate(new Date(dateString))
  const refurbishProduct = useSelector(state => state?.invoices?.refurbish);
  const summary = useSelector(state => state?.invoices?.refurbishSummaryLatest) 
  const UserName =  useSelector(state => state?.invoices?.UserName);   
  const GoogleUser = useSelector(state =>state?.invoices?.GoogleUser) 
  const dateFormatted = convertDate(invoiceDate?.toDate())    
  

const finalProduct20 = refurbishProduct?.filter(product => product?.invoiceNo === invoices?.invoiceNo)
const finalProduct =  finalProduct20
?.sort((a, b) => {
  // Group by ImageUri
  const imageComparison = a.ImageUri.localeCompare(b.ImageUri);
  if (imageComparison !== 0) return imageComparison; 

  // If ImageUri is the same, sort by labelOrder
  const labelComparison = labelOrder.indexOf(a.label) - labelOrder.indexOf(b.label);
  if (labelComparison !== 0) return labelComparison;

  // If both ImageUri and label are the same, sort by latest invoiceDate first
  return new Date(b.invoiceDate) - new Date(a.invoiceDate);
});  



const finalSortedArray = Object.values(
  finalProduct.reduce((acc, product) => {
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

console.log("finalSortedArray?.Product",finalSortedArray[2]?.Product)  



const unsubscribe = auth().onAuthStateChanged(user => { 
  if (user) {
    dispatch(setUserName(user))
  }  
}); 

const getName = () => {
  
  if (GoogleUser?.name) {
    return `<p class="color">Sales Rep.: ${GoogleUser?.name}</p>`;
  }

  if (UserName?.displayName) { 
    return `<p class="color">Sales Rep.: ${UserName?.displayName}</p>`;
  }

  return ''; 
}  
 

const subTotal = calculateTotalAmount(finalProduct)  

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      dispatch(fetchRefurbish(user?.uid))    
      dispatch(fetchRefurbishSummary(user?.uid))  
      dispatch(fetchInvoiceData(user?.uid))  
      dispatch(fetchSummaryData(user?.uid))
      dispatch(fetchRefurbishSummary(user?.uid)) 
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  return unsubscribe;
}, [user, isFocused]); 

const imageUris = finalProduct.map(product => product.ImageUri);
const allSameImageUri = imageUris.every(uri => uri === imageUris[0]);

const generatePDF = async () => {

  let htmlContentPage = ``;

  if(allSameImageUri) {
    htmlContentPage = `
    ${pdfContent(finalProduct,invoices,summary,dateFormatted,getName)?.join('')}  
  ` 
  } else { 
    htmlContentPage = `
      ${pdfContent3(finalSortedArray,invoices,summary,dateFormatted,getName)?.join('')}  
    `   
    dispatch(fetchRefurbish(user?.uid));   
  }



  try {
    await createPDF('GeneratedRefurbishInvoice',invoices,htmlContentPage,count,setCount,finalProduct,`hello` ,subTotal,`hello` ,summary,user,`hello`,GoogleUser,UserName,`hello` ,`hello` ,true,invoiceDate)
  } catch (error) {
    console.error("PDF generation failed", error);
    Alert.alert("Error", "Failed to create PDF.");
  }  
};   


  return (
    <SafeAreaView style={styles.container}>
         <Header title="Refurbishment Preview"  />  
         <Text style={styles.invoiceText2}>Welcome, {getWelcomeName()} </Text>
           
         {loading ? (
          <ActivityIndicator />  
        ) : (
                  <FlatList
                  data={finalProduct} 
                  keyExtractor={(item, index) => index.toString()}
                //  stickyHeaderIndices={[0]}
              ListHeaderComponent={() => (
                <View style={[styles.padLeft, styles.stickyHeader]}>
                <Text style={styles.titleProduct}> Refurbished Product Details</Text>
              </View> 
              )}
              ListFooterComponent={() => (
                <View style={styles.container}>   
                <Text style={styles.titleProduct}>Invoice Details</Text>

                <Text style={styles.invoiceText}>Date</Text>
                <InvoiceText>
                  {dateFormatted} 
                </InvoiceText>

                <Text style={styles.invoiceText}>Invoice No</Text>
                <InvoiceText>
                  {invoices?.invoiceNo}
                </InvoiceText> 

                <Text style={styles.invoiceText}>Invoice Type</Text>
                <InvoiceText>
                  {invoices?.invoiceType}
                </InvoiceText>

                {invoices?.Companyname?.trim() !== "" && (
                  <View>
                <Text style={styles?.invoiceText}>Company name</Text>
                <InvoiceText>
                {invoices?.Companyname}
                </InvoiceText> 
                </View>
                ) 
                }

                <Text style={styles.invoiceText}>Attention</Text>
                <InvoiceText>
                  {invoices?.Attention}
                </InvoiceText>
              

                {(!invoices?.Companyname || invoices?.Companyname.trim() === "") && (
                  <View>
                <Text style={styles.invoiceText}>Phone Number</Text>
                <InvoiceText> 
                  {invoices?.phoneNumber}
                </InvoiceText>
                  </View>
                )}  

                {(invoices?.Email || invoices?.Email?.trim() !== "") && (
                                          <View>
                                        <Text style={styles.invoiceText}>Email address</Text>
                                        <InvoiceText>
                                          {invoices?.Email}
                                        </InvoiceText>
                                          </View>  
                                        )}

                  <Text style={styles.invoiceText}>Address</Text>
                                  <InvoiceText>
                                    {invoices?.Address}
                                  </InvoiceText>  

                
                {invoices?.invoiceType !== "TECHNICAL PROPOSAL"  && (

               <> 
               
               <Text style={styles.invoiceText}>Payment Terms</Text>
                <InvoiceText>
                  {summary?.selectedPaymentPlan}
                </InvoiceText>
      

                {summary?.Discount?.trim() !== "" && (
                  <View>

                <Text style={styles?.invoiceText}>DISCOUNT</Text>
                {summary?.Discount?.trim() !== "0" ? (  
                  <InvoiceText>
                {summary?.Discount}%
                </InvoiceText> ) :
               (  <InvoiceText> 
                     N/A
                </InvoiceText> )
                }  

                </View>
                ) 
                }

                <Text style={styles?.invoiceText}>Installation</Text>

                {summary?.Installation?.trim() !== "0" ? (  
                  <InvoiceText>
                ₦{summary?.Installation}
                </InvoiceText> ) : 
              (  <InvoiceText>
                     FREE
                </InvoiceText> )
                } 

                <Text style={styles?.invoiceText}>Transportation</Text>
                {summary?.Transportation?.trim() !== "0" ? (  
                  <InvoiceText>
                ₦{summary?.Transportation}
                </InvoiceText> ) :
               (  <InvoiceText>
                     FREE
                </InvoiceText> )
                }  
        

                <Text style={styles?.invoiceText}>Delivery Period</Text>
                <InvoiceText>
                {summary?.DeliveryPeriod} DAYS
                </InvoiceText> 

                <Text style={styles?.invoiceText}>Validity of Quote</Text>
                <InvoiceText>
                {summary?.Validity} DAYS 
                DAYS
                </InvoiceText> 

                {summary?.Note?.trim() !== "" && (
                  <View>
                <Text style={styles?.invoiceText}>Note</Text>
                <InvoiceText>
                {summary?.Note}
                </InvoiceText> 
                </View>
                ) 
                }
               </> 
                ) 
                }

                <Button style={styles.button} type="blue" onPress={generatePDF} > 
                      <Text>Generate Invoice</Text>   
                    </Button>   
                   
              </View>   
              )}
              renderItem={({ item, index }) => (
                <View style={styles.containerProduct}>   
                          <Text style={styles.label2}>{item.label}</Text> 
            <View style={styles.Photo}>  
            <ImageBackground source={{ uri: item?.ImageUri }} style={styles.imageBackgroundFlat}>
            </ImageBackground>  
            </View>  
                   
                  <Text style={styles.invoiceText}>Description</Text>
            <InvoiceText>
              {item?.completeDescription}
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
        )}


    </SafeAreaView>  
  ) 
}

export default React.memo(RefurbishmentPdf)
