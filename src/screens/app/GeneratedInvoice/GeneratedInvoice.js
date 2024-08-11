import React,{useState, useEffect} from 'react'
import {SafeAreaView, ImageBackground, FlatList,ScrollView} from 'react-native';
import {  Text, View } from 'react-native'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';

import { Alert } from 'react-native';  
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import InvoiceText from '../../../components/invoiceText/invoiceText'; 
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import moment from 'moment';
import { convertDate, formatNumberWithCommas, getName, getWelcomeName, } from '../../../constants/categories';
import auth from '@react-native-firebase/auth';  
import firestore from '@react-native-firebase/firestore';
import { setInvoiceList, setToUpdate, setUserName} from '../../../store/invoices'; 
import { htmlStyles } from '../../../constants/styles'; 
import { useIsFocused, useNavigation } from '@react-navigation/native';
 
 
const GeneratedInvoice = ({ route }) => {  
const navigation = useNavigation()
  const dispatch = useDispatch(); 
  const isFocused = useIsFocused(); 
  const [count,setCount] = useState(1) 
  const user = useSelector(state => state?.invoices?.user)
  const invoices = useSelector(state => state?.invoices?.data)
  const allProduct = useSelector(state => state?.invoices?.GeneratedInvoice);
  const invoiceList = useSelector(state => state?.invoices?.InvoiceList);

  const dateFormatted = convertDate(invoiceList?.Date.toDate())   


useEffect(() => {  
  const unsubscribe = auth().onAuthStateChanged(user => {
    if (user) {
        dispatch(setUserName(user))
    } 
});

return () => unsubscribe();
  }, [user, dispatch,isFocused]);

  useEffect(() => {
    if (isFocused) {
      firestore() 
      .collection('GeneratedInvoice')  
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
         
          const sortedGeneratedInvoice = newProductItem.sort((a, b) => b.invoiceDate - a.invoiceDate);
          const targetInvoice = sortedGeneratedInvoice.find(invoice => invoice.uid === invoiceList.uid);
          dispatch(setInvoiceList(targetInvoice));  

      });  
    }
}, [isFocused]); 
 

const createTableRows = () => {
  let counter = 1; // Initialize counter

  const tableRows = invoiceList?.Product?.map((item) => { 
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

  return tableRows; 
};


const sumTotalField = () => {

  if(invoiceList?.Discount?.trim() == "" || invoiceList?.Discount == undefined || isNaN(invoiceList?.Discount)
    ||invoiceList?.Discount <= 0
  ) {
   return ``    
  } 

 return  ` 
 <tr>
 <td colspan="4" class="totalbody">LESS ${invoiceList?.Discount}% DISCOUNT</td> 
 <td class="total-amount">-${formatNumberWithCommas(invoiceList?.discountValue)}</td>
</tr>
` 
};

const NoteField = () => {
  if(invoiceList?.Note?.trim() !== "") {
    return `
    <tr>
    <td colspan="1" class="totalbody">NOTE: </td> 
    <td colspan="4" class=" left">${invoiceList?.Note}</td>
  </tr>   `
  }
  return ``
}

const CompanyName = () => {
  if(invoiceList?.CompanyName?.trim() !== "") {
    return `
    ${invoiceList?.CompanyName} 
      `
  }
  return ``
}

const VATFIELD = () => {
  if(invoiceList?.selectedVAT === "Yes") {
    return `
    <tr>
    <td colspan="4" class="totalbody">ADD 7.5% VAT</td> 
    <td class="total-amount">${formatNumberWithCommas(invoiceList?.Vat)}</td> 
    </tr> 
  `
  } 

  return ``
}

const TransportationField = () => {
  if(invoiceList?.Transportation.trim() === "0") {
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
    <td class="total-amount">${formatNumberWithCommas(invoiceList?.Transportation)}</td>
    </tr>
  `
}

const InstallationField = () => {
  if(invoiceList?.Installation.trim() === "0") {
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
    <td class="total-amount">${formatNumberWithCommas(invoiceList?.Installation)}</td>
    </tr>
  `
}


const displayFinalCalculations = () => {
  if(invoiceList?.invoiceType !== "TECHNICAL PROPOSAL") {
        return `
        <tr>
        <td colspan="4" class="totalbody">SUBTOTAL</td> 
        <td class="total-amount">${formatNumberWithCommas(invoiceList?.subTotal)}</td> 
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
    <td class="total-amount">${formatNumberWithCommas(invoiceList?.sumTotal)}</td>
    </tr>



    ${VATFIELD()} 

    <tr>
    <td colspan="4" class="totalbodybold">GRAND TOTAL</td> 
    <td class="total-amountGrand">${formatNumberWithCommas(invoiceList?.GrandTotal)}</td>
    </tr>

    <tr>
    <td colspan="5" class="space " ></td> 
    </tr>



    <tr>
    <td colspan="1" class="totalbody">AMOUNT IN WORDS:</td> 
    <td colspan="4" class="total-amount center">${invoiceList?.AmountInWords}</td>
    </tr>

    <tr>
    <td colspan="1" class="totalbody">VALIDITY OF QUOTE:</td> 
    <td colspan="4" class=" left"> 3 DAYS</td>
    </tr>


    <tr>
    <td colspan="1" class="totalbody">DELIVERY PERIOD:</td> 
    <td colspan="4" class=" left">${invoiceList?.DeliveryPeriod} DAYS</td>
    </tr>


    <tr>
    <td colspan="1" class="totalbody">WARRANTY: </td> 
    <td colspan="4" class=" left">${invoiceList?.selectedWarranty}</td>
    </tr>


    <tr>
    <td colspan="1" class="totalbody">PAYMENT TERMS: </td> 
    <td colspan="4" class=" left">${invoiceList?.selectedPaymentPlan}</td>
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
                <p class="alignFactory">10 LEYE PRATT STREET, OFF ISHERI-MAGODO ROAD, OLOWORA, LAGOS</p>
                
                
              <div class="Telphone"> <P>Tel: 08030881676, 09139057062</p>  
               
                <h3 class="invoice" >${invoiceList?.invoiceType}</h3>
                <p >INVOICE NO: ${invoiceList?.invoiceNo}</p>
                <p>TIN: 31590437-0001</p></div>

                </div>


              </div>
             
            </div>

            <div class="descriptionContainer borderWall">

              <div class="description">
                <p>Attn: ${invoiceList?.Attention}</p>
                <p>${CompanyName()}</p>
                <p>LOCATION: ${invoiceList?.Address}</p>
              </div>

              <div class="date">
               <p> Date: ${dateFormatted} </p>
               ${getName()}
              </div>   

            </div>

         
            <table>

         
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



const createPDF = async () => {

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
   

  const baseName = `${sanitizeFileName(invoiceList?.invoiceType)}_${sanitizeFileName(invoiceList?.CompanyName)}(${count})`;
 
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

    console.log("Saving PDF at:", filePath); 
    await RNFS.writeFile(filePath, pdf.base64, 'base64');
    console.log('PDF saved at:', filePath);


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

const item2 = invoiceList

const handleDelete = async () => {
  try {
 await firestore()
  .collection('GeneratedInvoice') 
  .doc(item2?.uid) 
  .delete() 
  .then(() => {  
      console.log("Invoice Deleted!")
      dispatch(setToUpdate()); 
      navigation.navigate("GeneratedInvoiceList") 
  }); 
    
  } catch (error) {
      console.error("Error deleting product: ", error);
  }
};


  return (
    <SafeAreaView style={styles.container}>
         <Header title={`${invoiceList?.Attention} Invoice`}   />  
         <Text style={styles.invoiceText2}>Welcome, {getWelcomeName()} </Text>
                <FlatList
             data={invoiceList?.Product} 
             keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <View style={[styles.padLeft, styles.stickyHeader]}>
            <Text style={styles.titleProduct}>Product Details</Text>
          </View> 
          )}
          ListFooterComponent={() => ( 
             <>
             <Button style={styles.button1} type="blue" onPress={() => navigation.navigate('GeneratedAddProduct', {item2})}>
                  <Text>Add Product</Text>   
                </Button> 

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
         
           <Text style={styles.invoiceText}>Address</Text>
           <InvoiceText>
              {invoiceList?.Address}
           </InvoiceText>

           {invoiceList?.invoiceType !== "TECHNICAL PROPOSAL" && (
            <>
               <Text style={styles.invoiceText}>Payment Terms</Text>
           <InvoiceText>
              {invoiceList?.selectedPaymentPlan}
           </InvoiceText>
         
           <Text style={styles.invoiceText}>Warranty</Text>
           <InvoiceText>
              {invoiceList?.selectedWarranty} 
           </InvoiceText>
 
           <Text style={styles?.invoiceText}>SubTotal</Text>
           <InvoiceText>  
           ₦{invoiceList?.subTotal}
           </InvoiceText> 
 
         
           {invoiceList?.Discount.trim() !== "" && (
                  <View>

                <Text style={styles?.invoiceText}>DISCOUNT</Text>
                {invoiceList?.Discount.trim() !== "0" ? (  
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

                {invoiceList?.Installation.trim() !== "0" ? (  
                  <InvoiceText>
                ₦{invoiceList?.Installation}
                </InvoiceText> ) : 
              (  <InvoiceText>
                     FREE
                </InvoiceText> )
                } 

                <Text style={styles?.invoiceText}>Transportation</Text>
                {invoiceList?.Transportation.trim() !== "0" ? (  
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
             5 DAYS
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
 
 
        
           <Button style={styles.button} type="blue" onPress={() => createPDF()}>
                  <Text>View Invoice</Text>   
                </Button> 
 
                <Button style={styles.button} type="blue" onPress={() => navigation.navigate('GeneratedInvoiceEdit', { item2 })}>
                  <Text>Edit Invoice</Text>   
                </Button>   

          <Button style={styles.button} del="red"  onPress={handleDelete}> 
            <Text>Delete</Text> 
          </Button> 

          </View> 
          </> 
          )}
          renderItem={({ item, index }) => (
            <View style={styles.containerProduct}>   
        <View style={styles.Photo}>  
       <ImageBackground source={{ uri:item?.ImageUri }} style={styles.imageBackgroundFlat}>
       </ImageBackground> 
       </View> 
              
              <Text style={styles.invoiceText}>Description</Text>
        <InvoiceText>
          {item?.completeDescription}
        </InvoiceText> 
    
    
        <Text style={styles.invoiceText}>Quantity</Text>
        <InvoiceText>
          {item?.Quantity}
        </InvoiceText>
          
        <Text style={styles?.invoiceText}>Unit Price</Text>
        <InvoiceText>
        ₦{item?.UnitPrice}
        </InvoiceText> 

        <Text style={styles?.invoiceText}>Amount</Text>
        <InvoiceText>
        ₦{item?.Amount}
        </InvoiceText> 
        <Button style={styles.button} type="blue" onPress={() => navigation.navigate('GeneratedProductEdit', { item,item2})}>
                  <Text>Edit Product</Text>   
                </Button> 

            </View>
          )}
        />   


    </SafeAreaView>  
  ) 
}

export default React.memo(GeneratedInvoice)

