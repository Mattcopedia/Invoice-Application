

import React, { useEffect, useState } from 'react';

import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import {
  Alert,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SelectView from '../../../components/SelectedProducts/SelectView';
import Title from '../../../components/Title';
import { choosePhotoFromLibrary, requestPermissions, takePhotoFromCamera, uploadImage } from '../../../constants/categories';
import { AmountCalculator } from '../../../constants/helperFunctions';
import { setToUpdate } from '../../../store/invoices';
import { fetchInvoiceData } from '../../../store/redux-thunks/InvoiceDataThunk';
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk';
import { fetchProductSelect } from '../../../store/redux-thunks/ProductSelectThunk';
import { fetchselectedItem } from '../../../store/redux-thunks/selectedItemThunk';
import styles from './styles';

const AddProduct = ({ navigation }) => { 
  const imagePath = "https://png.pngtree.com/png-clipart/20200225/original/pngtree-image-upload-icon-photo-upload-icon-png-image_5279796.jpg"
  const dispatch = useDispatch(); 
  const invoices = useSelector(state => state?.invoices?.invoiceLatest)    
  const selectedItem  = useSelector(state => state?.invoices?.selectField);  
  const invoice  = useSelector(state => state?.invoices?.invoiceLatest);   
  const filterselectedProducts =  selectedItem 
  const [productItems, setProductItems] = useState([{ ImageUri: imagePath, Description: '', SampleCode: "", Quantity: '', UnitPrice: '', Amount: '',uploaded:false, uploading: false }]);
 
  const [productItems2, setProductItems2] = useState(filterselectedProducts);  
    
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused()    
  const [errorLoading, setErrorLoading] = useState(false); 
  const [modalVisible, setModalVisible] = useState(false);  
  const [transferred, setTransferred] = useState(0);
  const user = useSelector(state => state?.invoices?.user) 
 

  console.log(`invoiceNo`,invoice.invoiceNo)  
  console.log(`filterselectedProducts`,filterselectedProducts) 
  console.log(`selectedItem`,selectedItem)      
  console.log(`productItems2`,productItems2)   

 
   useEffect(() => {
      setProductItems2(filterselectedProducts);  
    }, [filterselectedProducts]);  

  useEffect(() => { 
  dispatch(fetchInvoiceData(user?.uid));
    if(isFocused) {
      dispatch(fetchInvoiceData(user?.uid))  
      dispatch(fetchselectedItem(user?.uid)) 
    } 
    requestPermissions()
  },[]) 


       useEffect(() => {
        AmountCalculator(productItems,setProductItems) 
         AmountCalculator(productItems2,setProductItems2) 
        },[productItems2,productItems]);   
 
   // Function to handle changes in product item fields 
   const handleProductItemChange = (index, field, value) => {
    const updatedProductItems = productItems.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setProductItems(updatedProductItems);
  }; 

  const handleProductItemChange2 = (index, field, value) => {
    const updatedProductItems = productItems2.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });  
    setProductItems2(updatedProductItems);
  }; 

  const handleBack = () => {
    navigation.goBack();
  }; 

  // Function to add a new product item
  const addProductItem = () => {
    setProductItems([...productItems, { ImageUri: imagePath, Description: '', SampleCode: "", Quantity: '', UnitPrice: '', Amount: '',uploaded:false, uploading: false }]);
  };
 

 
  const deleteProductItem = (index) => {
    const updatedProductItems = [...productItems];
    updatedProductItems.splice(index, 1); 
    setProductItems(updatedProductItems); 
  };  

  const HandleUploadImage = async (index) => {
    uploadImage(index, productItems, user, setProductItems, handleProductItemChange, setTransferred,imagePath)
 } 
 


  const onSubmit = async () => {

    let incompleteProductItemIndex = -1;
    productItems.forEach((item, index) => { 
      if (!item.Description || !item.Quantity || !item.UnitPrice ||!item.SampleCode || !item.Description.trim() === "" ||
      !item.Quantity.trim() === "" ||!item.UnitPrice.trim() === "" || !item.SampleCode.trim() === "") {
        incompleteProductItemIndex = index;
      }
    }); 
 

  
    if (incompleteProductItemIndex !== -1 && filterselectedProducts.length === 0) {
      Alert.alert('Please complete the form for adding product item ' + (incompleteProductItemIndex + 1));
      setErrorLoading(true);
      return;
    } 
   
   // Check if any image is not uploaded
   const imageNotUploadedIndex = productItems.findIndex(item => !item.uploaded);

   if (imageNotUploadedIndex !== -1 && filterselectedProducts.length === 0) {  
     Alert.alert('Please select and upload an image for all product items');
     return;
   }
 

    setLoading(true);
    setErrorLoading(false);

    try {

      const filteredItems = productItems.filter(item => item.ImageUri !== imagePath);

     

      await Promise.all(filteredItems.map(async (item) => { 
        
        const querySnapshot = await firestore()
        .collection('ProductInvoice')
        .where('Description', '==', item.Description)
        .where('SampleCode', '==', item.SampleCode)
        .where('invoiceNo', '==', invoice?.invoiceNo)
        .where('userId', '==', user?.uid)
        .get();
       
        if (!querySnapshot.empty) {
          console.log(`Skipping duplicate product: ${item.Description} - ${item.SampleCode}`);
          return; // Skip adding duplicate product  
        }

        await firestore().collection('ProductInvoice').add({
          ...item,  
          completeDescription: `${item?.Description} - ${item?.SampleCode}`,
          invoiceDate: new Date(),  
          invoiceNo:invoice?.invoiceNo, 
          checked: false, 
          userId: user?.uid,    
        });  
    
        await firestore().collection('ProductItem').add({
          ...item,  
          completeDescription: `${item?.Description} - ${item?.SampleCode}`,
          invoiceDate: new Date(),  
          invoiceNo:invoice?.invoiceNo, 
          checked: false, 
          userId: user?.uid,      
        }); 

      }));  


      await Promise.all(productItems2.map(async (item) => { 

        const querySnapshot = await firestore()
        .collection('SelectedItem')
        .where('Description', '==', item.Description)
        .where('SampleCode', '==', item.SampleCode)
        .where('invoiceNo', '==', invoice?.invoiceNo)
        .where('userId', '==', user?.uid)
        .get();
      
        if (!querySnapshot.empty) {
          console.log(`Skipping duplicate product: ${item.Description} - ${item.SampleCode}`);
          return; // Skip adding duplicate product 
        }

        await firestore().collection('SelectedItem').add({
            Description:item?.Description,
            completeDescription: item?.completeDescription,
            SampleCode: item?.SampleCode, 
            ImageUri:item?.ImageUri,
            Amount:item?.Amount,  
            Quantity:item?.Quantity, 
            UnitPrice:item?.UnitPrice,  
            checked:item?.checked,
            invoiceDate: item?.invoiceDate,
            invoiceNo: invoices?.invoiceNo, 
            userId: user?.uid,    
        }); 
      }));
      Alert.alert('All product items saved successfully');
      setLoading(false);
      dispatch(setToUpdate());
      if(invoice.invoiceType === "TECHNICAL PROPOSAL" ) {
        navigation.navigate('ExportPdf') 
      } else { 
        navigation.navigate('Summary')
      } 
      dispatch(fetchProductItem(user?.uid))  
      dispatch(fetchProductSelect(user?.uid))  
      dispatch(fetchInvoiceData(user?.uid)) 
      Keyboard.dismiss();
    } catch (error) { 
      console.log('Error when adding product items:', error.message);
      setLoading(false);
      setErrorLoading(true);
      Alert.alert('Error', 'Failed to save product items');
    }  
  };

  
  return (
    <SafeAreaView style={styles.container} >
      <Pressable style={styles.backContainer} hitSlop={8} onPress={handleBack}>
        <Image
          style={styles.backIcon}
          source={require('../../../assets/back.png')}
        />
      </Pressable> 
      <Title type="thin">Add a New Product </Title>


        <SelectView 
        productItems={productItems} setModalVisible={setModalVisible} modalVisible={modalVisible} 
        takePhotoFromCamera={takePhotoFromCamera} choosePhotoFromLibrary={choosePhotoFromLibrary}
         handleProductItemChange={handleProductItemChange} deleteProductItem={deleteProductItem} 
        filterselectedProducts={productItems2} addProductItem={addProductItem} onSubmit={onSubmit}
        loading={loading} HandleUploadImage={HandleUploadImage} transferred={transferred} setProductItems={setProductItems}
         handleProductItemChange2={handleProductItemChange2} productItems2={productItems2}
        />       
          
    </SafeAreaView>  
  ); 



};


export default React.memo(AddProduct);
