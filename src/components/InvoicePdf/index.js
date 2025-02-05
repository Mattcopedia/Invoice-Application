import React from 'react'
import { ImageBackground, FlatList, RefreshControl} from 'react-native';
import {  Text, View } from 'react-native'
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import InvoiceText from '../invoiceText/invoiceText'; 
import Button from '../Button';
import moment from 'moment'; 



const InvoicePdf = ({invoiceList,item2, DuplicateInvoice2,handleNavigateEditInvoice,generatePDF,handleDelete,
    refreshing, onRefresh,dateFormatted  
 }) => {
    const navigation = useNavigation() 

    return (
        <FlatList
        data={invoiceList?.Product}  
        keyExtractor={(item, index) => index.toString()}
        key={`${invoiceList?.Paid}`}    
       // extraData={{ Paid: invoiceList?.Paid, invoiceType: invoiceList?.invoiceType }}  
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
 
 <Text style={styles?.invoiceText}>Vat</Text>
           <InvoiceText>
           {Math.ceil(invoiceList?.Vat)} 
           </InvoiceText>

           <Text style={styles?.invoiceText}>GrandTotal</Text>
           <InvoiceText>
           {Math.ceil(invoiceList?.GrandTotal)}   
           </InvoiceText>  
  
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


         <View>

      <Button style={styles.button} type="blue" onPress={generatePDF}>
             <Text>View Invoice</Text>   
           </Button> 

           <Button style={styles.button} type="blue" onPress={ () => DuplicateInvoice2(invoiceList)}>
             <Text>Duplicate Invoice</Text>   
           </Button>    


           <Button style={styles.button} type="blue" onPress={handleNavigateEditInvoice}>
             <Text>Edit Invoice</Text>   
           </Button>   

           {invoiceList?.Paid === "Yes" && invoiceList?.invoiceType === "INVOICE" && (
                       <View>
                         <Button
                           style={styles.button}
                           type="blue"
                           onPress={() => navigation.navigate('ReceiptForm', { item2 })}
                         >
                           <Text>Create Receipt</Text>
                         </Button>
                       </View>
                     )}

           </View>  

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


   <Button style={styles.button} type="blue" onPress={() => navigation.navigate('GeneratedProductEdit', { item,item2})}>
             <Text>Edit Product</Text>   
           </Button> 

       </View>
     )}
   />  
    )
}

export default React.memo(InvoicePdf)