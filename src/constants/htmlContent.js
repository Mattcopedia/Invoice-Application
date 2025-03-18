import firestore from '@react-native-firebase/firestore';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { calculateTotalAmount, formatNumberWithCommas, GenerateInvoiceNo, numberToWords } from "./categories";
import { refubishStylesFabric } from './refubishStylesFabric';
import { refurbishStyles } from "./refurbishStyles";


export const sumTotalField = (invoiceList,discount) => {
  
    if(invoiceList?.Discount?.trim() == "" || invoiceList?.Discount == undefined || isNaN(invoiceList?.Discount)
      ||invoiceList?.Discount <= 0
    ) {
     return ``    
    }  
  
   return  `  
   <tr>
   <td colspan="4" class="totalbody">LESS ${invoiceList?.Discount}% DISCOUNT</td> 
   <td class="total-amount">-${formatNumberWithCommas(discount)}</td>
  </tr>
  ` 
  }; 
  
  export const NoteField = (invoiceList) => {
    if(invoiceList?.Note?.trim() !== "") {
      return `
      <tr>
      <td colspan="1" class="totalbody">NOTE: </td> 
      <td colspan="4" class=" left">${invoiceList?.Note}</td>
    </tr>   `
    }
    return ``
  }
  
  export const CompanyName = (invoiceList) => {
    if(invoiceList?.CompanyName?.trim() !== "" || invoiceList?.CompanyName?.trim() !== undefined) {
      return `
      ${invoiceList?.CompanyName} 
        `  
    } 
    return ``
  }
  
  export const VATFIELD = (invoiceList,Vat) => {
    if(invoiceList?.selectedVAT === "Yes") {
      return `
      <tr>
      <td colspan="4" class="totalbody">ADD 7.5% VAT</td> 
      <td class="total-amount">${formatNumberWithCommas(Vat)}</td>  
      </tr> 
    `
    } 
  
    return ``
  }
  
  export const TransportationField = (invoiceList) => {
    if(invoiceList?.Transportation?.trim() === "0") {
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
  
  export const InstallationField = (invoiceList) => {
    if(invoiceList?.Installation?.trim() === "0") {
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
  
  export const TableHeader = () => {
  
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
  

      
  export const displayFinalCalculations5 = (invoiceList,item,AmountInWords,GrandTotal,subTotal,sumTotal,discount,Vat,Warranty,index) => {
    if(invoiceList?.invoiceType !== "TECHNICAL PROPOSAL") {
          return ` 
          <tr>
          <td colspan="4" class="totalbody">SUBTOTAL</td> 
          <td class="total-amount">${formatNumberWithCommas(subTotal)}</td> 
      </tr> 
    
      ${sumTotalField(invoiceList,discount)} 
   
  
      ${TransportationField(invoiceList)}  
  
       ${InstallationField(invoiceList)}  
  
      <tr>
      <td colspan="4" style="height: 14px; " class="totalbodyUp"></td> 
      <td colspan="1" style="height: 14px; " class="totalbodyUp"></td> 
      </tr>
  
  
      <tr>
      <td colspan="4" class="totalbodyPad">TOTAL</td> 
      <td class="total-amount">${formatNumberWithCommas(sumTotal)}</td>
      </tr>
  
  
  
      ${VATFIELD(invoiceList,Vat)} 
  
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
      <td colspan="4" class=" left"> ${invoiceList?.Validity} DAYS</td> 
      </tr>
  
  
      <tr>
      <td colspan="1" class="totalbody">DELIVERY PERIOD:</td> 
      <td colspan="4" class=" left">${invoiceList?.DeliveryPeriod} DAYS</td>
      </tr>
  
  
      <tr>
      <td colspan="1" class="totalbody">WARRANTY: </td> 
      <td colspan="4" class=" left">${Warranty ? item?.Warranty : item?.Product[index]?.Warranty }</td>  
      </tr> 
   
  
      <tr>
      <td colspan="1" class="totalbody">PAYMENT TERMS: </td> 
      <td colspan="4" class=" left">${invoiceList?.selectedPaymentPlan}</td>
      </tr>
  
      <tr>
      <td colspan="1" class="totalbody">ACCOUNT DETAILS: </td> 
      <td colspan="4" class=" left">ZENITH BANK, 1310056578, CRISTO PROJECTS LIMITED</td>
      </tr>
  
      ${NoteField(invoiceList)} 
  
      <tr>
      <td colspan="5" class="space" ></td> 
      </tr>
          `
    }
  
    return ` 
    `
  } 


  export const choosePhotoFromLibrary = (setImage,setModalVisible,setUploaded) => {
    setModalVisible(false);
    launchImageLibrary( 
      { 
        mediaType: 'photo',
      },
      response => {
        if (!response.didCancel && response.assets?.[0]?.uri) {
          setImage(response.assets[0].uri)   
          setUploaded(false)  
        }
      },
    );
  } 


 export const takePhotoFromCamera = (setImage,setModalVisible,setUploaded) => {
  setModalVisible(false);
    launchCamera(
      { 
        mediaType: 'photo',
        cameraType: 'back',
      },
      response => {
        if (!response.didCancel && response.assets?.[0]?.uri) {
          console.log('Selected Image:', response.assets[0].uri);
          setImage(response.assets[0].uri)
          setUploaded(false)
        } 
      },
    ); 
  }


  
const UpdateAmount = async (GrandTotal, item) => {
  const currentData = await firestore().collection('RefurbishmentProduct').doc(item?.uid).get();
  const currentGrandTotal = currentData?.data()?.GrandTotal;

  if (currentGrandTotal === GrandTotal) {
    return; // No need to update if the GrandTotal hasn't changed
  }

  await firestore()
    .collection('RefurbishmentProduct')
    .doc(item?.uid)
    .update({
      GrandTotal: GrandTotal,
    });
  console.log("ITEM", item);
} 
  


  export const pdfContent = (finalProduct,invoices,summary,dateFormatted,getName) => {
  let content = finalProduct?.map((item) => { 
    const subTotal = item?.Amount   
    console.log("summary",summary)
   const discount = summary?.Discount?.trim() !== "" ? subTotal * (parseFloat(summary?.Discount) / 100) : 0
   let sumTotal = ( parseFloat(subTotal) + parseFloat(summary?.Transportation || 0) +  
  parseFloat(summary?.Installation || 0));
   if (summary?.Discount?.trim() !== "" || !isNaN(summary?.Discount)) {  
      sumTotal -= discount   
   }  
   let Vat = 0
   if(summary?.selectedVAT === "Yes") { 
     Vat = (7.5/100) * (sumTotal)
   }
   if(summary?.selectedVAT === "No") {
     Vat = 0 
   } 
  
  
   GrandTotal = sumTotal + Vat 
  console.log(GrandTotal) 
  UpdateAmount(GrandTotal,item)  
  
  const AmountInWords = numberToWords(GrandTotal) 
  const invoiceNo = GenerateInvoiceNo() 
   const formattedDescription  = `${item?.Description} <br /> <strong>COLOUR: TBD BY CLIENT</strong>  `
  
   const sumTotalField = () => {
  
    if(summary?.Discount?.trim() == "" || summary?.Discount == undefined || isNaN(summary?.Discount)
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
   if(summary?.Transportation?.trim() === "0") {
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
   if(summary?.Installation?.trim() === "0") {
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
  
  
  
     <tr class="upSpace">
     <td colspan="1" class="totalbody">AMOUNT IN WORDS:</td> 
     <td colspan="4" class="total-amount center">${AmountInWords}</td>
     </tr>
  
     <tr>
     <td colspan="1" class="totalbody">VALIDITY OF QUOTE:</td> 
     <td colspan="4" class=" left"> ${summary?.Validity} DAYS</td>
     </tr>
  
  
     <tr>
     <td colspan="1" class="totalbody">DELIVERY PERIOD:</td> 
     <td colspan="4" class=" left">${summary?.DeliveryPeriod} DAYS</td>
     </tr>
  
  
     <tr>
     <td colspan="1" class="totalbody">WARRANTY: </td> 
     <td colspan="4" class=" left">${item?.Warranty}</td>
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
  
      return  `   
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
              
                <h3 class="invoice" >${invoices?.invoiceType}</h3>
                <p class="color" >INVOICE NO: ${invoiceNo}</p>
                <p class="color">TIN: 31590437-0001</p></div>
  
                </div>
  
              </div>
            
            </div>
  
            <div class="descriptionContainer borderWall">
  
              <div class="description">
                <p class="color">Attn: ${invoices?.Attention}</p>
                 <p class="color">${invoices?.phoneNumber}</p>
                <p class="color"> ${invoices?.Companyname} </p>  
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
              ${displayFinalCalculations()} 
  
              </tr>
              </tbody>
  
  
          </table>        
          </div> 
   
            </body>
          </html>
  
    `; 
    });
  
    return content  
  }  
 

  export const pdfContent3 = (finalSortedArray,invoices,summary,dateFormatted,getName) => {
    let content = finalSortedArray?.map((item,index) => {  
      const subTotal = calculateTotalAmount(item?.Product)     
     const discount = summary?.Discount?.trim() !== "" ? subTotal * (parseFloat(summary?.Discount) / 100) : 0
     let sumTotal = ( parseFloat(subTotal) + parseFloat(summary?.Transportation || 0) +  
    parseFloat(summary?.Installation || 0));
     if (summary?.Discount?.trim() !== "" || !isNaN(summary?.Discount)) {  
        sumTotal -= discount   
     }  
     let Vat = 0
     if(summary?.selectedVAT === "Yes") { 
       Vat = (7.5/100) * (sumTotal)
     }
     if(summary?.selectedVAT === "No") {
       Vat = 0 
     } 
    
    
     GrandTotal = sumTotal + Vat  
    console.log(GrandTotal)  
    
    
    const AmountInWords = numberToWords(GrandTotal)  
    const invoiceNo = GenerateInvoiceNo() 


     const createTableRows = () => {
      
       const tableRows = item?.Product?.map((item) => {   
        
        const formattedDescription  = `${item?.Description} <br /> <strong>COLOUR: TBD BY CLIENT</strong>  `
        UpdateAmount(GrandTotal,item)  

         return `
            <tr>   
          <td><span class="outside-number">${1}</span> <img class="furniture" style="height: 175px; width: 200px;" src=${item.ImageUri} alt="furniture"></td>
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
    
      if(summary?.Discount?.trim() == "" || summary?.Discount == undefined || isNaN(summary?.Discount)
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
     if(summary?.Transportation?.trim() === "0") {
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
     if(summary?.Installation?.trim() === "0") {
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
    
    
    
       <tr class="upSpace">
       <td colspan="1" class="totalbody">AMOUNT IN WORDS:</td> 
       <td colspan="4" class="total-amount center">${AmountInWords}</td>
       </tr>
    
       <tr>
       <td colspan="1" class="totalbody">VALIDITY OF QUOTE:</td> 
       <td colspan="4" class=" left"> ${summary?.Validity} DAYS</td>
       </tr>
    
    
       <tr>
       <td colspan="1" class="totalbody">DELIVERY PERIOD:</td> 
       <td colspan="4" class=" left">${summary?.DeliveryPeriod} DAYS</td>
       </tr>
    
    
       <tr>
       <td colspan="1" class="totalbody">WARRANTY: </td> 
       <td colspan="4" class=" left">${item?.Product[index]?.Warranty}</td>
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
    
        return  `    
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
          ${refubishStylesFabric} 
        </style> 
      </head>
    
    
                <body> 
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
                
                  <h3 class="invoice" >${invoices?.invoiceType}</h3>
                  <p class="color" >INVOICE NO: ${invoiceNo}</p>
                  <p class="color">TIN: 31590437-0001</p></div>
    
                  </div>
    
                </div>
              
              </div>
    
              <div class="descriptionContainer borderWall">
    
                <div class="description">
                  <p class="color">Attn: ${invoices?.Attention}</p>
                   <p class="color">${invoices?.phoneNumber}</p>
                  <p class="color"> ${invoices?.Companyname} </p>  
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
    
                <tr>
                    <td colspan="5" class="spacerefurb" ><h2>${item.label}</h2></td> 
                  </tr>   
    
            ${createTableRows()?.join('')}           
                  <tr>
                    <tr>
                    <td colspan="5" class="space" ></td> 
                  </tr>   
                ${displayFinalCalculations()} 
    
                </tr>
                </tbody>
    
    
            </table>        
            </div> 
     
              </body>
            </html>
    
      `; 
      });
    
      return content  
    }  

  


    
 export  const pdfContent4 = (invoiceList,dateFormatted,getName) => {
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
                ${displayFinalCalculations5(invoiceList,item,AmountInWords,GrandTotal,subTotal,sumTotal,discount,Vat,true)} 
  
                </tr>
                </tbody>
    
     
            </table>     

            </div> 
    
    
      `; 
      })
      return content
  } 


  export  const pdfContent5 = ( finalInvoiceList, invoiceList,dateFormatted,getName) => {
    const content = finalInvoiceList?.Product?.map((item,index) => { 
      const subTotal = calculateTotalAmount(item?.Product)       

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
  

    const createTableRows = () => {
      
      const tableRows = item?.Product?.map((item) => {   
       
       const formattedDescription  = `${item?.Description} <br /> <strong>COLOUR: TBD BY CLIENT</strong>  `
       UpdateAmount(GrandTotal,item)  

        return `
           <tr>   
         <td><span class="outside-number">${1}</span> <img class="furniture" style="height: 175px; width: 200px;" src=${item.ImageUri} alt="furniture"></td>
         <td class="center">${formattedDescription}</td>  
         <td class="center">${item?.Quantity}</td> 
         <td class="right">${formatNumberWithCommas(item?.UnitPrice)}</td> 
         <td class="right total-amount">${formatNumberWithCommas(item?.Amount)}</td>  
       </tr> 
        ` 
      });
    
      return tableRows;  
    };

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
    
                              ${createTableRows()?.join('')} 
       
                  <tr>
    
                    <tr>
                    <td colspan="5" class="space" ></td> 
                  </tr>   
                ${displayFinalCalculations5(invoiceList,item,AmountInWords,GrandTotal,subTotal,sumTotal,discount,Vat,false,index)} 
  
                </tr>
                </tbody>
    
     
            </table>      

            </div> 
    
    
      `; 
      })
      return content
  } 