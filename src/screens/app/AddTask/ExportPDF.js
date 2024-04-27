import React,{useState, useEffect} from 'react'
import { Image } from 'react-native';
import { TouchableOpacity, PermissionsAndroid,SafeAreaView, ImageBackground} from 'react-native';
import { StyleSheet, Text, View } from 'react-native'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import { Alert } from 'react-native';
import { setInvoices, setToUpdate } from '../../../store/invoices'; 
import { useSelector, useDispatch } from 'react-redux';
import storage from '@react-native-firebase/storage'; 
import styles from './styles';
import firestore from '@react-native-firebase/firestore';
import { setImages } from '../../../store/images';
import InvoiceText from '../../../components/invoiceText/invoiceText';
import Button from '../../../components/Button';
import { ScrollView } from 'react-native-gesture-handler';
import Header from '../../../components/Header';
import { useIsFocused } from '@react-navigation/native';
import PlusIcon from '../../../components/PlusIcon';
import DrawerContent from '../../../components/DrawerContent';
import Tabs from '../../../components/Tabs'; 

const ExportPdf = ({ navigation }) => {  
  const dispatch = useDispatch(); 
  const isFocused = useIsFocused();
  const [count,setCount] = useState(1) 
  const user = useSelector(state => state.user.data);
  const invoices = useSelector(state => state.invoices.data); //so that the invoice data can be available every where in my app.
  const toUpdate = useSelector(state => state.invoices.toUpdate);
  const images =  useSelector(state => state.images.data); 

  const getSampleImage = async () => {
    try { 
      const storageRef = storage().ref(`${user?.uid}/images`);  
      // List all images in the storage
      const imagesList = await storageRef.listAll();
      
      // Extract and sort images based on timestamp
      const sortedImages = imagesList.items.sort((a, b) => {
        const timestampA = extractTimestamp(a.path);
        const timestampB = extractTimestamp(b.path);
        return timestampB - timestampA; // Sort in descending order
      });
      // Get the latest image
      const latestImage = sortedImages[0];
      // Get the download URL of the latest image
      const uri = await latestImage.getDownloadURL(); 
      // Set image URL 
      dispatch(setImages(uri));    
    } catch (error) {
      console.error('Error getting image:', error);
      return null;
    }
  }
  
  // Function to extract timestamp from the image path
  const extractTimestamp = (path) => {
    const segments = path.split(".");
    const timestampSegment = segments[segments.length - 2];
    const timestamp = timestampSegment.substring(timestampSegment.length - 13);
    return timestamp; 
  }
  
  const handleNavigate = () => {
    navigation.navigate('UpdatePdf');   
  };  
 
  useEffect(() => {  
        firestore() 
            .collection('invoices')
            .where('userId', '==', user?.uid)
            .get()
            .then(querySnapshot => {
                const newInvoices = [];

                querySnapshot.forEach(documentSnapshot => {
                  newInvoices.push({
                    uid: documentSnapshot.id,
                    ...(documentSnapshot.data() || {}),
                  }); 
                });
               
                //function to get the latest invoice. 
          const sortedInvoices =  newInvoices.sort((a, b) => b.invoiceDate - a.invoiceDate);  
              
                 dispatch(setInvoices(sortedInvoices[0]));    
            });       
          
           getSampleImage() 
                  
}, [user, toUpdate, dispatch,isFocused]);    //user, toUpdate, dispatch
 
console.log("Image Redux",images)  

  const htmlContent = `
  <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice</title>
      <link rel="license" href="https://www.opensource.org/licenses/mit-license/">
      <style>
        ${htmlStyles}
      </style>
    </head> 
    <body>
      <header>
        <h1>Invoice</h1>
        <address> 
          <p>${invoices?.Address}</p>
        </address>
      </header>
      <article> 
        <h1>Recipient</h1>
        <img src=${images} alt="Invoice Image" style="max-width: 70%; height: auto;">
        <table class="meta"> 
          <tr>
            <th><span>Company name</span></th>
            <td><span>${invoices?.Companyname}</span></td>   
          </tr>
          <tr> 
            <th><span>Date</span></th>
            <td><span>${new Date()}</span></td>
          </tr>
     
        </table>
        <table class="inventory">
          <thead>
            <tr>
            <th><span>Description</span></th>  
              <th><span>Selected Payment Plan</span></th>
              <th><span>Selected Warranty</span></th>
              <th><span>Quantity</span></th>
              <th><span>Price</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span>${invoices?.Description}</span></td>
              <td><span>${invoices?.selectedPaymentPlan}</span></td>
              <td><span data-prefix></span><span>${invoices?.selectedWarranty}</span></td>
              <td><span>${invoices?.Quantity}</span></td> 
              <td><span data-prefix>₦</span><span>${invoices?.UnitPrice}</span></td>
            </tr>
          </tbody>    
        </table>
        <table class="balance"> 
          <tr>
            <th><span>Total</span></th>
            <td><span data-prefix>₦</span><span>${invoices?.Amount}</span></td>
          </tr>    
        </table>
      </article>
      <aside>
        <h1><span>Additional Notes</span></h1>
        <div>
          <p>A finance charge of 1.5% will be made on unpaid balances after 30 days.</p> 
        </div>
      </aside>
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


  const createPDF = async () => {
    let options = { 
      html: htmlContent,  
      fileName: `invoice(${count})`,  
      directory: "", 
      //base64: true //May Change later.
    }; 
  
    let file = await RNHTMLtoPDF.convert(options) 
    console.log(file.filePath) 

    UploadPDF(file.filePath)  

    Alert.alert('Success', `PDF saved to ${file.filePath}`, [
      {text: "Cancel", style: "cancel"},
      {text: "Open", onPress: () => openFile(file.filePath)}
    ], {cancelable: true});  
    setCount(count + 1);  
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
         <Header title="Receipt" />  
     <ScrollView> 


    {invoices?.Companyname ? (
           <View style={styles.container}>    
           <View style={styles.Photo}>
                 <ImageBackground source={{ uri: images }} style={styles.imageBackground}>
                 </ImageBackground> 
                 </View>  
     
                 <Text style={styles.invoiceText}>Company name</Text>
          <InvoiceText> 
             {invoices?.Companyname}  
          </InvoiceText>
        
          <Text style={styles.invoiceText}>Address</Text>
          <InvoiceText>
             {invoices?.Address}
          </InvoiceText>
          <Text style={styles.invoiceText}>Description</Text>
          <InvoiceText>
             {invoices?.Description}
          </InvoiceText>
       
          <Text style={styles.invoiceText}>Payment Plan</Text>
          <InvoiceText>
             {invoices?.selectedPaymentPlan}
          </InvoiceText>
        
          <Text style={styles.invoiceText}>Warranty Period</Text>
          <InvoiceText>
             {invoices?.selectedWarranty} 
          </InvoiceText>
       
          <Text style={styles.invoiceText}>Quantity</Text>
          <InvoiceText>
             {invoices?.Quantity}
          </InvoiceText>
            
          <Text style={styles?.invoiceText}>Unit Price</Text>
          <InvoiceText>
          ₦{invoices?.UnitPrice}
          </InvoiceText> 
         
          <Text style={styles.invoiceText}>Amount</Text>
          <InvoiceText>
          ₦{invoices?.Amount} 
          </InvoiceText>
          
           <Button style={styles.button} type="blue" onPress={() => createPDF()}>
                 <Text>Generate Receipt</Text>   
               </Button> 
     
               <Button style={styles.button} type="blue" onPress={handleNavigate}>
                 <Text>Update Info</Text>   
               </Button> 
         </View>     
        ) : (
          <Text style={styles.invoiceText}> Fill in an invoice</Text>
        )} 
     
    </ScrollView>
    <PlusIcon />  
     
    </SafeAreaView>  
  ) 
}

export default React.memo(ExportPdf)



const htmlStyles = `
*{
  border: 0;
  box-sizing: content-box;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
  list-style: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  vertical-align: top;
}

h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }

/* table */

table { font-size: 75%; table-layout: fixed; width: 100%; }
table { border-collapse: separate; border-spacing: 2px; }
th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
th, td { border-radius: 0.25em; border-style: solid; }
th { background: #EEE; border-color: #BBB; }
td { border-color: #DDD; }

/* page */

html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; }
html { background: #999; cursor: default; }

body { box-sizing: border-box;margin: 0 auto; overflow: hidden; padding: 0.25in; }
body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }

/* header */

header { margin: 0 0 3em; }
header:after { clear: both; content: ""; display: table; }

header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
header address p { margin: 0 0 0.25em; }
header span, header img { display: block; float: right; }
header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
header img { max-height: 100%; max-width: 100%; }

/* article */

article, article address, table.meta, table.inventory { margin: 0 0 3em; }
article:after { clear: both; content: ""; display: table; }
article h1 { clip: rect(0 0 0 0); position: absolute; }

article address { float: left; font-size: 125%; font-weight: bold; }

/* table meta & balance */

table.meta, table.balance { float: right; width: 36%; }
table.meta:after, table.balance:after { clear: both; content: ""; display: table; }

/* table meta */

table.meta th { width: 40%; }
table.meta td { width: 60%; }

/* table items */

table.inventory { clear: both; width: 100%; }
table.inventory th { font-weight: bold; text-align: center; }

table.inventory td:nth-child(1) { width: 26%; }
table.inventory td:nth-child(2) { width: 38%; }
table.inventory td:nth-child(3) { text-align: right; width: 12%; }
table.inventory td:nth-child(4) { text-align: right; width: 12%; }
table.inventory td:nth-child(5) { text-align: right; width: 12%; }

/* table balance */

table.balance th, table.balance td { width: 50%; }
table.balance td { text-align: right; }

/* aside */

aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
aside h1 { border-color: #999; border-bottom-style: solid; }
`;