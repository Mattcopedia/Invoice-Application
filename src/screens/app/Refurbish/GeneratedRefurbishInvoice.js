import React,{useState, useEffect, useCallback, useMemo} from 'react'
import {SafeAreaView} from 'react-native';
import {  Text} from 'react-native' 
import { useSelector, useDispatch } from 'react-redux'; 
import styles from './styles';
import InvoiceText from '../../../components/invoiceText/invoiceText'; 
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import { convertDate, DuplicateInvoice, DuplicateInvoiceRefurb, formatNumberWithCommas,  getWelcomeName, numberToWords, } from '../../../constants/categories';
import auth from '@react-native-firebase/auth';  
import firestore from '@react-native-firebase/firestore';
import { setGeneratedRefurbishInvoiceList, setRefurbishInvoiceList, setToUpdate, setUserName} from '../../../store/invoices'; 
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { refurbishStyles } from '../../../constants/refurbishStyles';
import { CompanyName, displayFinalCalculations, TableHeader } from '../../../constants/htmlContent';
import { createPDF2 } from '../../../constants/helperFunctions';
import InvoicePdf from '../../../components/InvoicePdf';

  
 
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
  }, [user, dispatch]);

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
  }, [isFocused, user, invoiceList, invoiceList?.uid,invoiceList?.Paid, invoiceList?.invoiceType]);

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


  const pdfContent = () => {
    const content = invoiceList?.Product?.map((item) => { 
      const subTotal = item?.Amount    
  
     const discount = invoiceList?.Discount?.trim() !== "" ? subTotal * (parseFloat(invoiceList?.Discount) / 100) : 0
     let sumTotal = ( parseFloat(subTotal) + parseFloat(invoiceList?.Transportation || 0) +  
    parseFloat(invoiceList?.Installation || 0));
     if (invoiceList?.Discount?.trim() !== "" || !isNaN(invoiceList?.Discount)) {  
        sumTotal -= discount   
     }  
     if(invoiceList?.selectedVAT === "No") {
      Vat = 0
    }  
     let Vat = 0
     if(invoiceList?.selectedVAT === "Yes") {
       Vat = (7.5/100) * (sumTotal)
     }
  
    const GrandTotal = sumTotal + Vat
    console.log("item",item)  
    console.log()
    const AmountInWords = numberToWords(GrandTotal) 
  
    const formattedDescription  = `${item?.Description} <br /> <strong>COLOUR: TBD BY CLIENT</strong>  `

        return  `   
      
       <div class="page-content">
                <div class="space borderAround"></div>
    
                          <div class="container  borderWall"> 
                  <div id="shiftImage">
                  <img src="https://firebasestorage.googleapis.com/v0/b/planify-1ce36.appspot.com/o/Cristo.JPG?alt=media&token=505360c1-a8c0-40d0-9df9-cc2b56df6b7c"
                  alt="Cristo Invoice"/> 
                </div>
                
                <div class="text"> 
                  <h2>CRISTO PROJECTS LIMITED</h2>
                  <div class="align-text">
                  <p class="alignFactory color">FACTORY: 10 LEYE PRATT STREET, OFF ISHERI-MAGODO ROAD, LAGOS</p>
                  
                  
                <div class="Telphone"> <p class="color" >Tel: 08030881676, 09139057062</p>  
                
                  <h3 class="invoice" >${invoiceList?.invoiceType}</h3>
                  <p class="color" >INVOICE NO: ${invoiceList?.invoiceNo}</p>
                  <p class="color">TIN: 31590437-0001</p></div>
    
                  </div>
    
    
                </div>
              
              </div>
    
              <div class="descriptionContainer borderWall">
    
                <div class="description">
                 <p class="color">Attn: ${invoiceList?.Attention}</p>
                 <p class="color">${invoiceList?.phoneNumber }</p> 
                <p class="color"> ${invoiceList?.CompanyName}</p> 
                <p class="color">LOCATION: ${invoiceList?.Address}</p> 
                </div>
     
                <div class="date">
                <p class="color" > Date: ${dateFormatted} </p> 
                ${getName()}   
                </div>   
    
              </div> 
    
          
              <table>
    
              ${TableHeader()}  
        
                <tbody>
    
                <tr>
                    <td colspan="5" class="spacerefurb" ><h2>${item.label}</h2></td> 
                  </tr>   
    
        <tr>   
          <td><span class="outside-number">${1}</span> <img class="furniture" style="height: 175px; width: 200px;" src=${item.ImageUri} alt="furniture"></td>
          <td class="center">${formattedDescription}</td>  
          <td class="center">${item?.Quantity}</td>
          <td class="right">${formatNumberWithCommas(item?.UnitPrice)}</td> 
          <td class="right total-amount">${formatNumberWithCommas(item?.Amount)}</td>  
        </tr> 
    
                   
                  <tr>
    
                    <tr>
                    <td colspan="5" class="space" ></td> 
                  </tr>   
                ${displayFinalCalculations(invoiceList,item,AmountInWords,GrandTotal,subTotal,sumTotal,discount,Vat)} 
  
                </tr>
                </tbody>
    
     
            </table>     

            </div> 
    
    
      `; 
      })
      return content
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
          ${refurbishStyles} 
        </style> 
      </head>
    
    
                <body> 
       ${pdfContent()?.join('')} 

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
      dispatch(setToUpdate()); 
      navigation.navigate("GeneratedRefurbishInvoiceList")  
  }); 
     
  } catch (error) {
      console.error("Error deleting product: ", error);
  }
};


const DuplicateInvoice2 = async (invoiceList) => {
  DuplicateInvoiceRefurb(invoiceList) 
 navigation.navigate("GeneratedRefurbishInvoiceList")      
} 
  
const generatePDF = () => {
  createPDF2(invoiceList,htmlContentPage,count,setCount,true) 
}

  return (
    <SafeAreaView style={styles.container} key={invoiceList?.uid || 'default'}>
         <Header title={`${invoiceList?.Attention} Invoice`}   />   
         <Text style={styles.invoiceText2}>Welcome, {getWelcomeName()} </Text>

    <InvoicePdf invoiceList={invoiceList} item2={item2} DuplicateInvoice2={DuplicateInvoice}
                  handleNavigateEditInvoice={handleNavigateEditInvoice} generatePDF={generatePDF}
                   handleDelete={handleDelete} refreshing={refreshing} onRefresh={onRefresh} dateFormatted={dateFormatted}/>      
 

    </SafeAreaView>  
  ) 
}

export default React.memo(GeneratedRefurbishInvoice)

