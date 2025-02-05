import React,{useState, useEffect, useCallback} from 'react'
import {SafeAreaView, ImageBackground, FlatList,ScrollView, Modal, RefreshControl} from 'react-native';
import {  Text} from 'react-native'
import FileViewer from 'react-native-file-viewer';
import { Alert } from 'react-native';  
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';

import Header from '../../../components/Header';
import { convertDate, DuplicateInvoice, formatNumberWithCommas, GenerateInvoiceNo, getName, getWelcomeName, } from '../../../constants/categories';
import auth from '@react-native-firebase/auth';  
import firestore from '@react-native-firebase/firestore';
import { setInvoiceList, setToUpdate, setUserName} from '../../../store/invoices'; 
import { htmlStyles } from '../../../constants/styles'; 
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { fetchGeneratedInvoice } from '../../../store/redux-thunks/GeneratedInvoiceThunk'; 
import { fetchGeneratedRefurbishInvoice } from '../../../store/redux-thunks/RefurbishList';
import { createPDF2 } from '../../../constants/helperFunctions';
import InvoicePdf from '../../../components/InvoicePdf';
 
  
const GeneratedInvoice = ({ route }) => {  
const navigation = useNavigation()
  const dispatch = useDispatch(); 
  const isFocused = useIsFocused(); 
  const [count,setCount] = useState(1) 
  const user = useSelector(state => state?.invoices?.user)
  const localInvoiceList = useSelector(state => state?.invoices?.InvoiceList)
  const [invoiceList, setLocalInvoiceList] = useState(localInvoiceList); 
  const [refreshing, setRefreshing] = useState(false);
  
  const dateFormatted = convertDate(invoiceList?.Date?.toDate())   

  const handleNavigateEditInvoice = () => { 
    dispatch(setInvoiceList(invoiceList));  
    navigation.navigate('GeneratedInvoiceEdit')
   
  } 


useEffect(() => {  
  const unsubscribe = auth().onAuthStateChanged(user => {
    if (user) {
        dispatch(setUserName(user))
    } 
});

return () => unsubscribe();
  }, [user, dispatch,isFocused]);

  const fetchData = () => {
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
        dispatch(setInvoiceList(targetInvoice)) 
      setLocalInvoiceList(targetInvoice) 
    });  
  }

  useEffect(() => {
    if (isFocused) {
      fetchData()
    } 
}, [isFocused,user, invoiceList, invoiceList?.uid,invoiceList?.Paid, invoiceList?.invoiceType]); 

const onRefresh = useCallback(async () => {
  setRefreshing(true);
    fetchData();
  setRefreshing(false); 
}, []);
  

const createTableRows = () => {
  let counter = 1; // Initialize counter


  let tableRows1 = invoiceList?.Product?.map((item) => { 
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

const TableHeader = () => {

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
    <td colspan="4" class=" left"> ${invoiceList?.Validity} DAYS</td>
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
                    <p class="color">Attn: ${invoiceList?.Attention}</p>
                <p class="color">${invoiceList?.CompanyName}</p>  
                <p class="color">LOCATION: ${invoiceList?.Address}</p> 
                 <p class="color">${invoiceList?.phoneNumber}</p> 

              </div>

              <div class="date">
               <p> Date: ${dateFormatted} </p>
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


const generatePDF = () => {
  createPDF2(invoiceList,htmlContent,count,setCount,false)
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
 
const DuplicateInvoice2 = async (invoiceList) => {
   DuplicateInvoice(invoiceList)
  navigation.navigate("GeneratedInvoiceList")    
}  


  return (
    <SafeAreaView style={styles.container} >
         <Header title={`${invoiceList?.Attention} Invoice`}   />  
       
     

         <Text style={styles.invoiceText2}>Welcome, {getWelcomeName()} </Text>

           <InvoicePdf invoiceList={invoiceList} item2={item2} DuplicateInvoice2={DuplicateInvoice2}
           handleNavigateEditInvoice={handleNavigateEditInvoice} generatePDF={generatePDF}
            handleDelete={handleDelete} refreshing={refreshing} onRefresh={onRefresh}
            dateFormatted={dateFormatted}/> 
  

    </SafeAreaView>  
  ) 
}

export default React.memo(GeneratedInvoice)

