

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, 
  Alert,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
  View,  
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from '../../../components/Button';  
import Input from '../../../components/Input';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setToUpdate } from '../../../store/invoices';
import colors from '../../../constants/colors';
import Title from '../../../components/Title';
import { fetchProductItem } from '../../../store/redux-thunks/ProductItemThunk';
import { fetchProductSelect } from '../../../store/redux-thunks/ProductSelectThunk';

const AddProduct = ({ navigation }) => { 
  const imagePath = "https://png.pngtree.com/png-clipart/20200225/original/pngtree-image-upload-icon-photo-upload-icon-png-image_5279796.jpg"
  const dispatch = useDispatch();
  const [productItems, setProductItems] = useState([{ ImageUri: imagePath, Description: '', SampleCode: "", Quantity: '', UnitPrice: '', Amount: '',uploaded:false, uploading: false }]);
  const [loading, setLoading] = useState(false);
  const invoice  = useSelector(state => state?.invoices?.data);   
  const [errorLoading, setErrorLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); 
  const [transferred, setTransferred] = useState(0);
  const invoiceCreated = useSelector(state => state.invoices.invoiceCreated);
  const user = useSelector(state => state?.invoices?.user) 
  const invoices = useSelector(state => state?.invoices?.data)  

 
  useEffect(() => {

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
  },[productItems]);   

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




  const takePhotoFromCamera = (index) => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.8,
      mediaType: 'photo',
      sortOrder: 'desc', 
      includeExif: true,
      forceJpg: true, 
      useFrontCamera: false, 
    }).then(image => {
      console.log(image);
      handleProductItemChange(index, 'ImageUri', image.path);
      setModalVisible(false);
      setProductItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[index] = { ...updatedItems[index], uploaded: false,uploading: false };
        console.log("UpdatedItems:", updatedItems)
        return updatedItems;
      });
    }); 

  }

  const choosePhotoFromLibrary = (index) => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.8,
      mediaType: 'photo',
      sortOrder: 'desc', 
      includeExif: true,
      forceJpg: true, 
      useFrontCamera: false,  
    }).then(image => {
      console.log(image);
      handleProductItemChange(index, 'ImageUri', image.path);
      setModalVisible(false);
      setProductItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[index] = { ...updatedItems[index], uploaded: false,uploading:false };
        console.log("UpdatedItems:", updatedItems)
        return updatedItems;
      });
    }); 
  

  }


  // Function to handle image upload
  const uploadImage = async (index) => {
    if (!productItems[index].ImageUri || productItems[index].ImageUri === imagePath) {
      Alert.alert("Please select an image");
      return; 
    }
  
    const uploadUri = productItems[index].ImageUri;
    let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
    const extension = filename.split(".").pop();
    const name = filename.split(".").slice(0,-1).join(".");
    filename = name + Date.now() + "." + extension;
  
     // Check if the image is already uploaded
  if (productItems[index].uploaded) {
    // Image is already uploaded, no need to upload again
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
      Alert.alert(
        "Image Uploaded",
        "Image Uploaded to the Cloud Successfully"
      );
    // Set a timeout to wait for the state update

    } catch(e) {
      console.log(e);
    }
  
    const downloadURL = await storage().ref(`${directory}/images/${filename}`).getDownloadURL();
    handleProductItemChange(index, 'ImageUri', downloadURL);

      // Update the uploaded state after the task completes
      task.then(() => {
        setProductItems(prevItems => {
          const updatedItems = [...prevItems];
          updatedItems[index] = { ...updatedItems[index], uploaded: true };
          console.log("UpdatedItems:", updatedItems)
          return updatedItems;
        });
      });

  };




  
  // Function to submit all product items
  const onSubmit = async () => {

    let incompleteProductItemIndex = -1;
    productItems.forEach((item, index) => { 
      if (!item.Description || !item.Quantity || !item.UnitPrice ||!item.SampleCode || !item.Description.trim() === "" ||
      !item.Quantity.trim() === "" ||!item.UnitPrice.trim() === "" || !item.SampleCode.trim() === "") {
        incompleteProductItemIndex = index;
      }
    }); 
  
    if (incompleteProductItemIndex !== -1) {
      Alert.alert('Please complete the form for adding product item ' + (incompleteProductItemIndex + 1));
      setErrorLoading(true);
      return;
    }
  
  
   // Check if any image is not uploaded
   const imageNotUploadedIndex = productItems.findIndex(item => !item.uploaded);
   if (imageNotUploadedIndex !== -1) {
     Alert.alert('Please select and upload an image for all product items');
     return;
   }
 

    setLoading(true);
    setErrorLoading(false);

    try {
      await Promise.all(productItems.map(async (item) => { 
        await firestore().collection('ProductInvoice').add({
          ...item,  
          completeDescription: `${item?.Description} - ${item?.SampleCode}`,
          invoiceDate: new Date(),  
          invoiceNo:invoice.invoiceNo, 
          checked: false, 
          userId: user?.uid,    
        }); 
      })); 

      await Promise.all(productItems.map(async (item) => { 
        await firestore().collection('ProductSelect').add({
          ...item,  
          completeDescription: `${item?.Description} - ${item?.SampleCode}`,
          invoiceDate: new Date(),  
          invoiceNo:invoice.invoiceNo, 
          checked: false, 
          userId: user?.uid,  
          type: "productSelect"   
  
        }); 
      }));   

      Alert.alert('All product items saved successfully');
      setLoading(false);
      dispatch(setToUpdate());
      setProductItems([{ ImageUri: imagePath, Description: '', Quantity: '', UnitPrice: '', Amount: '',uploaded:false, uploading: false }])
      if(invoice.invoiceType === "TECHNICAL PROPOSAL") {
        navigation.navigate('ExportPdf')
      } else {
        navigation.navigate('Summary')
      } 
      dispatch(fetchProductItem(user?.uid))  
      dispatch(fetchProductSelect(user?.uid))  
    } catch (error) {
      console.log('Error when adding product items:', error.message);
      setLoading(false);
      setErrorLoading(true);
      Alert.alert('Error', 'Failed to save product items');
    }
  };

  
  if (invoiceCreated || invoices?.userId ) {
  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backContainer} hitSlop={8} onPress={handleBack}>
        <Image
          style={styles.backIcon}
          source={require('../../../assets/back.png')}
        />
      </Pressable> 
      <Title type="thin">Add a New Product</Title>

      <ScrollView>
        {productItems.map((item, index) => (
          <View key={index}>
          <Text style={styles.label}>Product Item {index+1}</Text>
            <TouchableOpacity onPress={() => setModalVisible(index)}>
              <View style={styles.Photo}>
                <ImageBackground source={{ uri: item.ImageUri }} style={styles.imageBackground}>
                  <Text style={styles.labelPhoto}>Select an image</Text>  
                </ImageBackground>
              </View> 
            </TouchableOpacity>

            <Modal animationType="fade" transparent={true} visible={modalVisible  === index} onRequestClose={() => { setModalVisible(false); }}>
              <View style={styles.centeredView}> 
                <View style={styles.modalView}>
                  <TouchableOpacity onPress={() => takePhotoFromCamera(index)} style={styles.buttonUpload}>
                    <SimpleLineIcons size={60}  color={colors.black} name="camera" /> 
                    <Text style={styles.textStyle}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => choosePhotoFromLibrary(index)} style={styles.buttonUpload}>
                    <MaterialIcons size={60}  color={colors.black} name="photo-library" /> 
                    <Text style={styles.textStyle}>Library</Text>  
                  </TouchableOpacity>
                  <AntDesign size={20} onPress={() => setModalVisible(false)}  style={styles.closeButton} color={colors.black} name="close" /> 
                </View>   
              </View>   
            </Modal>

            <View style={styles.PhotoContainer}>
              {item.uploading ? (
                <View style={styles.status}>
                  <Text>{transferred} % completed</Text>
                  <ActivityIndicator size="large" color="#0000ff" /> 
                </View> 
              ) : (    
                <TouchableOpacity onPress={() => uploadImage(index)} style={styles.takePhoto}>
                  <Text style={styles.textPhoto}> Upload Image</Text>  
                </TouchableOpacity>      
              )}
            </View>

            <Text style={styles.label}>Sample Description</Text>
            <Input
              value={item?.Description}
              onChangeText={(value) => handleProductItemChange(index, 'Description', value)}
              outlined
              placeholder="Enter Description"
              multiline={true}
              numberOfLines={1}  
            />
        
              
      <Text style={styles.label}>Sample Code</Text> 
        <Input
          value={item?.SampleCode}
          onChangeText={(value) => handleProductItemChange(index, 'SampleCode', value)} 
          outlined
          placeholder="EQEC507"
        />
 

            <Text style={styles.label}>Quantity</Text>
            <Input
              value={item.Quantity}
              onChangeText={(value) => handleProductItemChange(index, 'Quantity', value)}
              outlined
              placeholder="2"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Unit Price</Text>
            <Input
              value={item.UnitPrice}
              onChangeText={(value) => handleProductItemChange(index, 'UnitPrice', value)}
              outlined
              placeholder="N500" 
              keyboardType="numeric"
            />

            <Text style={styles.label}>Amount</Text>
            <Text style={styles.labelAmount}>{item.Amount}</Text> 
           
           {productItems.length > 1 && (
             <Button style={styles.button}  del="red" onPress={() => deleteProductItem(index)}>
             <Text>Delete</Text> 
           </Button>  
           )}

           <View style={{height: 37}}></View>

          </View>
        ))}
         
        <Button style={styles.button} type="blue" onPress={addProductItem}>
            <Text>Add Product</Text> 
          </Button> 

          <Button style={styles.button} type="blue" onPress={() => navigation.navigate("SelectProduct")}>
            <Text>Select Product</Text> 
          </Button>  
 
        {loading ? (
          <ActivityIndicator /> 
        ) : (
          <Button style={styles.button} type="blue" onPress={onSubmit}>
            <Text>Done</Text> 
          </Button>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

return (
  <SafeAreaView style={styles.container} >
  <Pressable style={styles.backContainer} hitSlop={8} onPress={handleBack}>
    <Image
      style={styles.backIcon}
      source={require('../../../assets/back.png')}
    />
  </Pressable> 
  <Title type="thin">Add a New Product</Title>  
  {/* <Text style={styles.text1}>You need to create an invoice before adding a new product</Text> */}
  </SafeAreaView> 
)  

};


export default React.memo(AddProduct);
