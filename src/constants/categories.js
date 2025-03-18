import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux'; 
import { setProductItem } from '../store/invoices';
import { setAllProduct } from '../store/invoices';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'; 
import storage from '@react-native-firebase/storage';
import { Alert, PermissionsAndroid } from 'react-native';
import { fetchGeneratedInvoice } from '../store/redux-thunks/GeneratedInvoiceThunk';
import { useGetName } from './customhook';
 

export const categories = [
  {
    label: 'Quick Task',
    value: 'quick_task', 
  },
  {
    label: 'Urgent',
    value: 'urgent',
  },
  {
    label: 'Important',
    value: 'important',
  },
  {
    label: 'Nice to Have',
    value: 'nice_to_have',
  },
  {
    label: 'Low Priority',
    value: 'low_priority',
  },
];




export function numberToWords(num) {
   const realNum = Math.floor(num) 
  const belowTwenty = [
      'ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 
      'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
  ];
  const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
  const scales = ['', 'THOUSAND', 'MILLION', 'BILLION'];

  function numberToWordsHelper(n) {
      if (n < 20) return belowTwenty[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + belowTwenty[n % 10] : '');
      if (n < 1000) return belowTwenty[Math.floor(n / 100)] + ' HUNDRED' + (n % 100 ? ' AND ' + numberToWordsHelper(n % 100) : '');

      for (let i = 0, unit = 1; i < scales.length; i++, unit *= 1000) {
          if (n < unit * 1000) {
              return numberToWordsHelper(Math.floor(n / unit)) + ' ' + scales[i] + (n % unit ? ', ' + numberToWordsHelper(n % unit) : '');
          }
      }
  }

  const words = numberToWordsHelper(realNum); 
  return words + ' NAIRA ONLY';
}


export function numberToWordsRep(num) {
  const realNum = Math.floor(num) 
 const belowTwenty = [
     'ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 
     'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
 ];
 const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
 const scales = ['', 'THOUSAND', 'MILLION', 'BILLION'];

 function numberToWordsHelper(n) {
     if (n < 20) return belowTwenty[n];
     if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + belowTwenty[n % 10] : '');
     if (n < 1000) return belowTwenty[Math.floor(n / 100)] + ' HUNDRED' + (n % 100 ? ' AND ' + numberToWordsHelper(n % 100) : '');

     for (let i = 0, unit = 1; i < scales.length; i++, unit *= 1000) {
         if (n < unit * 1000) {
             return numberToWordsHelper(Math.floor(n / unit)) + ' ' + scales[i] + (n % unit ? ', ' + numberToWordsHelper(n % unit) : '');
         }
     }
 }

 const words = numberToWordsHelper(realNum); 
const capitalizedWords = words.split(' ') 
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');

 return capitalizedWords + ' Naira Only';
}


export const formatNumberWithCommas = (number) => {
  // Convert the input to a number if it's a string
  const numericValue = Math.floor(Number(number)); 

  // Check if numericValue is a valid number
  if (!isNaN(numericValue)) {
    // If it's a valid number, format it with commas
    const num = numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num + ".00"  
  } else {
    // If it's not a valid number, return the original input
    return number; 
  }  
};



export const getWelcomeName = () => {
  const GoogleUser = useSelector(state =>state?.invoices?.GoogleUser )
  const UserName = useSelector(state => state?.invoices?.UserName ) 
  if(GoogleUser?.name) {
    return GoogleUser?.name
  }

  if(UserName?.displayName) {
    return UserName?.displayName
  } 
  return ""
}

export const getName = () => {
  const GoogleUser = useSelector(state => state?.invoices?.GoogleUser);
  const UserName = useSelector(state => state?.invoices?.UserName);

  if (GoogleUser?.name) {
    return `<p class="color">Sales Rep.: ${GoogleUser?.name}</p>`;
  }

  if (UserName?.displayName) { 
    return `<p class="color">Sales Rep.: ${UserName?.displayName}</p>`;
  }

  return ''; 
}

export const getProductItem = () => {

  const user = useSelector(state => state?.invoices?.user)

  const fetchItem = () => {
    firestore() 
    .collection('ProductItem')
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
       
        //function to get the latest invoice. 
  const sortedInvoices =  newProductItem.sort((a, b) => b.invoiceDate - a.invoiceDate); 
         dispatch(setProductItem(sortedInvoices[0]));    
         dispatch(setAllProduct(sortedInvoices));    
    });  
  }
  fetchItem()
    return (
      <Text>Book</Text>
    )
}

export const extractTimestamp = (path) => {
  const segments = path.split(".");
  const timestampSegment = segments[segments.length - 2];
  const timestamp = timestampSegment.substring(timestampSegment.length - 13);
  return timestamp; 
}


export const convertDate = (date) => {

  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0'); // Add leading zero to day
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero to month
  const year = dateObj.getFullYear()

  const formattedDate = `${day}/${month}/${year}`; 
  
  return formattedDate;
} 

export const calculateTotalAmount = (items) => {
  const totalAmount = items?.reduce((total, item) =>  total + item?.Amount, 0);   
  return totalAmount; 
};     

export const takePhotoFromCamera = (index,setProductItems,setModalVisible) => {
  setModalVisible(false);
  launchCamera(
    {  
      mediaType: 'photo',
      cameraType: 'back',
    },
    (response) => {
      if (!response.didCancel && response.assets?.[0]?.uri) {
        setProductItems((prevItems) => {
          const updatedItems = [...prevItems];
          updatedItems[index] = {
            ...updatedItems[index],
            ImageUri: response.assets[0].uri,
            uploaded: false, // Reset to false when a new image is selected
          };
          console.log('Updated Item:', updatedItems[index]); 
          return updatedItems;
        });
      }
    }
  ); 
};


export   const choosePhotoFromLibrary = (index,setProductItems,setModalVisible) => {
    setModalVisible(false);
  
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      (response) => {
        if (!response.didCancel && response.assets?.[0]?.uri) {
          setProductItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems[index] = {
              ...updatedItems[index],
              ImageUri: response.assets[0].uri,
              uploaded: false, // Reset to false when a new image is selected
            };
            console.log('Updated Item:', updatedItems[index]); 
            return updatedItems;
          });
        }
      }
    );
  };




  export const takePhotoFromCamera2 = (index,setProductItems,setModalVisible) => {
    setModalVisible(false);
    launchCamera(
      {  
        mediaType: 'photo',
        cameraType: 'back',
      },
      (response) => {
        if (!response.didCancel && response.assets?.[0]?.uri) {
          setProductItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems[index] = {
              ...updatedItems[index],
              ImageUri: response.assets[0].uri,
              uploaded: false, // Reset to false when a new image is selected
            };
            console.log('Updated Item:', updatedItems[index]); 
            return updatedItems;
          });
        }
      }
    ); 
  };
  
  
  export   const choosePhotoFromLibrary2 = (index,setProductItems,setModalVisible) => {
      setModalVisible(false);
    
      launchImageLibrary(
        {
          mediaType: 'photo',
        },
        (response) => {
          if (!response.didCancel && response.assets?.[0]?.uri) {
            setProductItems((prevItems) => {
              const updatedItems = [...prevItems];
              updatedItems[index] = {
                ...updatedItems[index],
                ImageUri: response.assets[0].uri,
                uploaded: false, // Reset to false when a new image is selected
              };
              console.log('Updated Item:', updatedItems[index]); 
              return updatedItems;
            });
          }
        }
      );
    };

  

export const uploadImage = async (index, productItems, user, setProductItems, handleProductItemChange, setTransferred,imagePath) => {
  if (!productItems[index].ImageUri || productItems[index].ImageUri === imagePath) {
    Alert.alert("Please select an image");
    return; 
  }

  const uploadUri = productItems[index].ImageUri;
  let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
  const extension = filename.split(".").pop();
  const name = filename.split(".").slice(0,-1).join(".");
  filename = name + Date.now() + "." + extension;
 
if (productItems[index].uploaded) {
  console.log(`productItems[index].uploaded`,productItems[index].uploaded)
  Alert.alert("Image is already uploaded");
  return; 
}  

  handleProductItemChange(index, 'uploading', true);
  setTransferred(0);
  const directory = user?.uid;
  const task = storage().ref(`${directory}/images/${filename}`).putFile(uploadUri);

  task.on('state_changed', taskSnapshot => {
    console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
    setTransferred(Math.round(taskSnapshot.bytesTransferred/taskSnapshot.totalBytes) * 100);
  });

  try {
    await task;
  } catch(e) {
    console.log(e);
  }

  const downloadURL = await storage().ref(`${directory}/images/${filename}`).getDownloadURL();
  handleProductItemChange(index, 'ImageUri', downloadURL);
 
    // Update the uploaded state after the task completes
    task.then(() => {
      setProductItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[index] = { ...updatedItems[index], ImageUri: downloadURL, uploaded: true };
        console.log("UpdatedItems:", updatedItems)
        return updatedItems;
      }); 
    }); 

    Alert.alert(
      "Image Uploaded",
      "Image Uploaded to the Cloud Successfully"
    );
  // Set a timeout to wait for the state update

};


export const requestPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    if (
      granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log("Permissions granted");
    } else {
      Alert.alert("Permission denied", "Camera or storage permissions are required.");
    }
  } catch (err) {
    console.warn(err);
  } 
};

export const GenerateInvoiceNo = () => {
  let currentDate = new Date();
  let monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  let currentMonthIndex = currentDate.getMonth();
  let currentMonth = monthNames[currentMonthIndex];
  let num1, num2;
  do {
    num1 = Math.floor(Math.random() * 100);
    num2 = Math.floor(Math.random() * 100); 
  } while (num1 === num2); 
  var result = num1.toString()
   const str = "2024" + currentMonth + result
   console.log(str)
   return str
 }
 
 

 export const DuplicateInvoice = async (invoiceList) => {

  const invoiceNo = GenerateInvoiceNo();
    
  if(invoiceList?.invoiceType === "TECHNICAL PROPOSAL" ) {
    await firestore()
    .collection(`GeneratedInvoice`) 
    .add({  
      Product:invoiceList?.Product,
      invoiceDate:invoiceList?.invoiceDate,
      Address:invoiceList?.Address,
      invoiceNo:invoiceNo, 
      Date: invoiceList?.Date,
      createdAt: firestore.FieldValue.serverTimestamp(),
      CompanyName:invoiceList?.CompanyName,
      Attention:invoiceList?.Attention, 
      phoneNumber: invoiceList?.phoneNumber, 
      Email: invoiceList?.Email, 
      invoiceType:invoiceList?.invoiceType,
      userId: invoiceList?.userId,  
      userName: invoiceList?.userName,
      Paid: "No",  
      GoogleUserName: invoiceList?.GoogleUserName,   
    }) 
    .catch(e => { 
      console.log('error when adding information :>> ', e);
      Alert.alert(e.message);   
    }); 
    return; 
  }

  await firestore()
  .collection('GeneratedInvoice') 
  .add({ 
    Product:invoiceList?.Product,
    invoiceDate:invoiceList?.invoiceDate,
    Address:invoiceList?.Address,
    invoiceNo:invoiceNo, 
    Date: invoiceList?.Date,
    createdAt: firestore.FieldValue.serverTimestamp(),
    CompanyName:invoiceList?.CompanyName,
    Attention:invoiceList?.Attention, 
    phoneNumber: invoiceList?.phoneNumber, 
    Email: invoiceList?.Email, 
    invoiceType:invoiceList?.invoiceType,
    subTotal:invoiceList?.subTotal,
    discountValue:invoiceList?.discountValue,
    Vat:invoiceList?.Vat,
    GrandTotal: invoiceList?.GrandTotal,
    sumTotal:invoiceList?.sumTotal,
    DeliveryPeriod:invoiceList?.DeliveryPeriod,
    Validity:invoiceList?.Validity,
    Discount:invoiceList?.Discount,
    Installation:invoiceList?.Installation, 
    Note:invoiceList?.Note, 
    Transportation:invoiceList?.Transportation, 
    selectedPaymentPlan:invoiceList?.selectedPaymentPlan, 
    selectedWarranty:invoiceList?.selectedWarranty,
    selectedVAT: invoiceList?.selectedVAT,
    AmountInWords: invoiceList?.AmountInWords,
    userId: invoiceList?.userId,  
    userName: invoiceList?.userName,
    Paid: "No",  
    GoogleUserName: invoiceList?.GoogleUserName,   
  })
  .catch(e => { 
    console.log('error when adding information :>> ', e);
    Alert.alert(e.message);   
  }); 
} 

export const DuplicateInvoiceRefurb = async (invoiceList) => {

  const invoiceNo = GenerateInvoiceNo();

  if(invoiceList?.invoiceType === "TECHNICAL PROPOSAL" ) {
    await firestore()
    .collection('GeneratedRefurbishInvoice') 
    .add({  
      Product:invoiceList?.Product, 
      invoiceDate:invoiceList?.invoiceDate,
      Address:invoiceList?.Address,
      invoiceNo:invoiceNo, 
      Date: invoiceList?.Date,
      createdAt: firestore.FieldValue.serverTimestamp(),
      CompanyName:invoiceList?.CompanyName,
      Attention:invoiceList?.Attention, 
      phoneNumber: invoiceList?.phoneNumber, 
      Email: invoiceList?.Email, 
      invoiceType:invoiceList?.invoiceType,
      userId: invoiceList?.userId,  
      userName: invoiceList?.userName,
      Paid: "No",  
      GoogleUserName: invoiceList?.GoogleUserName,   
    }) 
    .catch(e => { 
      console.log('error when adding information :>> ', e);
      Alert.alert(e.message);   
    }); 
    return;  
  }

  const newInvoice = {
    Product:invoiceList?.Product,
    invoiceDate:invoiceList?.invoiceDate,
    Address:invoiceList?.Address,
    invoiceNo:invoiceNo, 
    Date: invoiceList?.Date, 
    createdAt: firestore.FieldValue.serverTimestamp(),
    CompanyName:invoiceList?.CompanyName,
    Attention:invoiceList?.Attention, 
    phoneNumber: invoiceList?.phoneNumber, 
    Email: invoiceList?.Email,  
    invoiceType:invoiceList?.invoiceType,
    Vat:invoiceList?.Vat,
    DeliveryPeriod:invoiceList?.DeliveryPeriod,
    Validity:invoiceList?.Validity,
    Discount:invoiceList?.Discount,
    Installation:invoiceList?.Installation,
    Note:invoiceList?.Note, 
    Transportation:invoiceList?.Transportation, 
    selectedPaymentPlan:invoiceList?.selectedPaymentPlan,
    selectedVAT: invoiceList?.selectedVAT,
    userId: invoiceList?.userId,  
    userName: invoiceList?.userName, 
    Paid: "No", 
    GoogleUserName: invoiceList?.GoogleUserName,  
  } 

  await firestore()
  .collection('GeneratedRefurbishInvoice')   
  .add(newInvoice)
  .catch(e => { 
    console.log('error when adding information :>> ', e);
    Alert.alert(e.message);    
  }); 
}  


export const DuplicateReceipt = async (receipt) => {

  const invoiceNo = GenerateInvoiceNo();

    const newReceipt = {
      CheckNumber:receipt?.CheckNumber,  
      Description: receipt?.Description,
      AmountPaid: receipt?.AmountPaid,
      paymentMethod: receipt?.paymentMethod,
      Job: receipt?.Job, 
      Date: receipt?.Date,
      createdAt: firestore.FieldValue.serverTimestamp(),
      CompanyName: receipt?.CompanyName, 
      Address: receipt?.Address, 
      invoiceNo: invoiceNo, 
      GrandTotal: receipt?.GrandTotal ? receipt?.GrandTotal : receipt?.Product[0]?.GrandTotal, 
      userName: receipt?.userName ? receipt?.userName: "",    
      GoogleUserName: receipt?.GoogleUserName ? receipt?.GoogleUserName : "",
      Quantity:receipt?.Quantity, 
      Attention: receipt?.Attention,
      phoneNumber: receipt?.phoneNumber,  
      ImageUriSave: receipt?.ImageUriSave ? receipt?.ImageUriSave : "", 
      userId: receipt?.userId    
    }

 await  firestore()
  .collection('Receipt') 
  .add(newReceipt)
  .catch(e => {  
    console.log('error when adding information :>> ', e);
    Alert.alert(e.message);   
  }); 
}  





export const uploadImageRefurb = async (batchIndex, productItems, user, setProductItems, setTransferred, imagePath) => {
const batch = productItems[batchIndex];
 
  if (!batch.ImageUri || batch.ImageUri === imagePath) {
    Alert.alert("Please select an image");
    return;
  }

  if (batch.uploaded) {
    Alert.alert("Image is already uploaded");
    return; 
  }

  const uploadUri = batch.ImageUri;
  let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
  const extension = filename.split(".").pop();
  const name = filename.split(".").slice(0, -1).join(".");
  filename = `${name}_${Date.now()}.${extension}`;

  setProductItems((prevItems) =>
    prevItems.map((item, i) =>
      i === batchIndex ? { ...item, uploading: true } : item
    )
  ); 

  setTransferred(0);
  const directory = user?.uid;
  const storageRef = storage().ref(`${directory}/images/${filename}`);

  try {
    const task = storageRef.putFile(uploadUri);
    
    task.on('state_changed', (taskSnapshot) => {
      const progress = Math.round((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100);
      setTransferred(progress);
    });

    await task;
    
    const downloadURL = await storageRef.getDownloadURL();

    // Update state with the new image URL
    setProductItems((prevItems) =>
      prevItems.map((item, i) =>
        i === batchIndex ? { ...item, ImageUri: downloadURL, uploading: false, uploaded: true } : item
      )
    );

    Alert.alert("Image Uploaded", "Image Uploaded to the Cloud Successfully");
  } catch (error) {
    console.error("Image upload failed:", error);
    Alert.alert("Upload Failed", "There was an issue uploading the image."); 
  }
}; 


export const choosePhotoFromLibrary3 = (batchIndex, setProductItems, setModalVisible) => {
  setModalVisible(false);
  launchImageLibrary(
    {
      mediaType: 'photo',
    },
    (response) => {
      if (!response.didCancel && response.assets?.[0]?.uri) {
        setProductItems((prevItems) => {
          return prevItems.map((batch, i) =>
            i === batchIndex
              ? { ...batch, ImageUri: response.assets[0].uri, uploaded: false }
              : batch
          );
        });
      }
    }
  ); 
};


export const takePhotoFromCamera3 = (batchIndex, setProductItems, setModalVisible) => {
  setModalVisible(false);
  launchCamera(
    {
      mediaType: 'photo',
      cameraType: 'back',
    },
    (response) => {
      if (!response.didCancel && response.assets?.[0]?.uri) {
        setProductItems((prevItems) => {
          return prevItems.map((batch, i) =>
            i === batchIndex
              ? { ...batch, ImageUri: response.assets[0].uri, uploaded: false }
              : batch 
          );
        });
      }
    }
  ); 
};
