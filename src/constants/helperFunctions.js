import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Canvas from 'react-native-canvas';
import React, { useRef, useEffect } from 'react';




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
  

  const addToFirebase = async (GeneratedInvoice,user,invoices,finalProduct,Vat,subTotal,discount,
    summary,sumTotal,GoogleUser,UserName,GrandTotal,AmountInWords,invoiceDate) => {

    await firestore()  
    .collection(GeneratedInvoice) 
    .add({  
      Product:finalProduct,
      invoiceDate:invoiceDate, 
      Address:invoices?.Address,
      invoiceNo:invoices?.invoiceNo,
      Date: invoices?.invoiceDate,
      createdAt: firestore.FieldValue.serverTimestamp(), 
      CompanyName:invoices?.Companyname,
      Attention:invoices?.Attention, 
      phoneNumber: invoices?.phoneNumber,   
      Email: invoices?.Email, 
      invoiceType:invoices?.invoiceType,
      subTotal:subTotal, 
      discountValue:discount,
      Vat:Vat,
      GrandTotal: GrandTotal,
      sumTotal:sumTotal,
      DeliveryPeriod:summary?.DeliveryPeriod,
      Validity:summary?.Validity,
      Discount:summary?.Discount,
      Installation:summary?.Installation,
      Note:summary?.Note, 
      Transportation:summary?.Transportation, 
      selectedPaymentPlan:summary?.selectedPaymentPlan,
      selectedWarranty:summary?.selectedWarranty,
      selectedVAT: summary?.selectedVAT,
      AmountInWords: AmountInWords,
      userId: user?.uid,  
      userName: UserName?.displayName,
      Paid: "No", 
      GoogleUserName: GoogleUser ? GoogleUser?.name : "", 
    })
    .catch(e => { 
      console.log('error when adding information :>> ', e);
      Alert.alert(e.message);   
    }); 
  }

  const addToRefurbish = async (GeneratedInvoice,user,invoices,finalProduct,summary,GoogleUser,UserName,invoiceDate) => {
    await firestore()
    .collection(GeneratedInvoice) 
    .add({ 
      Product:finalProduct,
      invoiceDate:invoiceDate,
      Address:invoices?.Address,
      invoiceNo:invoices?.invoiceNo,
      Date: invoices?.invoiceDate,
      createdAt: firestore.FieldValue.serverTimestamp(), 
      CompanyName:invoices?.Companyname, 
      Attention:invoices?.Attention,
      invoiceType:invoices?.invoiceType,
      Vat:summary?.selectedVAT,   
      DeliveryPeriod:summary?.DeliveryPeriod,   
      Validity:summary?.Validity,
      Discount:summary?.Discount,
      Installation:summary?.Installation,
      phoneNumber: invoices?.phoneNumber,
      Email: invoices?.Email,  
      Note:summary?.Note,    
      Transportation:summary?.Transportation, 
      selectedPaymentPlan:summary?.selectedPaymentPlan,
      selectedVAT: summary?.selectedVAT,
      Paid: "No", 
      userId: user?.uid,  
      userName:UserName ? UserName?.displayName: "", 
      GoogleUserName: GoogleUser ? GoogleUser?.name : "",  
    }) 
    .catch(e => { 
      console.log('error when adding information :>> ', e);
      Alert.alert(e.message);   
    }); 
  } 

     
  const openFile = async (filepath) => {
    const path = filepath; 
    try {
      await FileViewer.open(path);  
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', 'Failed to open PDF file. Please try again.');
    }
  }

     
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
    
       
  const sanitizeFileName = (name) => {
    return name.replace(/[^a-zA-Z0-9]/g, ' ');  
  }; 

 
 export const createPDF = async (GeneratedInvoice,invoices,htmlContent,count,setCount,
    finalProduct,Vat,subTotal,discount,summary,user,sumTotal,GoogleUser,UserName,GrandTotal,AmountInWords,refurbish,invoiceDate) => {

    requestStoragePermission();
    if(refurbish) {
        addToRefurbish(GeneratedInvoice,user,invoices,finalProduct,summary,GoogleUser,UserName,invoiceDate)
    } else {
            addToFirebase(GeneratedInvoice,user,invoices,finalProduct,Vat,subTotal,discount,summary,sumTotal,GoogleUser,UserName,GrandTotal,AmountInWords,invoiceDate)
    } 


 
    let baseName;

    if(refurbish) {
        baseName = `${sanitizeFileName(invoices?.invoiceType).toUpperCase()}_${sanitizeFileName(invoices?.Attention).toUpperCase()}_REFURBISHMENT_${sanitizeFileName(invoices?.invoiceNo)}`;
    } 
     else if(invoices?.Companyname && invoices?.Companyname?.trim() !== "") {
        baseName = `${sanitizeFileName(invoices?.invoiceType).toUpperCase()}_${sanitizeFileName(invoices?.Companyname).toUpperCase()}_${sanitizeFileName(invoices?.invoiceNo)}`;
       }  
       else if ( !invoices?.Companyname && invoices?.Companyname?.trim() === "") {
        baseName = `${sanitizeFileName(invoices?.invoiceType).toUpperCase()}_${sanitizeFileName(invoices?.Attention).toUpperCase()}_${sanitizeFileName(invoices?.invoiceNo)}`;
       }
  

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
   

  
    export const createPDF2 = async (invoiceList,htmlContent,count,setCount,refurbish) => {
      
        let baseName; 

        if(refurbish) {
            baseName = `${sanitizeFileName(invoiceList?.invoiceType).toUpperCase()}_${sanitizeFileName(invoiceList?.Attention).toUpperCase()}_REFURBISHMENT_${sanitizeFileName(invoiceList?.invoiceNo)}`;
        } 
       else if(invoiceList?.CompanyName && invoiceList?.CompanyName?.trim() !== "") {
            baseName = `${sanitizeFileName(invoiceList?.invoiceType).toUpperCase()}_${sanitizeFileName(invoiceList?.CompanyName).toUpperCase()}_${sanitizeFileName(invoiceList?.invoiceNo)}`;
           }  
         else if ( !invoiceList?.CompanyName && invoiceList?.CompanyName?.trim() === "") {
            baseName = `${sanitizeFileName(invoiceList?.invoiceType).toUpperCase()}_${sanitizeFileName(invoiceList?.Attention).toUpperCase()}_${sanitizeFileName(invoiceList?.invoiceNo)}`;
           }


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

        

        
export const AmountCalculator = (productItems,setProductItems) => {
  const calculateAmount = (Quantity, UnitPrice) => {
    return Quantity * UnitPrice;
  };

  const updatedProductItems = productItems.map(item => {
    const Amount = calculateAmount(item.Quantity, item.UnitPrice);
    return { ...item, Amount };
  });

  setProductItems(prevProductItems => {
    if (JSON.stringify(prevProductItems) !== JSON.stringify(updatedProductItems)) {
      return updatedProductItems;
    }
    return prevProductItems; 
  });
}


export const handleProductItemChange = (index, field, value,productItems,setProductItems) => { 
  const updatedProductItems = productItems.map((item, idx) => {
    if (idx === index) {
      return { ...item, [field]: value };
    }
    return item;
  });
  setProductItems(updatedProductItems);
};  


        
        