import { formatNumberWithCommas } from "./categories";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'; 


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
  

      
  export const displayFinalCalculations = (invoiceList,item,AmountInWords,GrandTotal,subTotal,sumTotal,discount,Vat) => {
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
      <td colspan="4" class=" left">${item?.Warranty}</td>
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
  
