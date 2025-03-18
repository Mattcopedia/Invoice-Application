import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, PermissionsAndroid, Platform, RefreshControl, SafeAreaView, Text, View } from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumberWithCommas, numberToWordsRep } from '../../constants/categories';
import { htmlStyles } from '../../constants/receiptStyles';
import styles from '../../screens/app/Receipt/styles';
import Button from '../Button';
import Header from '../Header';
import InvoiceText from '../invoiceText/invoiceText';

const LatestReceiptPdf = ({route}) => {    
  const dispatch = useDispatch();  
  const navigation = useNavigation()   
  const [count,setCount] = useState(1) 
  const user = useSelector(state => state?.invoices?.user)
  const [refreshing, setRefreshing] = useState(false);
  const receipt = route.params.InvoiceList 
  const [loading, setLoading] = useState(false); 
  const AmountNumeric = Number(receipt?.AmountPaid)
  const Balance = Math.ceil(receipt?.GrandTotal - AmountNumeric)
  console.log('GrandTotal',receipt?.GrandTotal, typeof receipt?.GrandTotal )
  console.log('AmountNumeric',AmountNumeric, typeof AmountNumeric)
  console.log('Balance',Balance)
  const date = new Date(receipt?.Date.seconds * 1000) 

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);  

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false); 
  }, [])    
 
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
                         <div class="receiptheader">
                        <img class="image" src="https://firebasestorage.googleapis.com/v0/b/planify-1ce36.appspot.com/o/Cristo.JPG?alt=media&token=505360c1-a8c0-40d0-9df9-cc2b56df6b7c"
                        alt="Cristo Invoice"/> 
                         <h1> Sales Receipt </h1> 
                          </div>

                         <div class="borderWall2"></div>

                  <div class="descriptionText">

                    <div class="textDesc">
                    <h2>CRISTO PROJECTS LIMITED</h2>
                    <p>...The Comfort you Imagined</p>
                    </div>

                    <div class="dateDesc">
                     <p><span>Date:</span>${formattedDate}</p>
                     <p class="moveInvoice"><span>Invoice #:</span> ${receipt.invoiceNo}</p> 
                    </div>
 
                  </div>
                  
                  <div class="borderWall" ></div>
                 
                  <div class="companyName">
                    <span>Sold to:</span> 
                    <p>
                      ${receipt.Attention} <br />
                      ${receipt.CompanyName} <br />
                      ${receipt.Address}<br />
                      ${receipt.phoneNumber}
                    </p>
                  </div> 

            <table>
                <tr>
                    <th>Payment method</th>
                    <th>Check No.</th>
                    <th>Job </th>  
                </tr> 
      
              <tbody>
                <tr>   
                   <td>${receipt.paymentMethod}</td>
                   <td>${receipt.CheckNumber}</td>
                   <td>${receipt.Job}</td>
                  </tr>  
              </tbody>

          </table> 


          <table class="secondTable">
            <tr>
                <th >Qty</th>
                <th>Item #</th>
                <th >Description </th> 
                <th >Unit Price</th>
                <th>Discount</th>
                <th >Line Total</th>
            </tr> 
           
            <tr>   
              <td class="white"></td>
              <td class="white"></td>
              <td class="white"></td>
              <td class="white"></td>
              <td class="white"></td>
              <td></td>
             </tr>  

          <tbody>
            <tr>   
               <td class="centerRow">1</td>
               <td></td>
               <td class="centerRow">${receipt.Description}</td>
               <td class="alignRow">${formatNumberWithCommas(receipt.AmountPaid)}</td>
               <td></td>
               <td class="alignRow34">${formatNumberWithCommas(receipt.AmountPaid)}</td>
              </tr>  

              <tr>   
                <td class="white"></td>
                <td class="white"></td>
                <td class="white"></td>
                <td class="white"></td>
                <td class="white"></td>
                <td></td>
               </tr>  

               <tr>   
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
               </tr>  


             
               <tr>   
                <td class="white"></td>
                <td class="white"></td>
                <td class="white"></td>
                <td class="white"></td>
                <td class="brownText">SubTotal</td>
                <td class="totalValue" >
                 <div class="row-align2">
                    <p>NGN<p> <span>${formatNumberWithCommas(receipt.AmountPaid)}</span> 
                  </div> 
                </td>
               </tr>  

               <tr>   
                <td class="white"></td> 
                <td class="white"></td>
                <td class="white"></td>
                <td class="white"></td>
                <td class="brownText">Sales Tax</td>
                <td class="white"></td>
               </tr> 

               <tr style="height: 57px;">   
                <td class="boldText alignRowLeft" colspan="4">Amount in words:  <span> ${numberToWordsRep(AmountNumeric)}</span></td>
                <td class="brownText">Total</td>

                <td class="totalValue">
                <div class="row-align">
                   <strong><span>NGN</span></strong> 
                    <strong>${formatNumberWithCommas(receipt.AmountPaid)}</strong>
                  </div> 
                </td>
                   
               </tr>   
 
               <tr>   
                <td class="boldText1 alignRowLeft2" colspan="4">Balance:  <span>${Balance > 0 ? formatNumberWithCommas(Balance) : "NIL"}</span></td>
                <td class="white"></td>
                <td class="white"></td> 
               </tr> 
  
          </tbody>  
              
      </table>  

              <img class= "signature-image"  src=${receipt.ImageUriSave} alt="Signature"/>
              <p class="name">${receipt?.userName?.trim() !== "" ? receipt?.userName : receipt.GoogleUserName }</p>  
         
                       <div class="textSig">  
                    <p>Thank you for your business!</p> 
                    <p>10 LEYE PRATT STREET, OFF ISHERI-MAGODO ROAD, OLOWORA, LAGOS</p>
                    </div> 
                  
            </body>
 
  </html>
`;

const UploadPDF = async (filePath) => {
 
  const uploadUri = filePath; 
  let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
  
  const extension = filename.split(".").pop();
  const name = filename.split(".").slice(0,-1).join("."); 
  filename = name + Date.now() + "." + extension 
  
  const directory = user?.uid;   
    const task = storage().ref(`${directory}/files/${filename}`).putFile(uploadUri) 
    
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
  const baseName = `RECEIPT - ${sanitizeFileName(receipt?.Attention)}(${count})`;
 
  try {   
  let options = {  
    html: htmlContent,  
    fileName: baseName,        
    base64: true 
  };  

  const pdf = await RNHTMLtoPDF.convert(options);

  if (pdf.base64) {
    const folderPath = Platform.OS === 'android' 
    ? `${RNFS.DownloadDirectoryPath}/Cristo Receipt`
    : `${RNFS.DocumentDirectoryPath}/Cristo Receipt`;

    const folderExists = await RNFS.exists(folderPath);
    if (!folderExists) {
      await RNFS.mkdir(folderPath);
    }
    const uniqueFileName = await generateUniqueFileName(baseName, folderPath);
    const filePath = `${folderPath}/${uniqueFileName}`;

    await RNFS.writeFile(filePath, pdf.base64, 'base64');
    console.log('PDF saved at:', filePath);
    UploadPDF(filePath);


      Alert.alert('Success', `PDF saved at: /internal storage/Download/Cristo Receipt/${uniqueFileName}`, [ 
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

  return (
    <SafeAreaView style={styles.container}>
         <Header title="Receipt Preview"  />  
         <Text style={styles.invoiceText2}>Welcome {receipt?.userName?.trim() !== "" ? receipt?.userName : receipt.GoogleUserName }  </Text>
           
         {loading ? ( 
          <ActivityIndicator /> 
        ) : (
                  <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
              ListHeaderComponent={() => (
                <View style={[styles.padLeft, styles.stickyHeader]}>
                <Text style={styles.titleProduct}>Receipt Details</Text>
              </View> 
              )}
              ListFooterComponent={() => (
                <View style={styles.container}>   
                <Text style={styles.titleProduct}></Text>

                <Text style={styles.invoiceText}>Date</Text>
                <InvoiceText>
              {formattedDate}  
                </InvoiceText>

                <Text style={styles.invoiceText}>Invoice No</Text>
                <InvoiceText>
                  {receipt?.invoiceNo}
                </InvoiceText> 

                <Text style={styles.invoiceText}>Company name</Text>
                <InvoiceText>
                  {receipt?.CompanyName}
                </InvoiceText>


                <Text style={styles.invoiceText}>Attention</Text>
                <InvoiceText>
                  {receipt?.Attention}
                </InvoiceText>

                <Text style={styles.invoiceText}>phoneNumber</Text>
                <InvoiceText>
                  {receipt?.phoneNumber} 
                </InvoiceText>
              
                <Text style={styles.invoiceText}>Address</Text>
                <InvoiceText>
                  {receipt?.Address}
                </InvoiceText>

                <Text style={styles.invoiceText}>Description</Text>
                <InvoiceText>
                  {receipt?.Description}
                </InvoiceText>

                <Text style={styles.invoiceText}>Payment method</Text>
                <InvoiceText>
                  {receipt?.paymentMethod}
                </InvoiceText>

                <Text style={styles.invoiceText}>Job</Text>
                <InvoiceText>
                  {receipt?.Job}
                </InvoiceText>

                <Text style={styles.invoiceText}>Amount Paid</Text>
                <InvoiceText>
                  {receipt?.AmountPaid}
                </InvoiceText>
            
            {receipt?.CheckNumber?.trim() !== '' && (
              <View>
                <Text style={styles.invoiceText}>Check number</Text>
                <InvoiceText>
                  {receipt?.CheckNumber}
                </InvoiceText>
              </View>
            )} 
               

                <Text style={styles.invoiceText}>Quantity</Text>
                <InvoiceText>
                  {receipt?.Quantity}
                </InvoiceText>

                <Text style={styles.invoiceText}>Balance</Text>
                <InvoiceText>
                  {Balance}
                </InvoiceText>
         
              
                <Button style={styles.button} type="blue" onPress={() => createPDF()}>
                      <Text>View Receipt</Text>   
                    </Button>   
              
              </View>  
              )}
           
            />   
        )}


    </SafeAreaView>  
  ) 
}

export default React.memo(LatestReceiptPdf)
