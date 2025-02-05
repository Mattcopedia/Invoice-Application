import React,{useState, useEffect} from 'react'
import {SafeAreaView, ImageBackground, FlatList,ScrollView, ActivityIndicator} from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import {  Text, View } from 'react-native'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { Alert } from 'react-native';  
import { useSelector, useDispatch } from 'react-redux';
import storage from '@react-native-firebase/storage'; 
import styles from './styles';
import { setAddProduct, setImages, setSelectedItem  } from '../../../store/invoices';
import InvoiceText from '../../../components/invoiceText/invoiceText';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import { useIsFocused } from '@react-navigation/native'; 
import { calculateTotalAmount, convertDate, formatNumberWithCommas, getName, getWelcomeName, numberToWords } from '../../../constants/categories';

import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';  
import { setUserName} from '../../../store/invoices'; 
import { htmlStyles } from '../../../constants/styles'; 
import { fetchproductInvoice } from '../../../store/redux-thunks/ProductInvoiceThunk';
import { fetchSummaryData } from '../../../store/redux-thunks/SummaryThunk';
import { fetchInvoiceData } from '../../../store/redux-thunks/InvoiceDataThunk';
import { fetchselectedItem } from '../../../store/redux-thunks/selectedItemThunk';

const ExportPdf = ({ navigation }) => {  
  const dispatch = useDispatch();  
  const isFocused = useIsFocused();
  const [count,setCount] = useState(1) 
  const user = useSelector(state => state?.invoices?.user)
  const invoices = useSelector(state => state?.invoices?.data)  
  const summary = useSelector(state => state?.invoices?.summary)
  const UserName =  useSelector(state => state?.invoices?.UserName);   
  const GoogleUser = useSelector(state =>state?.invoices?.GoogleUser )

  const addProduct = useSelector(state => state?.invoices?.addProduct); 
  const selectedItem  = useSelector(state => state?.invoices?.selectedItem); 
  const filterselectedProducts = selectedItem?.filter(product => product?.invoiceNo === invoices?.invoiceNo)
  const filteredProducts = addProduct?.filter(product => product?.invoiceNo === invoices?.invoiceNo)
  const arrangedProducts = filteredProducts?.slice().reverse();   
  const finalProduct = filterselectedProducts.concat(arrangedProducts);  
 
 const [loading, setLoading] = useState(false);


const dateFormatted = convertDate(invoices?.invoiceDate.toDate())  
 
const unsubscribe = auth().onAuthStateChanged(user => { 
  if (user) {
    dispatch(setUserName(user))
  }  
}); 

const subTotal = calculateTotalAmount(finalProduct)  

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      dispatch(fetchproductInvoice(user?.uid))  
      dispatch(fetchSummaryData(user?.uid))  
      dispatch(fetchInvoiceData(user?.uid))  
      dispatch(fetchselectedItem(user?.uid))   

    } catch (error) { 
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  return unsubscribe;
}, [user, dispatch, isFocused]); 



const createTableRows = () => {
  let counter = 1; // Initialize counter


 let tableRows1 = finalProduct?.map((item) => { 
    const formattedDescription  = `${item?.Description} <br /> <strong>(${item?.SampleCode})</strong>  `
    return `
    <tr>   
      <td><span class="outside-number">${counter++}</span> <img class="furniture" style="height: 175px; width: 200px;" src=${item.ImageUri} alt="furniture"></td>
      <td class="center">${formattedDescription}</td>  
      <td class="center">${item?.Quantity}</td>
      <td class="right">${formatNumberWithCommas(item?.UnitPrice)}</td> 
      <td class="right total-amount">${formatNumberWithCommas(item?.Amount)}</td>  
    </tr> 
    ` 
  });

  return tableRows1; 
};

  const handleNavigate = () => {
    navigation.navigate('UpdatePdf');   
  };  
 


 const discount = summary?.Discount.trim() !== "" ? subTotal * (parseFloat(summary?.Discount) / 100) : 0

 let sumTotal = ( parseFloat(subTotal) + parseFloat(summary?.Transportation || 0) +  
parseFloat(summary?.Installation || 0));

 if (summary?.Discount.trim() !== "" || !isNaN(summary?.Discount)) {  
    sumTotal -= discount   
 } 
 


 let Vat = 0
 if(summary?.selectedVAT === "Yes") {
   Vat = (7.5/100) * (sumTotal)
 }
 if(summary?.selectedVAT === "No") {
   Vat = 0
 } 

const GrandTotal = sumTotal + Vat

console.log(GrandTotal) 

const AmountInWords = numberToWords(GrandTotal) 



const sumTotalField = () => {

   if(summary?.Discount.trim() == "" || summary?.Discount == undefined || isNaN(summary?.Discount)
  ||summary?.Discount <= 0) {
    return ``  
   } 

  return  ` 
  <tr>
  <td colspan="4" class="totalbody">LESS ${summary?.Discount}% DISCOUNT</td> 
  <td class="total-amount">-${formatNumberWithCommas(discount)}</td>
</tr>
` 
};

const NoteField = () => {
  if(summary?.Note?.trim() !== "") {
    return `
    <tr>
    <td colspan="1" class="totalbody">NOTE: </td> 
    <td colspan="4" class=" left">${summary?.Note}</td>
  </tr>   `
  }
  return ``
}

const CompanyName = () => {
  if(invoices?.Companyname?.trim() !== "") {
    return `
    ${invoices?.Companyname} 
      `
  }
  return ``
}


const VATFIELD = () => {
  if(summary?.selectedVAT === "Yes") {
    return `
    <tr>
    <td colspan="4" class="totalbody">ADD 7.5% VAT</td> 
    <td class="total-amount">${formatNumberWithCommas(Vat)}</td> 
    </tr> 
  `
  } 

  return ``
}


const TransportationField = () => {
  if(summary?.Transportation.trim() === "0") {
    return `  
    <tr>
    <td colspan="4" class="totalbody">TRANSPORTATION</td> 
    <td class="total-amount">FREE</td>
    </tr>
    `
  }

  return ` 
    <tr>
    <td colspan="4" class="totalbody">TRANSPORTATION</td> 
    <td class="total-amount">${formatNumberWithCommas(summary?.Transportation)}</td>
    </tr>
  `
}

const InstallationField = () => {
  if(summary?.Installation.trim() === "0") {
    return `   
    <tr>
    <td colspan="4" class="totalbody">INSTALLATION</td> 
    <td class="total-amount">FREE</td>
    </tr>
    `
  }

  return ` 
    <tr>
    <td colspan="4" class="totalbody">INSTALLATION</td> 
    <td class="total-amount">${formatNumberWithCommas(summary?.Installation)}</td>
    </tr>
  `
}

const TableHeader = () => {
  if(invoices?.invoiceType == "REFURBISHMENT") {
    return `
       <tr>
                <th>Item Sample Picture</th>
                <th>Description</th>
                <th>Unit Price <br/>
                  (=₦=)
                </th>
            </tr> 
    `
  } 
  return `
     <tr>
                <th>Item Sample Picture</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price <br/>
                  (=₦=)
                </th>
                <th>Total Amount  <br/>
                  (=₦=)
                </th>
            </tr> 
  `
}


const displayFinalCalculations = () => {
  if(invoices?.invoiceType.trim() === "REFURBISHMENT") {
   return `
    
   `
  }

  if(invoices?.invoiceType !== "TECHNICAL PROPOSAL")  {
        return ` 
        <tr> 
        <td colspan="4" class="totalbody">SUBTOTAL</td> 
        <td class="total-amount">${formatNumberWithCommas(subTotal)}</td> 
    </tr> 
 
    ${sumTotalField()} 


      ${TransportationField()} 

       ${InstallationField()}  


    <tr>
    <td colspan="4" style="height: 14px; " class="totalbodyUp"></td> 
    <td colspan="1" style="height: 14px; " class="totalbodyUp"></td> 
    </tr>


    <tr>
    <td colspan="4" class="totalbodyPad">TOTAL</td> 
    <td class="total-amount">${formatNumberWithCommas(sumTotal)}</td>
    </tr>
 
 
     ${VATFIELD()} 

    <tr>
    <td colspan="4" class="totalbodybold">GRAND TOTAL</td> 
    <td class="total-amountGrand">${formatNumberWithCommas(GrandTotal)}</td>
    </tr>

    <tr>
    <td colspan="5" class="space " ></td> 
    </tr>



    <tr>
    <td colspan="1" class="totalbody">AMOUNT IN WORDS:</td> 
    <td colspan="4" class="total-amount center">${AmountInWords}</td>
    </tr>

    <tr>
    <td colspan="1" class="totalbody">VALIDITY OF QUOTE:</td> 
    <td colspan="4" class=" left"> 3 DAYS</td>
    </tr>


    <tr>
    <td colspan="1" class="totalbody">DELIVERY PERIOD:</td> 
    <td colspan="4" class=" left">${summary?.DeliveryPeriod} DAYS</td>
    </tr>


    <tr>
    <td colspan="1" class="totalbody">WARRANTY: </td> 
    <td colspan="4" class=" left">${summary?.selectedWarranty}</td>
    </tr>


    <tr>
    <td colspan="1" class="totalbody">PAYMENT TERMS: </td> 
    <td colspan="4" class=" left">${summary?.selectedPaymentPlan}</td>
    </tr>

    <tr>
    <td colspan="1" class="totalbody">ACCOUNT DETAILS: </td> 
    <td colspan="4" class=" left">ZENITH BANK, 1310056578, CRISTO PROJECTS LIMITED</td>
    </tr>

    ${NoteField()} 

    <tr>
    <td colspan="5" class="space" ></td> 
    </tr>
        `
  }

  return `
  `
}

 
  const htmlContent = `   
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
        ${htmlStyles}
      </style>
  </head>
   
    
              <body> 

              <div class="space borderAround"></div>
                        <div class="container  borderWall">
                <div id="shiftImage">
                <img src="https://firebasestorage.googleapis.com/v0/b/planify-1ce36.appspot.com/o/Cristo.JPG?alt=media&token=505360c1-a8c0-40d0-9df9-cc2b56df6b7c"
                 alt="Cristo Invoice"/> 
              </div>
              
              <div class="text">
                <h2>CRISTO PROJECTS LIMITED</h2>
                <div class="align-text">
                <p class="alignFactory color">10 LEYE PRATT STREET, OFF ISHERI-MAGODO ROAD, OLOWORA, LAGOS</p>
                
                
              <div class="Telphone"> <p class="color" >Tel: 08030881676, 09139057062</p>  
               
                <h3 class="invoice" >${invoices?.invoiceType}</h3>
                <p class="color" >INVOICE NO: ${invoices?.invoiceNo}</p>
                <p class="color">TIN: 31590437-0001</p></div>

                </div>


              </div>
             
            </div>

            <div class="descriptionContainer borderWall">

              <div class="description">
                <p class="color">Attn: ${invoices?.Attention}</p>
                <p class="color">${CompanyName()}</p>
                <p class="color">LOCATION: ${invoices?.Address}</p>
              </div>

              <div class="date">
               <p class="color" > Date: ${dateFormatted} </p>
               ${getName()}
              </div>   

            </div>

         
            <table>
   
            ${TableHeader()}  
      
              <tbody>
              ${createTableRows()?.join('')} 
                  <!-- Add more rows as needed -->
                 
                <tr>

                  <tr>
                  <td colspan="5" class="space" ></td> 
                </tr>   
               ${displayFinalCalculations()} 

               </tr>
              </tbody>


          </table>        
            </body>

  </html>
`;

const UploadPDF = async (filePath) => {
 
  const uploadUri = filePath; 
  let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
  
  //Add timestamp so that every Image will be unique for every occurence of image upload.
  const extension = filename.split(".").pop();
  const name = filename.split(".").slice(0,-1).join("."); 
  filename = name + Date.now() + "." + extension //by adding timestamp to it, we make every date unique
  
  const directory = user?.uid;   
    const task = storage().ref(`${directory}/files/${filename}`).putFile(uploadUri) 
  // const task = storage().ref(filename).putFile(uploadUri)  
    
  try { 
    await task;   
  } catch(e) {
    console.log(e);
  } 

}


async function requestStoragePermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to save PDFs',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage Permission Granted.');
      } else {
        console.log('Storage Permission Denied.');
      }
    } catch (err) {
      console.warn(err);
    }
  }
}


const createPDF = async () => {
  requestStoragePermission();

  await firestore()
  .collection('GeneratedInvoice') 
  .add({ 
    Product:finalProduct,
    invoiceDate:invoices?.invoiceDate,
    Address:invoices?.Address,
    invoiceNo:invoices?.invoiceNo,
    Date: invoices?.invoiceDate,
    CompanyName:invoices?.Companyname,
    Attention:invoices?.Attention,
    invoiceType:invoices?.invoiceType,
    subTotal:subTotal,
    discountValue:discount,
    Vat:Vat,
    GrandTotal: GrandTotal,
    sumTotal:sumTotal,
    DeliveryPeriod:summary?.DeliveryPeriod,
    Discount:summary?.Discount,
    Installation:summary?.Installation,
    Note:summary?.Note, 
    Transportation:summary?.Transportation, 
    selectedPaymentPlan:summary?.selectedPaymentPlan,
    selectedWarranty:summary?.selectedWarranty,
    selectedVAT: summary?.selectedVAT,
    AmountInWords: AmountInWords,
    refurbishment: invoices.refurbishment,
    Paid: "No", 
    userId: user?.uid,  
    userName:UserName ? UserName?.displayName: "", 
    GoogleUserName: GoogleUser ? GoogleUser?.name : "", 
  })
  .catch(e => { 
    console.log('error when adding information :>> ', e);
    Alert.alert(e.message);   
  }); 

  const sanitizeFileName = (name) => {
    return name.replace(/[^a-zA-Z0-9]/g, ' '); 
  };

  
  const generateUniqueFileName = async (baseName, folderPath) => {
    const maxRetries = 100; 
    let retryCount = 0;
    let fileName;
    let filePath;
   
    while (retryCount < maxRetries) {
      const randomNumber = Math.floor(Math.random() * 20) + 1;
      fileName = `${baseName}(${randomNumber}).pdf`;
      filePath = `${folderPath}/${fileName}`;
  
      if (!(await RNFS.exists(filePath))) {
        return fileName;
      }
      
      retryCount++;
    }
    Alert.alert("Unable to generate a unique file name after multiple attempts")
    throw new Error('Unable to generate a unique file name after multiple attempts');
  };
  const baseName = `${sanitizeFileName(invoices?.invoiceType)}_${sanitizeFileName(invoices?.Companyname)}(${count})`;
 
  try { 
  let options = {  
    html: htmlContent,  
    fileName: baseName,        
    base64: true 
  };  

  const pdf = await RNHTMLtoPDF.convert(options);

  if (pdf.base64) {
    const folderPath = Platform.OS === 'android' 
    ? `${RNFS.DownloadDirectoryPath}/Cristo Invoice`
    : `${RNFS.DocumentDirectoryPath}/Cristo Invoice`;

    const folderExists = await RNFS.exists(folderPath);
    if (!folderExists) {
      await RNFS.mkdir(folderPath);
    }
    const uniqueFileName = await generateUniqueFileName(baseName, folderPath);
    const filePath = `${folderPath}/${uniqueFileName}`;

    await RNFS.writeFile(filePath, pdf.base64, 'base64');
    console.log('PDF saved at:', filePath);
    UploadPDF(filePath);


      Alert.alert('Success', `PDF saved at: /internal storage/Download/Cristo Invoice/${uniqueFileName}`, [ 
          {text: "Cancel", style: "cancel"},
          {text: "Open", onPress: () => openFile(filePath)}
      ], {cancelable: true});
  
      setCount(count + 1); 

    }  

  } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to create PDF. Please try again.');
  }

  } 

 
 
 const openFile = async (filepath) => {
  const path = filepath; 
  try {
    await FileViewer.open(path);  
  } catch (error) {
    console.error('Error opening file:', error);
    Alert.alert('Error', 'Failed to open PDF file. Please try again.');
  }
};


if (!invoices?.Address) {
  return (

    <SafeAreaView style={styles.container}>
    <Header title="Invoice Preview" />  
<ScrollView>  

      <View style={styles.padLeft}>
        <InvoiceText>Welcome, {getWelcomeName()} </InvoiceText>
      </View>

    <Text style={styles.text1}>Create an Invoice</Text>
    </ScrollView>
    </SafeAreaView>  
  )  
}





  return (
    <SafeAreaView style={styles.container}>
         <Header title="Invoice Preview"  />  
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
                <Text style={styles.titleProduct}>Product Details</Text>
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

                {invoices?.invoiceType?.trim() === "REFURBISHMENT" && (
                  <View>
                <Text style={styles?.invoiceText}>Refurbishment</Text>
                <InvoiceText>
                {invoices?.refurbishment}
                </InvoiceText> 
                </View> 
                ) 
                }

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
              
                <Text style={styles.invoiceText}>Address</Text>
                <InvoiceText>
                  {invoices?.Address}
                </InvoiceText>

                
                {invoices?.invoiceType !== "TECHNICAL PROPOSAL" || invoices.invoiceType !== "REFURBISHMENT" && (

               <> 
               
               <Text style={styles.invoiceText}>Payment Terms</Text>
                <InvoiceText>
                  {summary?.selectedPaymentPlan}
                </InvoiceText>
               
                <Text style={styles.invoiceText}>Warranty</Text>
                <InvoiceText>
                  {summary?.selectedWarranty} 
                </InvoiceText>

                <Text style={styles?.invoiceText}>SubTotal</Text>
                <InvoiceText>  
                ₦{subTotal}
                </InvoiceText> 

                {summary?.Discount.trim() !== "" && (
                  <View>

                <Text style={styles?.invoiceText}>DISCOUNT</Text>
                {summary?.Discount.trim() !== "0" ? (  
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

                {summary?.Installation.trim() !== "0" ? (  
                  <InvoiceText>
                ₦{summary?.Installation}
                </InvoiceText> ) : 
              (  <InvoiceText>
                     FREE
                </InvoiceText> )
                } 

                <Text style={styles?.invoiceText}>Transportation</Text>
                {summary?.Transportation.trim() !== "0" ? (  
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
                  5 DAYS
                </InvoiceText> 

                {summary?.Note.trim() !== "" && (
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

         
              
                <Button style={styles.button} type="blue" onPress={() => createPDF()}>
                      <Text>Generate Invoice</Text>   
                    </Button> 

                    <Button style={styles.button} type="blue" onPress={handleNavigate}>
                      <Text>Edit Invoice</Text>   
                    </Button>  
              
              </View>  
              )}
              renderItem={({ item, index }) => (
                <View style={styles.containerProduct}>   
            <View style={styles.Photo}>  
            <ImageBackground source={{ uri: item?.ImageUri }} style={styles.imageBackgroundFlat}>
            </ImageBackground> 
            </View> 
                  
                  <Text style={styles.invoiceText}>Description</Text>
            <InvoiceText>
              {item?.completeDescription}
            </InvoiceText> 
        
        
            {invoices?.invoiceType !== "REFURBISHMENT" && (
                        <View>
                      <Text style={styles.invoiceText}>Quantity</Text>
                    <InvoiceText>
                      {item?.Quantity}
                    </InvoiceText>
                        </View> 
                      ) }
                      
            <Text style={styles?.invoiceText}>Unit Price</Text>
            <InvoiceText>
            ₦{item?.UnitPrice}
            </InvoiceText> 

            {invoices?.invoiceType !== "REFURBISHMENT" && (
                        <View>
                       <Text style={styles?.invoiceText}>Amount</Text>
                      <InvoiceText>
                      ₦{item?.Amount}
                      </InvoiceText> 
                        </View> 
                      ) }

                </View>
              )}
            />   
        )}


    </SafeAreaView>  
  ) 
}

export default React.memo(ExportPdf)
